// src/workers/search.worker.ts
import { expose } from 'comlink'; // Bu import klasik worker'da da çalışabilir
import Logger from '../utils/logger'; // Bu import da çalışmalı

// Global tipler src/env.d.ts içinde tanımlı (WorkerGlobalScope dahil)

// --- Pagefind'ı Worker İçine Yükle (Klasik Yöntem) ---
let pagefindApi: PagefindApi | null = null;
let pagefindLoadError: Error | null = null;

try {
    // --- DÜZELTME: importScripts kullanılıyor ---
    // Klasik worker'da bu yöntem çalışmalıdır.
    Logger.info('[Worker-Search] Pagefind script worker içine import ediliyor (importScripts)...');
    self.importScripts('/pagefind/pagefind.js'); // public path kullanılır

    // importScripts senkrondur, bu satıra gelindiğinde yüklenmiş olmalı.
    // Global `self.pagefind` oluşup oluşmadığını ve API'nin varlığını kontrol et.
    if (typeof self.pagefind?.search === 'function') {
        pagefindApi = self.pagefind; // Global'den API'yi al
        Logger.info('[Worker-Search] Pagefind API başarıyla yüklendi (importScripts).');
    } else {
        // Yükleme başarılı oldu ama beklenen API yoksa hata fırlat.
        throw new Error('importScripts sonrası `self.pagefind.search` fonksiyonu bulunamadı.');
    }
    // --- DÜZELTME SONU ---
} catch (e) {
    // importScripts başarısız olursa veya sonrasındaki kontrol hata verirse
    Logger.error('[Worker-Search] Pagefind script (importScripts) yüklenirken veya başlatılırken hata:', e);
    pagefindLoadError = e instanceof Error ? e : new Error(String(e));
    pagefindApi = null; // API'yi null olarak işaretle
}

// --- Arama Fonksiyonu ---
// Artık loadPagefind'a gerek yok, yükleme yukarıda yapıldı veya hata verdi.
async function performSearch(query: string): Promise<string[]> {
    // Her arama öncesi yükleme durumunu kontrol et
    if (pagefindLoadError) {
        Logger.error('[Worker-Search] Pagefind yüklenemediği için arama yapılamıyor.', pagefindLoadError);
        throw new Error(`Arama motoru yüklenemedi: ${pagefindLoadError.message}`);
    }
    if (!pagefindApi) {
        // Bu durum, yükleme başarılı olsa bile API'nin null kaldığı anlamına gelir (beklenmedik).
        Logger.error('[Worker-Search] Pagefind API mevcut değil/hazır değil.');
        throw new Error("Arama motoru API bulunamadı veya hazır değil.");
    }

    // Sorgu geçerliliği
    if (typeof query !== 'string' || query.trim() === '') {
        Logger.info('[Worker-Search] Boş veya geçersiz sorgu.');
        return [];
    }

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
             } catch (dataError) {
                 Logger.error('[Worker-Search] Pagefind result.data() hatası:', dataError, 'Sonuç ID:', result.id);
                 return null;
             }
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

// --- Comlink API ---
const api = { performSearch };
expose(api);

// Worker'ın hazır olup olmadığını yükleme sonucuna göre logla
if (!pagefindLoadError && pagefindApi) {
    Logger.info('[Worker-Search] Arama Worker Comlink için hazır (Pagefind yüklendi).');
} else {
     Logger.error('[Worker-Search] Worker başlatıldı ancak Pagefind yüklenemedi!');
}

// --- Hata Yakalayıcılar ---
self.addEventListener('error', (event) => { Logger.error('[Worker-Search] Yakalanmayan Hata:', event.error || event.message); });
self.addEventListener('unhandledrejection', (event) => { Logger.error('[Worker-Search] İşlenmeyen Red:', event.reason); });