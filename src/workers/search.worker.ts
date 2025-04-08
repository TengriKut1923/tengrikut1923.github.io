// src/workers/search.worker.ts
import * as Comlink from 'comlink';
import Logger from '../utils/logger'; // Göreli yol kullan

// --- Global Pagefind Tipi Tanımı ---
declare global {
  interface Window {
    pagefind?: PagefindApi;
  }
}

// --- Pagefind API ve Sonuç Tipleri ---
interface PagefindApi {
  options?: (opts: any) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResultItem[] }>;
}
interface PagefindResultItem {
  id: string; // Pagefind çıktısını kontrol edin
  data: () => Promise<PagefindResultData>;
}
interface PagefindResultData {
  meta?: { id?: string };
  id?: string; // Veya url'den parse edilecekse farklı
}

// --- Arama Fonksiyonu ---
async function performSearch(query: string): Promise<string[]> {
  // Global pagefind nesnesini kontrol et
  if (typeof self.pagefind === 'undefined' || typeof self.pagefind.search !== 'function') {
    Logger.warn('[Worker-Search] Global pagefind API henüz yüklenmedi veya `search` metodu yok. Arama yapılamıyor.');
    return []; // Boş dizi dön
  }

  const pagefindApi = self.pagefind; // API'yi kullan

  if (typeof query !== 'string' || query.trim() === '') {
    Logger.info('[Worker-Search] Boş veya geçersiz sorgu, arama yapılmadı.');
    return [];
  }

  const trimmedQuery = query.trim();
  Logger.info(`[Worker-Search] Arama yapılıyor: "${trimmedQuery}"`);

  try {
    const searchResult = await pagefindApi.search(trimmedQuery);

    if (!searchResult || !Array.isArray(searchResult.results)) {
      Logger.warn('[Worker-Search] Geçersiz arama sonucu formatı:', searchResult);
      return [];
    }

    // Sonuçlardan ID'leri ayıkla
    const dataPromises = searchResult.results.map((result: PagefindResultItem) => result.data());
    const dataResults = await Promise.all(dataPromises);

    // ID'nin bulunduğu yeri kontrol edin (meta.id, id, veya url?)
    const ids = dataResults
      .map(data => data?.meta?.id ?? data?.id ?? null)
      .filter((id): id is string => typeof id === 'string' && id !== '');

    Logger.info(`[Worker-Search] "${trimmedQuery}" için ${ids.length} sonuç bulundu.`);
    return ids;

  } catch (error) {
    Logger.error(`[Worker-Search] Arama sırasında hata oluştu ("${trimmedQuery}"):`, error);
    return [];
  }
}

// --- Comlink için API ---
const api = {
  performSearch,
};

Comlink.expose(api);

Logger.info('[Worker-Search] Arama Worker hazır (Global pagefind scriptinin yüklenmesi bekleniyor).');

// --- Hata Dinleyicileri ---
self.addEventListener('error', (event) => {
  Logger.error('[Worker-Search] Yakalanmayan Worker Hatası:', event.error || event.message);
});
self.addEventListener('unhandledrejection', (event) => {
  Logger.error('[Worker-Search] İşlenmeyen Promise Reddi:', event.reason);
});