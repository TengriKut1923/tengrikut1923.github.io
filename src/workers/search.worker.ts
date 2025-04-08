// src/workers/search.worker.ts
import * as Comlink from 'comlink';
// Logger import yolu projenize göre doğru olmalı
import Logger from '../utils/logger';

// Global PagefindApi tipi artık src/env.d.ts içinde tanımlı.
// Buradaki declare global bloğu kaldırıldı veya yorumlandı.

// --- Worker Kapsamında Pagefind API'sini Tutacak Değişkenler ---
let pagefindApi: PagefindApi | null = null; // Tip env.d.ts'den geliyor
let pagefindLoadError: Error | null = null;
let isLoadingPagefind: boolean = false;

// --- Pagefind'ı Dinamik Olarak Yükle ---
async function loadPagefind() {
    if (pagefindApi || pagefindLoadError || isLoadingPagefind) {
        return; // Zaten yüklü, hata var veya yükleniyor
    }
    isLoadingPagefind = true;
    try {
        Logger.info('[Worker-Search] Pagefind modülü dinamik olarak import ediliyor...');
        // env.d.ts sayesinde TypeScript artık bu modülü tanımalıdır.
        await import('/pagefind/pagefind.js');

        // Global tipler (WorkerGlobalScope) env.d.ts içinde tanımlı olduğu için
        // `self.pagefind` artık doğru tipe sahip olmalıdır.
        if (typeof self.pagefind?.search === 'function') {
            pagefindApi = self.pagefind; // API'yi değişkene ata
            Logger.info('[Worker-Search] Pagefind API başarıyla yüklendi.');
            pagefindLoadError = null; // Başarı durumunda önceki hatayı temizle
        } else {
            throw new Error('Pagefind yüklendi ancak beklenen `self.pagefind.search` fonksiyonu bulunamadı.');
        }
    } catch (e) {
        Logger.error('[Worker-Search] Pagefind modülü import edilirken veya başlatılırken hata:', e);
        pagefindLoadError = e instanceof Error ? e : new Error(String(e));
        pagefindApi = null; // Hata durumunda API'yi null yap
    } finally {
        isLoadingPagefind = false; // Yükleme denemesi bitti
    }
}

// --- Arama Fonksiyonu ---
async function performSearch(query: string): Promise<string[]> {
    // Her arama öncesi Pagefind'ın yüklenip yüklenmediğini kontrol et/yükle
    await loadPagefind();

    // Yükleme hatası varsa veya API hala yoksa, işlemi durdur ve hata fırlat
    if (pagefindLoadError) {
        Logger.error('[Worker-Search] Pagefind yüklenemediği için arama yapılamıyor.', pagefindLoadError);
        throw new Error(`Arama motoru yüklenemedi: ${pagefindLoadError.message}`);
    }
    if (!pagefindApi) {
         Logger.error('[Worker-Search] Pagefind API mevcut değil/henüz hazır değil.');
         throw new Error("Arama motoru API bulunamadı veya henüz hazır değil.");
    }

    // Sorgu geçerliliğini kontrol et
    if (typeof query !== 'string' || query.trim() === '') {
        Logger.info('[Worker-Search] Boş veya geçersiz sorgu.');
        return [];
    }

    const trimmedQuery = query.trim();
    Logger.info(`[Worker-Search] Pagefind ile arama yapılıyor: "${trimmedQuery}"`);

    try {
        // Hazır API'yi kullanarak aramayı gerçekleştir
        const searchResult = await pagefindApi.search(trimmedQuery);

        // Sonuç formatını doğrula
        if (!searchResult?.results) { // `results` var mı diye kontrol et
          Logger.warn('[Worker-Search] Pagefind\'dan beklenen `results` alanı dönmedi:', searchResult);
          return [];
        }

        Logger.info(`[Worker-Search] Ham sonuç sayısı: ${searchResult.results.length}`);

        // Sonuçlardan galerinin kendi ID'lerini asenkron olarak ayıkla
        const dataPromises = searchResult.results.map(async (result) => {
            try {
                const data = await result.data();
                // Öncelik meta.id, sonra data.id
                const galleryItemId = data?.meta?.id ?? data?.id ?? null;
                return galleryItemId;
            } catch (dataError) {
                Logger.error('[Worker-Search] Pagefind result.data() alınırken hata:', dataError, 'Sonuç ID:', result.id);
                return null;
            }
        });

        const resolvedIds = await Promise.all(dataPromises);
        const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== ''); // Null ve boş stringleri filtrele

        Logger.info(`[Worker-Search] "${trimmedQuery}" için ${ids.length} geçerli galeri ID bulundu.`);
        return ids;

    } catch (error) {
        Logger.error(`[Worker-Search] Pagefind araması sırasında hata oluştu ("${trimmedQuery}"):`, error);
        // Arama hatasını ana thread'e bildir
        throw new Error(`Arama başarısız oldu: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// --- Comlink API ---
const api = {
  performSearch,
};
Comlink.expose(api); // API'yi dışarıya aç

Logger.info('[Worker-Search] Arama Worker Comlink için hazır.');

// --- Genel Hata Yakalayıcılar ---
self.addEventListener('error', (event) => {
  Logger.error('[Worker-Search] Yakalanmayan Worker Hatası:', event.error || event.message);
});
self.addEventListener('unhandledrejection', (event) => {
  Logger.error('[Worker-Search] İşlenmeyen Promise Reddi:', event.reason);
});