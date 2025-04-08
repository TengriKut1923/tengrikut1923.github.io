// src/workers/search.worker.ts
import * as Comlink from 'comlink';
// Logger import'u için yolu projenize göre ayarlayın
// Örneğin, eğer utils klasörü src altında ve worker da src/workers altındaysa:
import Logger from '../utils/logger';

// --- Pagefind API ve Sonuç Tipleri Tanımları ---
// Bu tipler, Pagefind'ın döndürdüğü yapıya göre doğrulanmalı veya ayarlanmalıdır.
declare global {
  // Worker'ın global kapsamını genişletiyoruz
  interface Window { // `self` de Window gibi davranır
    pagefind?: PagefindApi;
  }
}
interface PagefindApi {
  options?: (opts: Record<string, any>) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResultItem[] }>;
  // Gerekirse Pagefind'ın diğer API fonksiyonlarının tiplerini ekleyin
}
interface PagefindResultItem {
  id: string; // Pagefind'ın içsel sonuç ID'si (genellikle bir hash)
  data: () => Promise<PagefindResultData>;
  // Örneğin: score, words, excerpt vb. olabilir
}
interface PagefindResultData {
  // Indexleme sırasında data-pagefind-meta veya data-pagefind-filter
  // ile eklenen özel alanlar burada görünür.
  meta?: {
      id?: string; // Galerinizdeki öğenin asıl ID'si (bu bekleniyor)
      title?: string;
      // Diğer meta alanları...
  };
  // Eğer meta yerine doğrudan eklenmişse:
  id?: string;
  url?: string; // Genellikle doğrudan burada olmaz ama konfigürasyona bağlı
}

// --- Worker Kapsamında Pagefind API'sini Tutacak Değişkenler ---
let pagefindApi: PagefindApi | null = null;
let pagefindLoadError: Error | null = null;
let isLoadingPagefind: boolean = false; // Yükleme sırasında tekrar denemeyi önlemek için

// --- Pagefind'ı Dinamik Olarak Yükle (Modül Worker Yöntemi) ---
async function loadPagefind() {
    // Zaten yüklendiyse veya yüklenirken hata oluştuysa veya şu an yükleniyorsa tekrar deneme
    if (pagefindApi || pagefindLoadError || isLoadingPagefind) {
        return;
    }

    isLoadingPagefind = true; // Yüklemeyi başlat
    try {
        Logger.info('[Worker-Search] Pagefind modülü dinamik olarak import ediliyor...');
        // pagefind.js'nin build sonrası public path'ini kullanın (genellikle /pagefind/pagefind.js)
        // Dinamik import() modül worker'larında çalışır.
        await import('/pagefind/pagefind.js');

        // import() sonrası Pagefind'ın kendini global `self.pagefind`'a eklediğini varsayıyoruz.
        // Pagefind farklı bir şekilde API'yi export ediyorsa (örn. named export),
        // import şekli değişebilir: const { Pagefind } = await import(...);
        if (typeof self.pagefind?.search === 'function') {
            pagefindApi = self.pagefind;
            Logger.info('[Worker-Search] Pagefind API başarıyla yüklendi ve kullanıma hazır.');
            pagefindLoadError = null; // Başarılı yüklemede hatayı temizle
        } else {
            // Bu durum, script yüklense bile beklenen API'nin global'de bulunamadığı anlamına gelir.
            throw new Error('Pagefind yüklendi ancak beklenen API (self.pagefind.search) bulunamadı.');
        }
    } catch (e) {
        Logger.error('[Worker-Search] Pagefind modülü import edilirken veya başlatılırken hata:', e);
        // Hatayı sakla ki sonraki arama denemelerinde de bilinsin
        pagefindLoadError = e instanceof Error ? e : new Error(String(e));
        pagefindApi = null; // Başarısız olduysa API'yi null yap
    } finally {
        isLoadingPagefind = false; // Yükleme tamamlandı (başarılı veya başarısız)
    }
}

// --- Arama Fonksiyonu (Güncellendi) ---
async function performSearch(query: string): Promise<string[]> {
    // Pagefind'ı yüklemeyi dene (eğer henüz yapılmadıysa veya hata oluştuysa)
    // loadPagefind fonksiyonu zaten yüklüyse veya hata varsa tekrar yüklemeyi denemez.
    await loadPagefind();

    // Yükleme hatası varsa veya API hala yüklenememişse hata fırlat
    if (pagefindLoadError) {
        Logger.error('[Worker-Search] Pagefind yüklenemediği için arama yapılamıyor.', pagefindLoadError);
        // Ana thread'e anlamlı bir hata mesajı gönder
        throw new Error(`Arama motoru yüklenemedi: ${pagefindLoadError.message}`);
    }
    if (!pagefindApi) {
         // Bu durum, yükleme devam ediyor olabilir veya beklenmedik bir şekilde API null kalmıştır.
         Logger.error('[Worker-Search] Pagefind API mevcut değil veya henüz yüklenmedi. Arama yapılamıyor.');
         throw new Error("Arama motoru API bulunamadı veya henüz hazır değil.");
    }

    // Sorgu geçerliliğini kontrol et
    if (typeof query !== 'string' || query.trim() === '') {
        Logger.info('[Worker-Search] Boş veya geçersiz sorgu, arama yapılmadı.');
        return []; // Boş sorgu için boş sonuç
    }

    const trimmedQuery = query.trim();
    Logger.info(`[Worker-Search] Pagefind ile arama yapılıyor: "${trimmedQuery}"`);

    try {
        // Yüklenen ve hazır olan Pagefind API'sini kullan
        const searchResult = await pagefindApi.search(trimmedQuery);

        // Sonuç formatını doğrula
        if (!searchResult || !Array.isArray(searchResult.results)) {
          Logger.warn('[Worker-Search] Pagefind\'dan geçersiz arama sonucu formatı alındı:', searchResult);
          return [];
        }

        Logger.info(`[Worker-Search] Ham sonuç sayısı: ${searchResult.results.length}`);

        // Sonuçlardan galerinin kendi ID'lerini asenkron olarak ayıkla
        const dataPromises = searchResult.results.map(async (result: PagefindResultItem) => {
            try {
                const data = await result.data();
                // ID'nin meta içinde olduğunu varsayıyoruz (data-pagefind-meta="id:...")
                // Eğer doğrudan data objesinde ise 'data.id'yi de kontrol et
                const galleryItemId = data?.meta?.id ?? data?.id ?? null;
                return galleryItemId;
            } catch (dataError) {
                Logger.error('[Worker-Search] Pagefind result.data() alınırken hata:', dataError, 'Sonuç ID:', result.id);
                return null; // Bu sonuç için ID alınamadı
            }
        });

        const resolvedIds = await Promise.all(dataPromises);

        // Geçerli (null olmayan ve boş olmayan) ID'leri filtrele
        const ids = resolvedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '');

        Logger.info(`[Worker-Search] "${trimmedQuery}" için filtrelenmiş ${ids.length} geçerli galeri ID bulundu.`);
        return ids;

    } catch (error) {
        Logger.error(`[Worker-Search] Pagefind araması sırasında hata oluştu ("${trimmedQuery}"):`, error);
        // Arama hatasını ana thread'e bildir
        throw new Error(`Arama başarısız oldu: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// --- Comlink için API Nesnesi ---
// Sadece dışarıya açılacak fonksiyonları içerir
const api = {
  performSearch,
};

// API'yi Comlink aracılığıyla expose et
Comlink.expose(api);

// Worker'ın Comlink için hazır olduğunu belirt. Pagefind yüklemesi ilk aramada tetiklenecek.
Logger.info('[Worker-Search] Arama Worker Comlink için hazır.');

// --- Genel Hata Yakalayıcılar ---
self.addEventListener('error', (event) => {
  // Worker içinde yakalanmayan genel hatalar
  Logger.error('[Worker-Search] Yakalanmayan Worker Hatası:', event.error || event.message);
});
self.addEventListener('unhandledrejection', (event) => {
  // Worker içinde .catch() ile yakalanmayan Promise hataları
  Logger.error('[Worker-Search] İşlenmeyen Promise Reddi:', event.reason);
});