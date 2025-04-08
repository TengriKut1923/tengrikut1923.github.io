/// <reference types="astro/client" />

// === Pagefind Modül ve Global Tip Tanımları ===

// Pagefind'ın dinamik import() ile yüklenecek modülünün varlığını bildiriyoruz.
// Bu, TS2307 "Cannot find module" hatasını çözer.
declare module '/pagefind/pagefind.js' {
    // Modülün kendisi doğrudan bir şey export etmeyebilir,
    // bunun yerine global `self.pagefind` nesnesini oluşturabilir.
    // Bu nedenle içi boş olabilir veya gerekirse export edilen tipler eklenebilir.
}

// Pagefind API arayüzlerini tanımlıyoruz.
interface PagefindApi {
    options?: (opts: Record<string, any>) => Promise<void>;
    search: (query: string) => Promise<{ results: PagefindResultItem[] }>;
    // Gerekirse diğer Pagefind API fonksiyonlarını ekleyin (örn. preload, destroy vb.)
}

interface PagefindResultItem {
    id: string; // Pagefind'ın içsel sonuç ID'si
    data: () => Promise<PagefindResultData>;
    // Diğer olası özellikler: score, words, excerpt, etc.
}

interface PagefindResultData {
    // Indexleme sırasında eklenen meta veriler (öncelikli ID kaynağı)
    meta?: {
        id?: string; // Galerinizdeki öğenin asıl ID'si (beklenen)
        title?: string;
        // Eklediğiniz diğer meta alanları...
    };
    // Meta yoksa veya ID doğrudan eklenmişse
    id?: string;
    url?: string; // Genellikle pagefind.options({baseUrl: "/"}) ile ayarlanır
}

// Global kapsamı hem ana thread (Window) hem de worker (WorkerGlobalScope) için genişletiyoruz.
declare global {
    interface Window {
        pagefind?: PagefindApi;
        // GoatCounter için de global tip eklenebilir (opsiyonel ama iyi pratik)
        goatcounter?: {
            count: (vars: { path: string }) => void;
            // diğer goatcounter fonksiyonları...
        };
        // Gerekirse diğer global değişkenler buraya eklenebilir
    }
    interface WorkerGlobalScope {
        pagefind?: PagefindApi; // Worker içinde de `self.pagefind` kullanılabilir olacak
    }
}

// === Comlink Proxy Tipi (Opsiyonel ama Faydalı) ===
// Comlink wrap() fonksiyonunun döndürdüğü Proxy tipi için ek özellikler tanımlar.
declare module 'comlink' {
    // Comlink'in kendi export'larını korurken Remote tipini genişlet
    export * from 'comlink';
    // releaseProxy özelliğini ve diğer özellikleri ekle
    export interface Remote<T> extends Pick<T, keyof T> { // T'nin tüm özelliklerini miras al
        [Comlink.releaseProxy]: () => void;
    }
}

// === Diğer Global Tipler veya Ortam Değişkenleri ===
// Örneğin, import.meta.env tiplerini burada genişletebilirsiniz.
// interface ImportMetaEnv { readonly PUBLIC_API_KEY: string; /* ... */ }
// interface ImportMeta { readonly env: ImportMetaEnv; }