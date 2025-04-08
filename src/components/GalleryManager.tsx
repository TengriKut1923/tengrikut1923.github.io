import { h, Fragment } from 'preact';
// useState eklendi
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { signal, computed, effect } from "@preact/signals";
// useSWR kaldırıldı
import * as Comlink from 'comlink';
import debounce from 'just-debounce-it';

// Yardımcılar ve Bileşenler
import Logger from '@/utils/logger';
import SearchBar from './SearchBar'; // Bu dosyanın var olduğundan emin olun
import ImageGrid from './ImageGrid'; // Bu dosyanın var olduğundan emin olun
import StaticTable from './StaticTable'; // Bu dosyanın var olduğundan emin olun
import Pagination from './Pagination';   // Bu dosyanın var olduğundan emin olun

// Tipler (Projenizin gerçek veri yapısına göre güncelleyin)
interface GalleryItem {
    id: string;
    h: string; // href
    s: string; // imgSrc
    a: string; // alt
    t: string[]; // tags
    p: boolean; // pinned
}
interface TableDataItem { // StaticTable için veri tipi
    href: string;
    text: string;
    label: string;
}
interface CizelgeData {
    tags: TableDataItem[];
    updated: TableDataItem[];
    paginationInfo: {
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
    };
}
interface SearchWorkerApi { // Worker'ın expose ettiği fonksiyon(lar)
    performSearch: (query: string) => Promise<string[]>;
}

// Fetcher fonksiyonu (Doğrudan kullanılacak)
const fetcher = async (url: string): Promise<any> => { // Dönüş tipini any veya daha spesifik yapın
    const res = await fetch(url);
    if (!res.ok) {
        const error = new Error(`Veri çekme hatası! Durum: ${res.status} URL: ${url}`);
        Logger.error(`[Fetcher] ${url} çekilirken hata:`, error.message);
        throw error;
    }
    try {
        return await res.json();
    } catch (jsonError) {
        Logger.error(`[Fetcher] ${url} JSON parse hatası:`, jsonError);
        throw new Error(`Geçersiz JSON yanıtı alındı: ${url}`);
    }
};

// Sabitler
const DEBOUNCE_WAIT = 300;

export default function GalleryManager() {
    Logger.info('[GalleryManager] Ada render ediliyor...');

    // --- Client-Side Kontrol State'i ---
    const [isClient, setIsClient] = useState(false);

    // --- Client-Side Veri State'leri ---
    const [cizelgeData, setCizelgeData] = useState<CizelgeData | undefined>(undefined);
    const [cizelgeError, setCizelgeError] = useState<Error | null>(null);
    const [cizelgeLoading, setCizelgeLoading] = useState<boolean>(true); // Başlangıçta yükleniyor

    const [pageData, setPageData] = useState<GalleryItem[] | undefined>(undefined);
    const [pageError, setPageError] = useState<Error | null>(null);
    const [pageLoading, setPageLoading] = useState<boolean>(true); // Başlangıçta yükleniyor

    // --- Sinyaller (UI State Yönetimi) ---
    const currentPage = signal<number>(1);
    const searchQuery = signal<string>('');
    const filteredItemIds = signal<string[] | null>(null);
    const isSearching = signal<boolean>(false);
    const searchError = signal<string | null>(null); // Arama işlemiyle ilgili hata
    const pagefindScriptError = signal<string | null>(null); // Pagefind script yükleme hatası

    // Worker State
    const searchWorkerApi = useRef<Comlink.Remote<SearchWorkerApi> | null>(null);
    const isWorkerReady = signal<boolean>(false); // Comlink bağlantısı hazır mı?
    const workerInitError = signal<string | null>(null); // Worker başlatma hatası

    // --- Efektler ---

    // Client-Side Kurulum, URL Senkronizasyonu, Veri Çekme, Worker Başlatma
    useEffect(() => {
        Logger.info('[GalleryManager] Client-side mount gerçekleşti.');
        setIsClient(true); // Client'da olduğumuzu işaretle

        // --- URL Sync Logic ---
        const syncStateFromURL = () => {
            if (typeof window === 'undefined') return;
            const path = window.location.pathname;
            let queryFromUrl = '';
            let pageFromUrl = 1;
            const parts = path.split('/').filter(Boolean);

            if (parts[0] === 'ara') {
                queryFromUrl = decodeURIComponent(parts[1] || '').trim();
                pageFromUrl = parseInt(parts[2] || '1', 10);
            } else if (parts.length === 1 && /^\d+$/.test(parts[0])) {
                pageFromUrl = parseInt(parts[0], 10);
            }

            pageFromUrl = Math.max(1, isNaN(pageFromUrl) ? 1 : pageFromUrl);

            if (searchQuery.peek() !== queryFromUrl) {
                Logger.info(`[URL Sync] Arama sorgusu değişti: ${searchQuery.peek()} -> ${queryFromUrl}`);
                searchQuery.value = queryFromUrl;
                if (filteredItemIds.peek() !== null) filteredItemIds.value = null;
            }
            // Sayfa değeri sadece cizelgeData geldikten sonra kontrol edilebilir
             if (currentPage.peek() !== pageFromUrl) {
                 Logger.info(`[URL Sync] Sayfa değişti (geçici): ${currentPage.peek()} -> ${pageFromUrl}`);
                 currentPage.value = pageFromUrl; // Önce ata, sonra kontrol et
            }
        };
        syncStateFromURL(); // İlk yüklemede çalıştır
        document.addEventListener('astro:page-load', syncStateFromURL); // Sayfa geçişlerinde çalıştır

        // --- Cizelge Verisi Çekme ---
        setCizelgeLoading(true);
        fetcher('/json/cizelge.json')
            .then(data => {
                const typedData = data as CizelgeData;
                setCizelgeData(typedData);
                setCizelgeError(null);
                // Cizelge geldikten sonra sayfa numarasını doğrula
                const currentPg = currentPage.peek();
                const totalPgs = typedData?.paginationInfo?.totalPages ?? 1;
                if (currentPg > totalPgs) {
                    Logger.warn(`[URL Sync] Geçersiz sayfa (${currentPg}) düzeltiliyor -> 1`);
                    currentPage.value = 1;
                }
            })
            .catch(error => {
                Logger.error("[Fetch Effect] Cizelge verisi çekilemedi:", error);
                setCizelgeError(error);
            })
            .finally(() => setCizelgeLoading(false));

        // --- Worker Başlatma ve Pagefind Script Yükleme ---
        let worker: Worker | null = null;
        let remoteApi: Comlink.Remote<SearchWorkerApi> | null = null;
        try {
            Logger.info('[GalleryManager] Arama Worker başlatılıyor...');
            worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url), { type: 'module' });
            remoteApi = Comlink.wrap<SearchWorkerApi>(worker);
            searchWorkerApi.current = remoteApi;
            isWorkerReady.value = true;
            workerInitError.value = null;
            Logger.info('[GalleryManager] Arama Worker Comlink bağlantısı hazır.');

            worker.onerror = (event) => {
                 Logger.error('[GalleryManager] Arama Worker hatası:', event.message, event.error);
                 isWorkerReady.value = false;
                 workerInitError.value = 'Arama motoru çalıştırılamadı.';
                 searchWorkerApi.current = null;
            }

            if (!document.getElementById('pagefind-script')) {
                Logger.info('[GalleryManager] Pagefind script yükleniyor...');
                const script = document.createElement('script');
                script.id = 'pagefind-script';
                script.src = '/pagefind/pagefind.js'; // Build sonrası yol
                script.onload = () => {
                    Logger.info('[GalleryManager] Pagefind script yüklendi.');
                    pagefindScriptError.value = null;
                };
                script.onerror = (ev) => {
                    Logger.error('[GalleryManager] Pagefind script yüklenemedi!', ev);
                    pagefindScriptError.value = "Arama altyapısı yüklenemedi.";
                };
                document.body.appendChild(script);
            } else {
                 Logger.info('[GalleryManager] Pagefind script zaten yüklenmiş veya yükleniyor.');
            }

        } catch(err) {
             Logger.error('[GalleryManager] Worker başlatma/script yükleme hatası:', err);
             isWorkerReady.value = false;
             workerInitError.value = 'Arama motoru başlatılamadı (genel hata).';
             searchWorkerApi.current = null;
             if (worker) worker.terminate();
        }

        // --- Temizleme ---
        return () => {
            document.removeEventListener('astro:page-load', syncStateFromURL);
            Logger.info('[GalleryManager] Ada kaldırılıyor, worker sonlandırılıyor...');
            if (remoteApi) {
                 try { remoteApi[Comlink.releaseProxy](); } catch (e) { Logger.warn('Proxy serbest bırakılırken hata:', e); }
            }
            if (worker) worker.terminate();
            searchWorkerApi.current = null;
            isWorkerReady.value = false;
        };
    }, []); // Sadece mount'ta çalışır

    // --- Sayfa Verisi Çekme Efekti ---
    useEffect(() => {
        if (!isClient || !cizelgeData) return; // Sadece client'da ve cizelge varken

        const page = currentPage.value;
        const total = cizelgeData.paginationInfo.totalPages;

        if (page > 0 && page <= total) {
            const pageUrl = `/json/page-${page}.json`;
            Logger.info(`[Fetch Effect] Sayfa verisi çekiliyor: ${pageUrl}`);
            setPageLoading(true);
            setPageError(null);
            // setPageData(undefined); // İsteğe bağlı: Önceki veriyi hemen temizle

            fetcher(pageUrl)
                .then(data => {
                    setPageData(data as GalleryItem[]);
                })
                .catch(error => {
                    Logger.error(`[Fetch Effect] Sayfa ${page} verisi çekilemedi:`, error);
                    setPageError(error);
                    setPageData(undefined); // Hata durumunda veriyi temizle
                })
                .finally(() => setPageLoading(false));
        } else if (total > 0) { // Cizelge geldi ama sayfa geçersiz
            setPageData(undefined);
            setPageLoading(false);
            Logger.warn(`[Fetch Effect] Geçersiz sayfa ${page} (toplam ${total}), veri çekilmedi.`);
        }
    }, [isClient, currentPage.value, cizelgeData]); // Bu değerler değiştiğinde tetiklenir

    // --- Hesaplanan Değerler ---
    const paginationInfo = computed(() => cizelgeData?.paginationInfo ?? { totalItems: 0, itemsPerPage: 48, totalPages: 1 });
    const totalPages = computed(() => paginationInfo.value.totalPages);
    const isLoading = computed(() => cizelgeLoading || pageLoading); // Genel yükleme durumu
    // Genel hata durumu
    const combinedError = computed(() => cizelgeError?.message || pageError?.message || searchError.value || pagefindScriptError.value || workerInitError.value);

    // Debounced Search Fonksiyonu
    const debouncedPerformSearch = useMemo(() => {
        return debounce(async (query: string) => {
            // Worker bağlantısı ve Pagefind script hatası kontrolü
            if (!searchWorkerApi.current || !isWorkerReady.value || pagefindScriptError.value || workerInitError.value) {
                Logger.warn('[Search] Worker/Pagefind hazır değil, arama yapılamıyor.');
                searchError.value = workerInitError.value || pagefindScriptError.value || 'Arama motoru hazır değil.';
                isSearching.value = false;
                filteredItemIds.value = [];
                return;
            }

            if (query === '') {
                Logger.info('[Search] Sorgu boş, filtreler temizleniyor.');
                filteredItemIds.value = null;
                isSearching.value = false;
                searchError.value = null;
                return;
            }

            Logger.info(`[Search] Debounced arama başlıyor: "${query}"`);
            isSearching.value = true;
            searchError.value = null; // Önceki arama hatasını temizle
            try {
                const ids = await searchWorkerApi.current.performSearch(query);
                // Worker içinde pagefind yüklenmemişse boş dizi dönebilir
                 if (ids.length === 0 && query !== '') {
                     Logger.warn(`[Search] "${query}" için sonuç bulunamadı veya Pagefind henüz hazır değil.`);
                } else {
                    Logger.info(`[Search] "${query}" için ${ids.length} ID bulundu.`);
                }
                filteredItemIds.value = ids;
            } catch (err) {
                Logger.error(`[Search] Worker araması başarısız oldu ("${query}"):`, err);
                searchError.value = 'Arama sırasında bir hata oluştu.';
                filteredItemIds.value = [];
            } finally {
                isSearching.value = false;
            }
        }, DEBOUNCE_WAIT);
    // Bağımlılıklar güncellendi
    }, [isWorkerReady.value, workerInitError.value, pagefindScriptError.value]);

    // Arama Sorgusu Değiştiğinde Arama Tetiklemesi
    effect(() => {
        const currentQuery = searchQuery.value;
        Logger.info(`[Effect] Arama sorgusu değişti: "${currentQuery}", debounced arama tetikleniyor...`);
        // isReady kontrolü debounce içinde yapılıyor
        debouncedPerformSearch(currentQuery);
    });

    // --- Navigasyon ve URL Yönetimi ---
    const navigateTo = (path: string) => {
        if (typeof window === 'undefined') return;
        const currentFullPath = window.location.pathname + window.location.search;
        if (currentFullPath !== path) {
            Logger.info(`[Navigate] Yönlendiriliyor: ${path}`);
            window.history.pushState({}, '', path);
            // Astro'nun 'astro:page-load' olayını tetiklemesini bekleriz
        } else {
            Logger.info(`[Navigate] Zaten hedef yolda: ${path}`);
        }
    };

    const buildPath = (page: number, query: string): string => {
        const cleanQuery = (query || '').trim();
        if (!cleanQuery) {
            return page > 1 ? `/${page}` : '/';
        } else {
            const safeQuery = encodeURIComponent(cleanQuery);
            return `/ara/${safeQuery}${page > 1 ? `/${page}` : ''}`;
        }
    };

    const handleSearch = (query: string) => {
        const newPath = buildPath(1, query);
        navigateTo(newPath);
    };

    // --- Render Edilecek Öğeler ---
    const displayItems = computed((): GalleryItem[] => {
        if (!pageData) return []; // Client pageData kullan

        const currentSearchIds = filteredItemIds.value;
        if (currentSearchIds === null) {
            return pageData;
        } else {
            const idSet = new Set(currentSearchIds);
            return pageData.filter((item: GalleryItem) => idSet.has(item.id));
        }
    });

    const searchStatusMessage = computed(() => {
        if (searchQuery.value && filteredItemIds.value !== null && filteredItemIds.value.length === 0 && !isSearching.value) {
            return <p class="search-no-results">"{searchQuery.value}" için sonuç bulunamadı.</p>;
        }
        return null;
    });

    const showStaticTables = computed(() => {
        if (!isClient || !cizelgeData) return false; // Client'da ve cizelge varken
        const currentPathname = window.location.pathname;
        const isRootPath = currentPathname === '/';
        const pageIsOne = currentPage.value === 1;
        return (isRootPath || pageIsOne) && !searchQuery.value;
    });

    // --- Render ---

    // Client-side mount olmadan önce placeholder
    if (!isClient) {
        Logger.info('[GalleryManager] Client-side mount bekleniyor, placeholder render ediliyor.');
        return <div data-hydration-placeholder="true" style="min-height: 400px;" aria-busy="true"></div>;
    }

    // Hata Gösterimi
    if (combinedError.value) {
        Logger.error(`[Render] Hata oluştu: ${combinedError.value}`);
        // Hata mesajını kullanıcı dostu hale getir
        let userErrorMessage = 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        if (pagefindScriptError.value) userErrorMessage = pagefindScriptError.value;
        else if (workerInitError.value) userErrorMessage = workerInitError.value;
        else if (cizelgeError?.message || pageError?.message) userErrorMessage = 'Veriler yüklenirken bir sorun oluştu.';
        else if (searchError.value) userErrorMessage = searchError.value;

        return <p class="error-message">{userErrorMessage}</p>;
    }

    // Normal Render
    return (
        <Fragment>
            <SearchBar
                initialQuery={searchQuery.value}
                onSearch={handleSearch}
                isLoading={isSearching.value}
                ariaLabel="İçerik ara"
                placeholder="Ara..."
            />

            {searchStatusMessage.value}

            {showStaticTables.value && cizelgeData?.tags && cizelgeData.tags.length > 0 && (
                <StaticTable
                    title="#İLİŞTİRİLER"
                    data={cizelgeData.tags}
                    columns={3}
                    tableClass="tags-container"
                />
            )}

            <ImageGrid
                 items={displayItems.value}
                 // Genel isLoading yerine daha spesifik pageLoading + cizelgeLoading kullanılabilir
                 isLoading={isLoading.value && displayItems.value.length === 0}
             />

            {/* Arama yokken ve birden fazla sayfa varsa sayfalandırma */}
            {totalPages.value > 1 && !searchQuery.value && (
                 <Pagination
                    currentPage={currentPage.value}
                    totalPages={totalPages.value}
                    buildPath={(page) => buildPath(page, searchQuery.value)}
                />
            )}

            {showStaticTables.value && cizelgeData?.updated && cizelgeData.updated.length > 0 && (
                <StaticTable
                    title="SON GÜNCELLENEN SUNUMLAR"
                    data={cizelgeData.updated}
                    columns={2}
                    tableClass="updated-table-container"
                />
            )}
        </Fragment>
    );
}