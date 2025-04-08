/// <reference types="astro/client" />

// === Pagefind Modül ve Global Tip Tanımları ===

// Pagefind'ın dinamik import() ile yüklenecek modülünün varlığını bildiriyoruz.
// Bu, TS2307 "Cannot find module" hatasını çözer (tsconfig include ile birlikte).
declare module '/pagefind/pagefind.js' {
    // Modülün kendisi global'e ekleme yapacağı için burası boş kalabilir.
}

// Pagefind API arayüzleri
interface PagefindApi {
    options?: (opts: Record<string, any>) => Promise<void>;
    search: (query: string) => Promise<{ results: PagefindResultItem[] }>;
}
interface PagefindResultItem {
    id: string; // Pagefind'ın içsel sonuç ID'si
    data: () => Promise<PagefindResultData>;
}
interface PagefindResultData {
    meta?: { id?: string; title?: string; /*...*/ }; // Indexlenen meta veriler
    id?: string;
    url?: string;
}

// Global kapsamı genişletiyoruz
declare global {
    // Ana thread için
    interface Window {
        pagefind?: PagefindApi;
        goatcounter?: { // GoatCounter tipi (küçük harfle)
            count: (vars: { path: string }) => void;
        };
    }
    // Worker thread için
    interface WorkerGlobalScope {
        pagefind?: PagefindApi;
    }
}

// === Comlink Modül Tanımı KALDIRILDI ===

// === Diğer Global Tipler ===
// interface ImportMetaEnv { readonly PUBLIC_API_KEY: string; }
// interface ImportMeta { readonly env: ImportMetaEnv; }