import { h, Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { signal, computed, effect } from "@preact/signals";
// Comlink kaldırıldı
import debounce from 'just-debounce-it';
// Remote tipi artık gerekli değil, kaldırılabilir veya bırakılabilir
// import type { Remote } from 'comlink';

import Logger from '@/utils/logger';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import StaticTable from './StaticTable';
import Pagination from './Pagination';

// Tipler
interface GalleryItem { id: string; h: string; s: string; a: string; t: string[]; p: boolean; }
interface TableDataItem { href: string; text: string; label: string; }
interface CizelgeData { tags: TableDataItem[]; updated: TableDataItem[]; paginationInfo: { totalItems: number; itemsPerPage: number; totalPages: number; }; }
// SearchWorkerApi kaldırıldı

// Pagefind API Tipleri (env.d.ts'de de tanımlı)
interface PagefindApi { search: (query: string) => Promise<{ results: PagefindResultItem[] }>; /* ... */ }
interface PagefindResultItem { data: () => Promise<PagefindResultData>; id: string; /* ... */ }
interface PagefindResultData { meta?: { id?: string }; id?: string; /* ... */ }

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

export default function GalleryManager() {
    Logger.info('[GalleryManager] Ada render ediliyor (Ana Thread Pagefind)...');

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
    const pagefindApi = useRef<PagefindApi | null>(null); // Pagefind API ref'i

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
            if (searchQuery.peek() !== queryFromUrl) { searchQuery.value = queryFromUrl; if (filteredItemIds.peek() !== null) filteredItemIds.value = null; }
            if (currentPage.peek() !== pageFromUrl) { currentPage.value = pageFromUrl; }
        };
        syncStateFromURL();
        document.addEventListener('astro:page-load', syncStateFromURL);

        fetcher('/json/cizelge.json')
            .then(data => {
                const typedData = data as CizelgeData; setCizelgeData(typedData); setCizelgeError(null);
                const currentPg = currentPage.peek(); const totalPgs = typedData?.paginationInfo?.totalPages ?? 1;
                if (currentPg > totalPgs) { currentPage.value = 1; }
            })
            .catch(error => { setCizelgeError(error); })
            .finally(() => setCizelgeLoading(false));

        // --- Pagefind Script Yükleme (Ana Thread) ---
        let scriptElement: HTMLScriptElement | null = null;
        const loadPagefindScript = () => {
             if (document.getElementById('pagefind-script')) {
                  Logger.info('[GalleryManager] Pagefind script zaten DOM\'da.');
                  // Script varsa API'yi kontrol et
                  if (window.pagefind && typeof window.pagefind.search === 'function' && !pagefindApi.current) {
                      pagefindApi.current = window.pagefind;
                      isPagefindReady.value = true;
                      pagefindScriptError.value = null;
                      Logger.info('[GalleryManager] Mevcut Pagefind API kullanıma hazır.');
                  } else if (!window.pagefind) {
                      // Script var ama API yoksa (önceki hata?), logla
                       Logger.warn('[GalleryManager] Script DOM\'da ama Pagefind API henüz hazır değil (bekleniyor veya hata var).');
                       // Hata state'ini ayarlamak yerine onload'u bekleyebiliriz.
                  }
                  return; // Tekrar yükleme
             }

            Logger.info('[GalleryManager] Pagefind script yükleniyor (Ana Thread)...');
            scriptElement = document.createElement('script');
            scriptElement.id = 'pagefind-script';
            scriptElement.src = '/pagefind/pagefind.js';
            scriptElement.type = 'module';
            scriptElement.onload = () => {
                Logger.info('[GalleryManager] Pagefind script başarıyla yüklendi.');
                if (window.pagefind && typeof window.pagefind.search === 'function') {
                    pagefindApi.current = window.pagefind;
                    isPagefindReady.value = true;
                    pagefindScriptError.value = null;
                    Logger.info('[GalleryManager] Pagefind API kullanıma hazır.');
                } else {
                    Logger.error('[GalleryManager] Pagefind script yüklendi ancak API bulunamadı!');
                    pagefindScriptError.value = "Arama motoru başlatılamadı (API bulunamadı).";
                    isPagefindReady.value = false;
                }
            };
            scriptElement.onerror = (ev) => {
                Logger.error('[GalleryManager] Pagefind script yüklenemedi!', ev);
                pagefindScriptError.value = "Arama altyapısı yüklenemedi.";
                isPagefindReady.value = false;
                pagefindApi.current = null;
            };
            document.body.appendChild(scriptElement);
        };

        loadPagefindScript(); // Script'i yükle veya kontrol et

        // --- Temizleme ---
        return () => {
            document.removeEventListener('astro:page-load', syncStateFromURL);
            Logger.info('[GalleryManager] Ada kaldırılıyor...');
            pagefindApi.current = null; // Ref'i temizle
            isPagefindReady.value = false; // Hazır değil olarak işaretle
            const existingScript = document.getElementById('pagefind-script');
            if (existingScript) {
                 // Script'i kaldırmak sonraki sayfa yüklemelerinde sorun yaratabilir
                 // Eğer her sayfa yüklemesinde bu component yeniden mount oluyorsa kaldırmak mantıklı.
                 // Eğer Astro client:idle gibi bir mekanizma varsa ve component kalıyorsa, kaldırmamak daha iyi olabilir.
                 // Şimdilik kaldırıyoruz.
                 existingScript.remove();
                 Logger.info('[GalleryManager] Pagefind script DOM\'dan kaldırıldı.');
            }
        };
    }, []); // Sadece ilk mount'ta çalışır

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
    const combinedError = computed(() => cizelgeError?.message || pageError?.message || searchError.value || pagefindScriptError.value); // workerInitError kaldırıldı

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
                     catch (e) { return null; }
                });
                const resolvedIds = await Promise.all(dataPromises);
                const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');
                filteredItemIds.value = ids;
            } catch (err) {
                Logger.error(`[Search] Arama başarısız ("${trimmedQuery}"):`, err);
                searchError.value = err instanceof Error ? err.message : 'Arama hatası.';
                filteredItemIds.value = [];
            } finally { isSearching.value = false; }
        }, DEBOUNCE_WAIT);
    }, [isPagefindReady.value, pagefindScriptError.value]); // Sinyal değerlerini bağımlılığa ekle

    // Arama Sorgusu Değiştiğinde Tetikleme
    effect(() => { debouncedPerformSearch(searchQuery.value); });

    // Navigasyon
    const navigateTo = (path: string) => { if (typeof window !== 'undefined') { const current = window.location.pathname + window.location.search + window.location.hash; if (current !== path) window.history.pushState({}, '', path); } };
    const buildPath = (page: number, query: string): string => { const q = (query || '').trim(); if (!q) return page > 1 ? `/${page}` : '/'; return `/ara/${encodeURIComponent(q)}${page > 1 ? `/${page}` : ''}`; };
    const handleSearch = (query: string) => { navigateTo(buildPath(1, query)); };

    // Render Yardımcıları
    const displayItems = computed((): GalleryItem[] => { if (!pageData) return []; const ids = filteredItemIds.value; if (ids === null) return pageData; const idSet = new Set(ids); return pageData.filter(item => idSet.has(item.id)); });
    const searchStatusMessage = computed(() => { if (searchQuery.value && filteredItemIds.value?.length === 0 && !isSearching.value) return <p class="search-no-results">"{searchQuery.value}" için sonuç bulunamadı.</p>; return null; });
    const showStaticTables = computed(() => { if (!isClient || !cizelgeData) return false; const path = window.location.pathname; return (path === '/' || /^\/1$/.test(path)) && !searchQuery.value; });

    // --- Render (JSX Kontrolleri Düzeltildi) ---
    if (!isClient) { return <div data-hydration-placeholder="true" style="min-height: 400px;" aria-busy="true">Yükleniyor...</div>; }
    if (combinedError.value) {
        let msg = combinedError.value || 'Hata oluştu.';
        // Daha spesifik hata mesajları
        if (pagefindScriptError.value) msg = pagefindScriptError.value;
        else if (searchError.value) msg = searchError.value;
        else if (cizelgeError || pageError) msg = 'Veri yükleme hatası.';
        return <p class="error-message">{msg}</p>;
    }
    return (
        <Fragment>
            <SearchBar initialQuery={searchQuery.value} onSearch={handleSearch} isLoading={isSearching.value} />
            {searchStatusMessage.value}
            {/* JSX Kontrolleri: showStaticTables doğruysa VE cizelgeData/tags varsa render et */}
            {showStaticTables.value && cizelgeData?.tags && cizelgeData.tags.length > 0 && (
                <StaticTable title="#İLİŞTİRİLER" data={cizelgeData.tags} columns={3} tableClass="tags-container" />
            )}
            <ImageGrid items={displayItems.value} isLoading={isLoading.value || isSearching.value} />
            {totalPages.value > 1 && !searchQuery.value && (
                <Pagination currentPage={currentPage.value} totalPages={totalPages.value} buildPath={(page) => buildPath(page, searchQuery.value)} />
            )}
            {/* JSX Kontrolleri: showStaticTables doğruysa VE cizelgeData/updated varsa render et */}
            {showStaticTables.value && cizelgeData?.updated && cizelgeData.updated.length > 0 && (
                <StaticTable title="SON GÜNCELLENEN SUNUMLAR" data={cizelgeData.updated} columns={2} tableClass="updated-table-container" />
            )}
        </Fragment>
    );
}