import { h, Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { signal, computed, effect } from "@preact/signals";
import { wrap, releaseProxy } from 'comlink'; // Comlink importları doğru
import type { Remote } from 'comlink'; // Type import doğru
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
interface SearchWorkerApi { performSearch: (query: string) => Promise<string[]>; }

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
    Logger.info('[GalleryManager] Ada render ediliyor...');

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
    const pagefindScriptError = signal<string | null>(null); // Ana thread script hatası
    const workerInitError = signal<string | null>(null);

    const searchWorkerApi = useRef<Remote<SearchWorkerApi> | null>(null);
    const isWorkerReady = signal<boolean>(false);

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

        let worker: Worker | null = null;
        let remoteApi: Remote<SearchWorkerApi> | null = null;
        try {
            Logger.info('[GalleryManager] Arama Worker başlatılıyor (Klasik Script)...');
            // --- DÜZELTME: `{ type: 'module' }` kaldırıldı ---
            // Worker'ı modül olarak değil, klasik script olarak başlatıyoruz.
            worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url));
            // --- DÜZELTME SONU ---

            remoteApi = wrap<SearchWorkerApi>(worker);
            searchWorkerApi.current = remoteApi;
            isWorkerReady.value = true; workerInitError.value = null;
            Logger.info('[GalleryManager] Arama Worker Comlink bağlantısı hazır.');
            worker.onerror = (event) => {
                 Logger.error('[GalleryManager] Worker hatası:', event.message, event.error);
                 isWorkerReady.value = false; workerInitError.value = 'Arama motoru çalıştırılamadı.';
                 searchWorkerApi.current = null;
            };

            // Ana thread Pagefind script yüklemesi (Opsiyonel)
            if (!document.getElementById('pagefind-script')) {
                 const script = document.createElement('script'); script.id = 'pagefind-script';
                 script.src = '/pagefind/pagefind.js'; script.type = 'module'; // Bu modül olabilir
                 script.onload = () => { pagefindScriptError.value = null; };
                 script.onerror = () => { pagefindScriptError.value = "Ana thread arama altyapısı yüklenemedi."; };
                 document.body.appendChild(script);
            } else { pagefindScriptError.value = null; }
        } catch(err) {
             Logger.error('[GalleryManager] Worker başlatma hatası:', err);
             isWorkerReady.value = false; workerInitError.value = 'Arama motoru başlatılamadı.';
             searchWorkerApi.current = null; if (worker) worker.terminate();
        }
        return () => { // Temizleme
            document.removeEventListener('astro:page-load', syncStateFromURL);
            if (remoteApi) { try { remoteApi[releaseProxy](); } catch (e) {} }
            if (worker) worker.terminate();
            searchWorkerApi.current = null; isWorkerReady.value = false;
            const script = document.getElementById('pagefind-script'); if (script) script.remove();
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
    const combinedError = computed(() => cizelgeError?.message || pageError?.message || searchError.value || pagefindScriptError.value || workerInitError.value);

    // Debounced Search
    const debouncedPerformSearch = useMemo(() => {
        return debounce(async (query: string) => {
            if (!searchWorkerApi.current || !isWorkerReady.value || workerInitError.value) {
                 searchError.value = workerInitError.value || 'Arama motoru hazır değil.';
                 isSearching.value = false; filteredItemIds.value = []; return;
            }
            if (query === '') { filteredItemIds.value = null; isSearching.value = false; searchError.value = null; return; }
            isSearching.value = true; searchError.value = null;
            try {
                const ids = await searchWorkerApi.current.performSearch(query);
                filteredItemIds.value = ids;
            } catch (err) {
                Logger.error(`[Search] Worker araması başarısız ("${query}"):`, err);
                searchError.value = err instanceof Error ? err.message : 'Arama hatası.';
                filteredItemIds.value = [];
            } finally { isSearching.value = false; }
        }, DEBOUNCE_WAIT);
    }, [isWorkerReady.value, workerInitError.value]);

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

    // --- Render ---
    if (!isClient) { return <div data-hydration-placeholder="true" style="min-height: 400px;" aria-busy="true">Yükleniyor...</div>; }
    if (combinedError.value) {
        let msg = combinedError.value || 'Hata oluştu.';
        if (pagefindScriptError.value) msg = pagefindScriptError.value; else if (workerInitError.value) msg = workerInitError.value; else if (searchError.value) msg = searchError.value; else if (cizelgeError || pageError) msg = 'Veri yükleme hatası.';
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