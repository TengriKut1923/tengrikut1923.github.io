// src/workers/search.worker.ts
import { expose } from 'comlink';
import Logger from '../utils/logger';

// Global tipler src/env.d.ts içinde tanımlı

let pagefindApi: PagefindApi | null = null;
let pagefindLoadError: Error | null = null;
let isLoadingPagefind: boolean = false;

// `self` için beklediğimiz tipi tanımlayalım
type WorkerScope = typeof self & { pagefind?: PagefindApi };

async function loadPagefind() {
    if (pagefindApi || pagefindLoadError || isLoadingPagefind) { return; }
    isLoadingPagefind = true;
    try {
        Logger.info('[Worker-Search] Pagefind modülü dinamik olarak import ediliyor...');
        // @ts-ignore: Modül bulma hatasını önlemek için bırakılabilir.
        await import('/pagefind/pagefind.js');

        const potentialPagefind = (self as WorkerScope).pagefind;

        // Hem pagefind'ın varlığını hem de search fonksiyonunun varlığını kontrol et
        if (potentialPagefind && typeof potentialPagefind.search === 'function') {
            // --- DÜZELTME: `undefined` kontrolü sonrası atama ---
            // Bu noktada potentialPagefind'ın undefined olmadığı biliniyor.
            pagefindApi = potentialPagefind; // Şimdi PagefindApi tipini PagefindApi | null'a atayabiliriz.
            Logger.info('[Worker-Search] Pagefind API başarıyla yüklendi.');
            pagefindLoadError = null;
            // --- DÜZELTME SONU ---
        } else {
            throw new Error('Pagefind yüklendi ancak beklenen `self.pagefind.search` fonksiyonu bulunamadı.');
        }
    } catch (e) {
        Logger.error('[Worker-Search] Pagefind modülü import/başlatma hatası:', e);
        pagefindLoadError = e instanceof Error ? e : new Error(String(e));
        pagefindApi = null;
    } finally {
        isLoadingPagefind = false;
    }
}

async function performSearch(query: string): Promise<string[]> {
    await loadPagefind();
    if (pagefindLoadError) { throw new Error(`Arama motoru yüklenemedi: ${pagefindLoadError.message}`); }
    if (!pagefindApi) { throw new Error("Arama motoru API bulunamadı/hazır değil."); }
    if (typeof query !== 'string' || query.trim() === '') { return []; }

    const trimmedQuery = query.trim();
    Logger.info(`[Worker-Search] Pagefind ile arama yapılıyor: "${trimmedQuery}"`);
    try {
        const searchResult = await pagefindApi.search(trimmedQuery);
        if (!searchResult?.results) { return []; }
        Logger.info(`[Worker-Search] Ham sonuç sayısı: ${searchResult.results.length}`);
        const dataPromises = searchResult.results.map(async (result) => {
             try {
                 const data = await result.data();
                 return data?.meta?.id ?? data?.id ?? null;
             } catch (dataError) { return null; }
        });
        const resolvedIds = await Promise.all(dataPromises);
        const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');
        Logger.info(`[Worker-Search] "${trimmedQuery}" için ${ids.length} ID bulundu.`);
        return ids;
    } catch (error) {
        Logger.error(`[Worker-Search] Arama hatası ("${trimmedQuery}"):`, error);
        throw new Error(`Arama başarısız: ${error instanceof Error ? error.message : String(error)}`);
    }
}

const api = { performSearch };
expose(api);
Logger.info('[Worker-Search] Arama Worker Comlink için hazır.');
self.addEventListener('error', (event) => { Logger.error('[Worker-Search] Yakalanmayan Hata:', event.error || event.message); });
self.addEventListener('unhandledrejection', (event) => { Logger.error('[Worker-Search] İşlenmeyen Red:', event.reason); });