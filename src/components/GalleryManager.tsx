import { h, Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { signal, computed, effect } from "@preact/signals";
import debounce from 'just-debounce-it';
import { navigate } from 'astro:transitions'; // Astro global navigate

import Logger from '@/utils/logger';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import StaticTable from './StaticTable';
import Pagination from './Pagination';

// Tipler
interface GalleryItem { id: string; h: string; s: string; a: string; t: string[]; p: boolean; }
interface TableDataItem { href: string; text: string; label: string; }
interface CizelgeData { tags: TableDataItem[]; updated: TableDataItem[]; paginationInfo: { totalItems: number; itemsPerPage: number; totalPages: number; }; }

// Pagefind API Tipleri
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
const PAGEFIND_POLL_INTERVAL = 100;
const PAGEFIND_POLL_TIMEOUT = 3000;

// `window` ve Astro global tipleri
type WindowWithPagefindAndAstro = Window & typeof globalThis & {
    pagefind?: PagefindApi;
    astro?: { navigate?: (href: string, options?: object) => Promise<void>; };
};

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
    const pagefindScriptError = signal<string | null>(null);
    const isPagefindReady = signal<boolean>(false);
    const pagefindApi = useRef<PagefindApi | null>(null);
    const pollIntervalRef = useRef<number | undefined>(undefined);

    // --- Efektler ---
    useEffect(() => {
        setIsClient(true);
        const syncStateFromURL = () => {
            if (typeof window === 'undefined') return;
            const path = window.location.pathname;
            let queryFromUrl = ''; let pageFromUrl = 1;
            const parts = path.split('/').filter(Boolean);
            if (parts[0] === 'ara') { queryFromUrl = decodeURIComponent(parts[1] || '').trim(); pageFromUrl = parseInt(parts[2] || '1', 10); }
            else if (parts.length === 1 && /^\d+$/.test(parts[0])) { pageFromUrl = parseInt(parts[0], 10); }
            pageFromUrl = Math.max(1, isNaN(pageFromUrl) ? 1 : pageFromUrl);
            if (searchQuery.peek() !== queryFromUrl) { searchQuery.value = queryFromUrl; if (filteredItemIds.peek() !== null) filteredItemIds.value = null; }
            if (currentPage.peek() !== pageFromUrl) { currentPage.value = pageFromUrl; }
        };
        syncStateFromURL();
        document.addEventListener('astro:after-swap', syncStateFromURL);
        fetcher('/json/cizelge.json')
            .then(data => { const d = data as CizelgeData; setCizelgeData(d); setCizelgeError(null); const p = currentPage.peek(); const t = d?.paginationInfo?.totalPages ?? 1; if (p > t) currentPage.value = 1; })
            .catch(error => { setCizelgeError(error); }).finally(() => setCizelgeLoading(false));
        let scriptElement: HTMLScriptElement | null = null;
        const loadPagefindScript = () => {
            const existing = document.getElementById('pagefind-script'); const potential = (window as WindowWithPagefindAndAstro).pagefind;
            if (existing) { if (potential && typeof potential.search === 'function' && !pagefindApi.current) { pagefindApi.current = potential; isPagefindReady.value = true; pagefindScriptError.value = null; } return; }
            scriptElement = document.createElement('script'); scriptElement.id = 'pagefind-script'; scriptElement.src = '/pagefind/pagefind.js'; scriptElement.type = 'module';
            scriptElement.onload = () => {
                pagefindScriptError.value = null; let elapsed = 0; if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = window.setInterval(() => {
                    const current = (window as WindowWithPagefindAndAstro).pagefind;
                    if (current && typeof current.search === 'function') { clearInterval(pollIntervalRef.current); pollIntervalRef.current = undefined; if (!pagefindApi.current) { pagefindApi.current = current; isPagefindReady.value = true; } }
                    else { elapsed += PAGEFIND_POLL_INTERVAL; if (elapsed >= PAGEFIND_POLL_TIMEOUT) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = undefined; if (!isPagefindReady.peek()) { pagefindScriptError.value = "Arama başlatılamadı (zaman aşımı)."; isPagefindReady.value = false; pagefindApi.current = null; } } }
                }, PAGEFIND_POLL_INTERVAL);
            };
            scriptElement.onerror = () => { pagefindScriptError.value = "Arama yüklenemedi."; isPagefindReady.value = false; pagefindApi.current = null; if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); pollIntervalRef.current = undefined; };
            document.body.appendChild(scriptElement);
        };
        loadPagefindScript();
        return () => { document.removeEventListener('astro:after-swap', syncStateFromURL); if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); pollIntervalRef.current = undefined; pagefindApi.current = null; isPagefindReady.value = false; const s = document.getElementById('pagefind-script'); if (s) s.remove(); };
    }, []);

    // Sayfa Verisi Çekme
    useEffect(() => {
        if (!isClient || !cizelgeData) return; const page = currentPage.value; const total = cizelgeData.paginationInfo.totalPages;
        if (page > 0 && page <= total) { setPageLoading(true); setPageError(null); fetcher(`/json/page-${page}.json`).then(d => setPageData(d)).catch(e => { setPageError(e); setPageData(undefined); }).finally(() => setPageLoading(false)); }
        else if (total > 0) { setPageData(undefined); setPageLoading(false); }
    }, [isClient, currentPage.value, cizelgeData]);

    // Hesaplamalar
    const paginationInfo = computed(() => cizelgeData?.paginationInfo ?? { totalItems: 0, itemsPerPage: 48, totalPages: 1 });
    const totalPages = computed(() => paginationInfo.value.totalPages);
    const isLoading = computed(() => cizelgeLoading || pageLoading);
    const combinedError = computed(() => cizelgeError?.message || pageError?.message || searchError.value || pagefindScriptError.value);

    // Debounced Search
    const debouncedPerformSearch = useMemo(() => {
        return debounce(async (query: string) => {
            if (!isPagefindReady.value || !pagefindApi.current) { searchError.value = pagefindScriptError.value || 'Motor hazır değil.'; isSearching.value = false; filteredItemIds.value = []; return; }
            if (query === '') { filteredItemIds.value = null; isSearching.value = false; searchError.value = null; return; }
            const q = query.trim(); isSearching.value = true; searchError.value = null;
            try {
                const r = await pagefindApi.current.search(q); if (!r?.results) throw new Error('Geçersiz sonuç.');
                const p = r.results.map(async (res) => { try { const d = await res.data(); return d?.meta?.id ?? d?.id ?? null; } catch (e) { return null; } });
                const resIds = await Promise.all(p); const ids = resIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');
                filteredItemIds.value = ids;
            } catch (err) { searchError.value = err instanceof Error ? err.message : 'Arama hatası.'; filteredItemIds.value = []; }
            finally { isSearching.value = false; }
        }, DEBOUNCE_WAIT);
    }, [isPagefindReady.value, pagefindScriptError.value]);

    effect(() => { debouncedPerformSearch(searchQuery.value); }); // Arama tetikle

    // Navigasyon
    const navigateTo = (path: string) => {
        if (typeof window === 'undefined') return; const current = location.pathname + location.search + location.hash;
        if (current !== path) { const nav = (window as WindowWithPagefindAndAstro).astro?.navigate; if (nav) nav(path); else location.href = path; }
    };
    const buildPath = (page: number, query: string): string => { const q = (query || '').trim(); if (!q) return page > 1 ? `/${page}` : '/'; return `/ara/${encodeURIComponent(q)}${page > 1 ? `/${page}` : ''}`; };
    const handleSearch = (query: string) => { navigateTo(buildPath(1, query)); };

    // Render Yardımcıları
    const displayItems = computed((): GalleryItem[] => { if (!pageData) return []; const ids = filteredItemIds.value; if (ids === null) return pageData; const s = new Set(ids); return pageData.filter(i => s.has(i.id)); });
    const searchStatusMessage = computed(() => { if (searchQuery.value && filteredItemIds.value?.length === 0 && !isSearching.value) return <p class="search-no-results">"{searchQuery.value}" için sonuç bulunamadı.</p>; return null; });
    const showStaticTables = computed(() => { if (!isClient || !cizelgeData) return false; const p = location.pathname; return (p === '/' || /^\/1$/.test(p)) && !searchQuery.value; });

    // --- Render ---
    if (!isClient) { return <div data-hydration-placeholder="true" style="min-height: 400px;" aria-busy="true">Yükleniyor...</div>; }
    if (combinedError.value) { let m = combinedError.value || 'Hata.'; if (pagefindScriptError.value) m = pagefindScriptError.value; else if (searchError.value) m = searchError.value; else if (cizelgeError || pageError) m = 'Veri hatası.'; return <p class="error-message">{m}</p>; }
    return (
        <Fragment>
            <SearchBar initialQuery={searchQuery.value} onSearch={handleSearch} isLoading={isSearching.value} />
            {searchStatusMessage.value}

            {/* --- DÜZELTME: JSX Kontrolleri Sağlamlaştırıldı --- */}
            {/* Önce showStaticTables, sonra cizelgeData var mı diye kontrol et */}
            {showStaticTables.value && cizelgeData && (
                <Fragment>
                    {/* cizelgeData varsa, tags var mı ve length > 0 mı diye kontrol et */}
                    {cizelgeData.tags && cizelgeData.tags.length > 0 && (
                        <StaticTable title="#İLİŞTİRİLER" data={cizelgeData.tags} columns={3} tableClass="tags-container" />
                    )}
                </Fragment>
            )}
            {/* --- DÜZELTME SONU --- */}

            <ImageGrid items={displayItems.value} isLoading={isLoading.value || isSearching.value} />

            {totalPages.value > 1 && !searchQuery.value && (
                <Pagination currentPage={currentPage.value} totalPages={totalPages.value} buildPath={(page) => buildPath(page, searchQuery.value)} />
            )}

            {/* --- DÜZELTME: JSX Kontrolleri Sağlamlaştırıldı --- */}
            {showStaticTables.value && cizelgeData && (
                 <Fragment>
                     {/* cizelgeData varsa, updated var mı ve length > 0 mı diye kontrol et */}
                     {cizelgeData.updated && cizelgeData.updated.length > 0 && (
                        <StaticTable title="SON GÜNCELLENEN SUNUMLAR" data={cizelgeData.updated} columns={2} tableClass="updated-table-container" />
                     )}
                 </Fragment>
            )}
            {/* --- DÜZELTME SONU --- */}
        </Fragment>
    );
}