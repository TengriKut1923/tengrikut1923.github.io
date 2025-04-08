import { h, Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { signal, computed, effect } from "@preact/signals";
import debounce from 'just-debounce-it';

import Logger from '@/utils/logger';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import StaticTable from './StaticTable';
import Pagination from './Pagination';

// Tipler
interface GalleryItem { id: string; h: string; s: string; a: string; t: string[]; p: boolean; }
interface TableDataItem { href: string; text: string; label: string; }
interface CizelgeData { tags: TableDataItem[]; updated: TableDataItem[]; paginationInfo: { totalItems: number; itemsPerPage: number; totalPages: number; }; }

// Pagefind API Tipleri (env.d.ts'de de tanımlı)
interface PagefindApi { search: (query: string) => Promise<{ results: PagefindResultItem[] }>; options?: (opts: any) => Promise<void>; }
interface PagefindResultItem { data: () => Promise<PagefindResultData>; id: string; }
interface PagefindResultData { meta?: { id?: string }; id?: string; }

// Fetcher
const fetcher = async (url: string): Promise<any> => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = new Error(`Veri çekme hatası! Durum: ${res.status} URL: ${url}`);
        Logger.error(`[Fetcher] ${url} çekilirken hata:`, error.message);
        throw error;
    }
    try { return await res.json(); } catch (jsonError) {
        Logger.error(`[Fetcher] ${url} JSON parse hatası:`, jsonError);
        throw new Error(`Geçersiz JSON yanıtı alındı: ${url}`);
    }
};

// Sabitler
const DEBOUNCE_WAIT = 300;
const PAGEFIND_POLL_INTERVAL = 100; // ms cinsinden yoklama aralığı
const PAGEFIND_POLL_TIMEOUT = 3000; // ms cinsinden maksimum bekleme süresi

// `window` için beklenen tip
type WindowWithPagefind = Window & typeof globalThis & { pagefind?: PagefindApi };

export default function GalleryManager() {
    Logger.info('[GalleryManager] Ada render ediliyor (Ana Thread Pagefind, Polling, Astro Navigate)...');

    // State ve Sinyaller
    const [isClient, setIsClient] = useState(false);
    const [cizelgeData, setCizelgeData] = useState<CizelgeData | undefined>(undefined);
    const [cizelgeError, setCizelgeError] = useState<Error | null>(null);
    const [cizelgeLoading, setCizelgeLoading] = useState<boolean>(true);
    const [pageData, setPageData] = useState<GalleryItem[] | undefined>(undefined);
    const [pageError, setPageError] = useState<Error | null>(null);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const currentPage = signal<number>(1);
    const searchQuery = signal<string>('');
    const filteredItemIds = signal<string[] | null>(null);
    const isSearching = signal<boolean>(false);
    const searchError = signal<string | null>(null);
    const pagefindScriptError = signal<string | null>(null);
    const isPagefindReady = signal<boolean>(false);
    const pagefindApi = useRef<PagefindApi | null>(null);
    const pollIntervalRef = useRef<number | undefined>(undefined); // Polling interval ID'si

    // --- Efektler ---
    useEffect(() => {
        Logger.info('[GalleryManager] Client-side mount gerçekleşti.');
        setIsClient(true);

        const syncStateFromURL = () => {
            if (typeof window === 'undefined') return;
            const path = window.location.pathname;
            let queryFromUrl = ''; let pageFromUrl = 1;
            const parts = path.split('/').filter(Boolean);
            if (parts[0] === 'ara') {
                queryFromUrl = decodeURIComponent(parts[1] || '').trim();
                pageFromUrl = parseInt(parts[2] || '1', 10);
            } else if (parts.length === 1 && /^\d+$/.test(parts[0])) {
                pageFromUrl = parseInt(parts[0], 10);
            }
            pageFromUrl = Math.max(1, isNaN(pageFromUrl) ? 1 : pageFromUrl);
            // Sinyal değerlerini sadece gerçekten değiştiyse güncelle
            if (searchQuery.peek() !== queryFromUrl) {
                Logger.info(`[URL Sync] Query: ${searchQuery.peek()} -> ${queryFromUrl}`);
                searchQuery.value = queryFromUrl;
                // Arama sorgusu değiştiğinde filtreleri sıfırla (arama tekrar yapılacak)
                if (filteredItemIds.peek() !== null) filteredItemIds.value = null;
            }
            // Sayfayı da sadece değiştiyse güncelle
            if (currentPage.peek() !== pageFromUrl) {
                 Logger.info(`[URL Sync] Page: ${currentPage.peek()} -> ${pageFromUrl}`);
                 currentPage.value = pageFromUrl;
            }
        };
        syncStateFromURL();
        // View Transitions sonrası state'i senkronize etmek için 'astro:after-swap' kullan
        document.addEventListener('astro:after-swap', syncStateFromURL);

        // Cizelge verisini çek
        fetcher('/json/cizelge.json')
            .then(data => {
                const typedData = data as CizelgeData; setCizelgeData(typedData); setCizelgeError(null);
                // Cizelge geldikten sonra sayfa numarasını doğrula
                const currentPg = currentPage.peek(); const totalPgs = typedData?.paginationInfo?.totalPages ?? 1;
                if (currentPg > totalPgs) {
                    Logger.warn(`[URL Sync] Geçersiz sayfa (${currentPg}) düzeltiliyor -> 1`);
                    currentPage.value = 1;
                    // Eğer sayfa 1'e düzeltildiyse ve URL farklıysa, URL'yi de güncellemek gerekebilir
                    // Ancak bu syncStateFromURL'in tekrar çalışmasıyla düzelebilir.
                }
            })
            .catch(error => { setCizelgeError(error); })
            .finally(() => setCizelgeLoading(false));

        // --- Pagefind Script Yükleme ve API Hazırlığını Bekleme (Polling ile) ---
        let scriptElement: HTMLScriptElement | null = null;
        const loadPagefindScript = () => {
             const existingScript = document.getElementById('pagefind-script');
             const potentialPagefind = (window as WindowWithPagefind).pagefind;

             if (existingScript) {
                  Logger.info('[GalleryManager] Pagefind script zaten DOM\'da.');
                  if (potentialPagefind && typeof potentialPagefind.search === 'function' && !pagefindApi.current) {
                      pagefindApi.current = potentialPagefind;
                      isPagefindReady.value = true;
                      pagefindScriptError.value = null;
                      Logger.info('[GalleryManager] Mevcut Pagefind API kullanıma hazır.');
                  } else if (!potentialPagefind && isPagefindReady.peek()) {
                       Logger.warn('[GalleryManager] Pagefind API beklenmedik şekilde kayboldu!');
                       isPagefindReady.value = false;
                       pagefindScriptError.value = "Arama motoru bağlantısı koptu.";
                  } else if (!potentialPagefind) {
                       Logger.info('[GalleryManager] Mevcut script var ama API henüz hazır değil, onload bekleniyor olabilir.');
                  }
                  return; // Script zaten varsa tekrar ekleme
             }

            Logger.info('[GalleryManager] Pagefind script yükleniyor (Ana Thread)...');
            scriptElement = document.createElement('script');
            scriptElement.id = 'pagefind-script';
            scriptElement.src = '/pagefind/pagefind.js';
            scriptElement.type = 'module';

            scriptElement.onload = () => {
                Logger.info('[GalleryManager] Pagefind script yüklendi, API bekleniyor (Polling)...');
                pagefindScriptError.value = null;

                let elapsedTime = 0;
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); // Önceki interval'i temizle

                pollIntervalRef.current = window.setInterval(() => {
                    const currentApi = (window as WindowWithPagefind).pagefind;
                    if (currentApi && typeof currentApi.search === 'function') {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = undefined;
                        if (!pagefindApi.current) { // Sadece ilk defa bulduysak ata
                             pagefindApi.current = currentApi;
                             isPagefindReady.value = true;
                             Logger.info('[GalleryManager] Pagefind API yoklama ile bulundu ve hazır.');
                        }
                    } else {
                        elapsedTime += PAGEFIND_POLL_INTERVAL;
                        if (elapsedTime >= PAGEFIND_POLL_TIMEOUT) {
                            clearInterval(pollIntervalRef.current);
                            pollIntervalRef.current = undefined;
                            if (!isPagefindReady.peek()) { // Hala hazır değilse hata ver
                                 Logger.error('[GalleryManager] Pagefind API zaman aşımına uğradı!');
                                 pagefindScriptError.value = "Arama motoru başlatılamadı (zaman aşımı).";
                                 isPagefindReady.value = false;
                                 pagefindApi.current = null;
                            }
                        }
                    }
                }, PAGEFIND_POLL_INTERVAL);
            };
            scriptElement.onerror = (ev) => {
                Logger.error('[GalleryManager] Pagefind script yüklenemedi!', ev);
                pagefindScriptError.value = "Arama altyapısı yüklenemedi.";
                isPagefindReady.value = false;
                pagefindApi.current = null;
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); // Hata durumunda polling'i durdur
                pollIntervalRef.current = undefined;
            };
            document.body.appendChild(scriptElement);
        };

        loadPagefindScript(); // Sayfa yüklendiğinde script yüklemeyi başlat

        // --- Temizleme ---
        return () => {
             document.removeEventListener('astro:after-swap', syncStateFromURL);
             Logger.info('[GalleryManager] Ada kaldırılıyor...');
             if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
             pollIntervalRef.current = undefined;
             pagefindApi.current = null;
             isPagefindReady.value = false;
             const existingScript = document.getElementById('pagefind-script');
             if (existingScript) {
                  existingScript.remove();
                  Logger.info('[GalleryManager] Pagefind script DOM\'dan kaldırıldı.');
             }
        };
    }, []);

    // Sayfa Verisi Çekme Efekti
    useEffect(() => {
        if (!isClient || !cizelgeData) return;
        const page = currentPage.value; const total = cizelgeData.paginationInfo.totalPages;
        if (page > 0 && page <= total) {
            setPageLoading(true); setPageError(null);
            fetcher(`/json/page-${page}.json`)
                .then(data => { setPageData(data as GalleryItem[]); })
                .catch(error => { setPageError(error); setPageData(undefined); })
                .finally(() => setPageLoading(false));
        } else if (total > 0) { setPageData(undefined); setPageLoading(false); }
    }, [isClient, currentPage.value, cizelgeData]);

    // Hesaplanan Değerler
    const paginationInfo = computed(() => cizelgeData?.paginationInfo ?? { totalItems: 0, itemsPerPage: 48, totalPages: 1 });
    const totalPages = computed(() => paginationInfo.value.totalPages);
    const isLoading = computed(() => cizelgeLoading || pageLoading);
    const combinedError = computed(() => cizelgeError?.message || pageError?.message || searchError.value || pagefindScriptError.value);

    // Debounced Search (Ana Thread API Kullanımı)
    const debouncedPerformSearch = useMemo(() => {
        return debounce(async (query: string) => {
            if (!isPagefindReady.value || !pagefindApi.current) {
                 searchError.value = pagefindScriptError.value || 'Arama motoru hazır değil.';
                 isSearching.value = false; filteredItemIds.value = []; return;
            }
            if (query === '') { filteredItemIds.value = null; isSearching.value = false; searchError.value = null; return; }

            const trimmedQuery = query.trim();
            isSearching.value = true; searchError.value = null;
            try {
                const searchResult = await pagefindApi.current.search(trimmedQuery);
                if (!searchResult?.results) { throw new Error('Pagefind geçersiz sonuç döndürdü.'); }
                const dataPromises = searchResult.results.map(async (result) => {
                     try { const data = await result.data(); return data?.meta?.id ?? data?.id ?? null; }
                     catch (e) { Logger.error("result.data() hatası:", e); return null; }
                });
                const resolvedIds = await Promise.all(dataPromises);
                const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');
                filteredItemIds.value = ids;
            } catch (err) {
                Logger.error(`[Search] Arama başarısız ("${trimmedQuery}"):`, err);
                searchError.value = err instanceof Error ? err.message : 'Arama sırasında hata.';
                filteredItemIds.value = [];
            } finally { isSearching.value = false; }
        }, DEBOUNCE_WAIT);
    }, [isPagefindReady.value, pagefindScriptError.value]); // Sinyal değerleri bağımlılık olarak eklendi

    // Arama Sorgusu Değiştiğinde Tetikleme
    effect(() => { debouncedPerformSearch(searchQuery.value); });

    // --- Navigasyon (Astro'nun navigate fonksiyonu ile) ---
    const navigateTo = (path: string) => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search + window.location.hash;
            if (currentPath !== path) {
                 Logger.info(`[Navigate] Astro navigate kullanılıyor: ${path}`);
                 navigate(path); // Astro'nun fonksiyonunu kullan
            } else {
                 Logger.info(`[Navigate] Zaten hedef yolda: ${path}`);
            }
        }
    };
    const buildPath = (page: number, query: string): string => {
        const cleanQuery = (query || '').trim();
        if (!cleanQuery) return page > 1 ? `/${page}` : '/';
        const safeQuery = encodeURIComponent(cleanQuery);
        return `/ara/${safeQuery}${page > 1 ? `/${page}` : ''}`;
    };
    const handleSearch = (query: string) => {
        // Arama yapıldığında 1. sayfaya gitmek için URL oluştur ve navigate et
        navigateTo(buildPath(1, query));
    };

    // Render Yardımcıları
    const displayItems = computed((): GalleryItem[] => { if (!pageData) return []; const ids = filteredItemIds.value; if (ids === null) return pageData; const idSet = new Set(ids); return pageData.filter(item => idSet.has(item.id)); });
    const searchStatusMessage = computed(() => { if (searchQuery.value && filteredItemIds.value?.length === 0 && !isSearching.value) return <p class="search-no-results">"{searchQuery.value}" için sonuç bulunamadı.</p>; return null; });
    const showStaticTables = computed(() => { if (!isClient || !cizelgeData) return false; const path = window.location.pathname; return (path === '/' || /^\/1$/.test(path)) && !searchQuery.value; });

    // --- Render ---
    if (!isClient) { return <div data-hydration-placeholder="true" style="min-height: 400px;" aria-busy="true">Yükleniyor...</div>; }
    if (combinedError.value) {
        let msg = combinedError.value || 'Hata oluştu.';
        if (pagefindScriptError.value) msg = pagefindScriptError.value;
        else if (searchError.value) msg = searchError.value;
        else if (cizelgeError || pageError) msg = 'Veri yükleme hatası.';
        return <p class="error-message">{msg}</p>;
    }
    return (
        <Fragment>
            <SearchBar initialQuery={searchQuery.value} onSearch={handleSearch} isLoading={isSearching.value} />
            {searchStatusMessage.value}
            {showStaticTables.value && cizelgeData?.tags?.length > 0 && (
                <StaticTable title="#İLİŞTİRİLER" data={cizelgeData.tags} columns={3} tableClass="tags-container" />
            )}
            <ImageGrid items={displayItems.value} isLoading={isLoading.value || isSearching.value} />
            {totalPages.value > 1 && !searchQuery.value && (
                <Pagination currentPage={currentPage.value} totalPages={totalPages.value} buildPath={(page) => buildPath(page, searchQuery.value)} />
            )}
            {showStaticTables.value && cizelgeData?.updated?.length > 0 && (
                <StaticTable title="SON GÜNCELLENEN SUNUMLAR" data={cizelgeData.updated} columns={2} tableClass="updated-table-container" />
            )}
        </Fragment>
    );
}