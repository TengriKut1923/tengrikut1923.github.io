// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import mkcert from 'vite-plugin-mkcert';
import checker from 'vite-plugin-checker';

// https://astro.build/config
export default defineConfig({
  site: 'https://tengrikut1923.com/',
  base: '/',
  integrations: [
    preact({ compat: true }), // Preact uyumluluk modu ile
    // Sitemap manuel generate ediliyor, entegrasyon kaldırıldı
  ],
  viewTransitions: true, // View Transitions etkin
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto', // 'inline' yerine 'auto' veya null olabilir
        manifestFilename: 'site.webmanifest',
        manifest: {
            "name": "𐱅𐰭𐰼𐰃:𐰸𐰆𐱃:1923",
            "short_name": "TNG",
            "description": "TengriKut1923 - Yeniden Düreklenmiş",
            "start_url": "/",
            "scope": "/",
            "display": "standalone",
            "background_color": "#050505",
            "theme_color": "#007bff",
            "icons": [
                { "src": "/bediz/damga/2BDFFE7C.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "maskable any" },
                { "src": "/bediz/damga/1D8A565C.png", "sizes": "96x96", "type": "image/png", "purpose": "maskable any" },
                { "src": "/bediz/damga/2F831831.png", "sizes": "180x180", "type": "image/png", "purpose": "maskable any" },
                { "src": "/bediz/damga/4BC5D1F0.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable any" },
                { "src": "/bediz/damga/25020567.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
            ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json,webmanifest}'],
          // Gelişmiş runtimeCaching stratejileri
          runtimeCaching: [
             { // API JSON verileri (page-X.json, cizelge.json)
               urlPattern: ({ request, url }) => request.destination === 'fetch' && url.pathname.startsWith('/json/'),
               handler: 'CacheFirst', // Önce önbellek, sonra ağ
               options: {
                 cacheName: 'json-data-cache',
                 expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 1 hafta
                 cacheableResponse: { statuses: [0, 200] } // Offline ve başarılı yanıtları önbellekle
               }
             },
             { // Statik kopyalanan görseller (/bediz/)
               urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.startsWith('/bediz/'),
               handler: 'CacheFirst',
               options: {
                 cacheName: 'static-images-cache',
                 expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 1 ay
                 cacheableResponse: { statuses: [0, 200] }
               }
             },
             { // Build sonrası oluşan asset'ler (_astro/, assets/)
               urlPattern: ({ request, url }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'script' || request.destination === 'font',
               handler: 'CacheFirst', // Bu dosyalar hash içerdiği için CacheFirst güvenli
               options: {
                 cacheName: 'processed-assets-cache',
                 expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 yıl (hash değişince otomatik güncellenir)
                 cacheableResponse: { statuses: [0, 200] }
               }
             },
             { // Fontlar (statik kopyalanan /woff2/) - Üstteki kural bunu da kapsayabilir, ama ayrı tutmak isterseniz:
               urlPattern: ({ request, url }) => request.destination === 'font' && url.pathname.startsWith('/woff2/'),
               handler: 'CacheFirst',
               options: {
                 cacheName: 'fonts-cache',
                 expiration: { maxEntries: 20, maxAgeSeconds: 60*60*24*365 }, // 1 yıl
                 cacheableResponse: { statuses: [0, 200] }
               }
             }
             // Diğer kaynaklar için NetworkFirst veya StaleWhileRevalidate stratejileri eklenebilir
           ],
           // İsteğe bağlı: Navigation Preload etkinleştirme
           // navigateFallback: '/offline.html', // Offline sayfası varsa
        }
      }),
      // Sıkıştırma pluginleri
      viteCompression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false, filter: /\.(js|css|html|svg|json|xml|webmanifest)$/i }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false, filter: /\.(js|css|html|svg|json|xml|webmanifest)$/i }),
      // Bundle analiz aracı
      visualizer({ filename: './dist/stats.html', open: false, gzipSize: true, brotliSize: true }),
      // Yerel geliştirme için HTTPS sertifikası
      mkcert(),
      // Tip kontrolü ve linting
      checker({ typescript: true }), // ESLint kontrolünü build script'inde yapıyorsanız buradan kaldırabilirsiniz
    ],
    resolve: {
      alias: {
        // Preact uyumluluğu için alias'lar
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
        // Proje içi kısa yollar
        '@': '/src', // Örnek: '@/components/...'
      },
    },
    build: {
      target: 'es2020', // Modern tarayıcı hedefi
      sourcemap: true, // Üretim build'i için sourcemap oluştur
      rollupOptions: {
        output: {
          // Chunk ve asset dosyaları için isimlendirme şeması
          // Hash eklemek cache busting için önemlidir
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js', // Giriş noktaları için de hash ekle
          assetFileNames: (assetInfo) => {
            // CSS dosyalarını 'css' klasörüne koy
            if (assetInfo.name?.endsWith('.css')) {
              return `css/[name]-[hash][extname]`;
            }
            // Diğer asset'leri (resimler, fontlar vb. build sürecinde işlenen) 'assets' klasörüne koy
            // Manuel kopyalanan fontlar (/woff2/) bu kapsama girmez
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name || '')) {
                return `assets/img/[name]-[hash][extname]`;
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name || '')) {
                 return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/other/[name]-[hash][extname]`;
          },
        }
      },
      // İsteğe bağlı: CSS ve JS boyut küçültme ayarları
      // minify: 'terser', // veya 'esbuild' (daha hızlı)
      // terserOptions: { ... }
      // cssMinify: 'lightningcss', // Astro'nun varsayılanı
    },
    // Geliştirme sunucusu ayarları
    server: {
        https: true, // mkcert kullanıldığı için true yapıldı
        // port: 3000, // Varsayılanı kullanır
        // host: true // Ağa açık hale getirir (örneğin mobil test için)
    }
  },
});