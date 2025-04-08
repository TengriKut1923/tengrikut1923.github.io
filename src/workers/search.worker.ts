// src/workers/search.worker.ts
import * as Comlink from 'comlink';
// Logger import'u için yolu projenize göre ayarlayın (varsayılan ../utils/logger)
// Eğer utils direkt src altındaysa: import Logger from '@/utils/logger'; daha iyi olabilir
// Ancak worker build sürecinde bu alias'ı çözümleyemeyebilir, göreceli yol daha güvenli olabilir.
import Logger from '../utils/logger'; // Veya doğru göreceli yol

// --- Pagefind'ı Worker İçine Yükle ---
try {
  // pagefind.js dosyasının build sonrası public path'ini belirtin
  // Genellikle /pagefind/pagefind.js olur (dist klasöründeki yapıya göre)
  self.importScripts('/pagefind/pagefind.js');
  Logger.info('[Worker-Search] Pagefind script worker içine import edildi (importScripts).');
} catch (e) {
  Logger.error('[Worker-Search] Pagefind script worker içine import edilemedi (importScripts):', e);
  // Pagefind yüklenemezse worker'ın bir şey yapması engellenmeli
  // Comlink.expose'dan önce throw new Error() yapılabilir veya api objesi boş bırakılabilir.
  // Şimdilik sadece logluyoruz, aşağıdaki kontrol bunu yakalayacak.
}

// --- Global Pagefind Tipi Tanımı ---
// Bu tanım hala geçerli, çünkü importScripts global `self`'e ekler.
declare global {
  interface Window { // `self` de Window gibi davranır worker içinde
    pagefind?: PagefindApi;
  }
}

// --- Pagefind API ve Sonuç Tipleri ---
interface PagefindApi {
  options?: (opts: Record<string, any>) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResultItem[] }>;
  // Gerekirse diğer Pagefind API metodlarını ekleyin
}
interface PagefindResultItem {
  id: string; // Pagefind çıktısını kontrol edin, bu genellikle unique bir hash'dir
  data: () => Promise<PagefindResultData>;
  // Gerekirse diğer Pagefind sonuç özelliklerini ekleyin
}
interface PagefindResultData {
  // meta objesi genellikle indexlenen HTML'deki meta etiketlerini veya data-* özniteliklerini içerir
  meta?: {
      id?: string; // data-pagefind-meta="id:BENIM_IDM" gibi tanımlandıysa
      title?: string; // <title> etiketi veya data-pagefind-meta="title:..."
      // Diğer meta alanları...
  };
  // Bazen doğrudan data objesinde de ID olabilir
  id?: string;
  // URL genellikle doğrudan data içinde olmaz, ama pagefind ayarlarına bağlı
  url?: string; // Örneğin data-pagefind-filter="url:/path/to/page" gibi
}

// --- Arama Fonksiyonu ---
async function performSearch(query: string): Promise<string[]> {
  // Global pagefind nesnesini VE search metodunu kontrol et
  if (typeof self.pagefind === 'undefined' || typeof self.pagefind.search !== 'function') {
    Logger.error('[Worker-Search] Global pagefind API yüklenemedi veya kullanılamıyor. Arama yapılamıyor.');
    // Belki burada Comlink'e bir hata fırlatmak daha iyi olur?
    // throw new Error("Arama motoru başlatılamadı.");
    return []; // Veya hata fırlat
  }

  const pagefindApi = self.pagefind;

  if (typeof query !== 'string' || query.trim() === '') {
    Logger.info('[Worker-Search] Boş veya geçersiz sorgu, arama yapılmadı.');
    return [];
  }

  const trimmedQuery = query.trim();
  Logger.info(`[Worker-Search] Arama yapılıyor: "${trimmedQuery}"`);

  try {
    // Pagefind'ın belirli seçeneklere ihtiyacı olabilir (opsiyonel)
    // await pagefindApi.options?.({ /* ... */ });

    const searchResult = await pagefindApi.search(trimmedQuery);

    if (!searchResult || !Array.isArray(searchResult.results)) {
      Logger.warn('[Worker-Search] Geçersiz arama sonucu formatı:', searchResult);
      return [];
    }

    Logger.info(`[Worker-Search] Ham sonuç sayısı: ${searchResult.results.length}`);

    // Sonuçlardan ID'leri asenkron olarak ayıkla
    const dataPromises = searchResult.results.map(async (result: PagefindResultItem) => {
        try {
            const data = await result.data();
            // Pagefind'ın döndürdüğü ID'yi veya meta içindeki ID'yi ara
            // Pagefind genellikle kendi internal ID'sini (result.id) kullanır,
            // ama biz galeri öğelerinin ID'sini istiyoruz, bu genellikle meta içinde olur.
            const galleryItemId = data?.meta?.id ?? data?.id ?? null;
            // console.log('Result Data:', data, 'Extracted ID:', galleryItemId); // Debug için
            return galleryItemId;
        } catch (dataError) {
            Logger.error('[Worker-Search] Sonuç data() alınırken hata:', dataError);
            return null; // Bu sonuç için ID alınamadı
        }
    });

    const resolvedIds = await Promise.all(dataPromises);

    // Geçerli ID'leri filtrele (null olmayan ve boş olmayan string'ler)
    const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');

    Logger.info(`[Worker-Search] "${trimmedQuery}" için filtrelenmiş ${ids.length} geçerli ID bulundu.`);
    // console.log('Returned IDs:', ids); // Debug için
    return ids;

  } catch (error) {
    Logger.error(`[Worker-Search] Arama sırasında hata oluştu ("${trimmedQuery}"):`, error);
    // Hata durumunda ana thread'e bilgi vermek için hata fırlatmak daha iyi olabilir
    // throw new Error(`Arama başarısız oldu: ${error.message}`);
    return []; // Veya hata fırlat
  }
}

// --- Comlink için API ---
const api = {
  performSearch,
};

Comlink.expose(api);

// Worker'ın hazır olduğunu logla (Pagefind'ın yüklenip yüklenmediği yukarıda kontrol ediliyor)
Logger.info('[Worker-Search] Arama Worker Comlink için hazır.');

// --- Hata Dinleyicileri ---
self.addEventListener('error', (event) => {
  Logger.error('[Worker-Search] Yakalanmayan Worker Hatası:', event.error || event.message);
});
self.addEventListener('unhandledrejection', (event) => {
  Logger.error('[Worker-Search] İşlenmeyen Promise Reddi:', event.reason);
});