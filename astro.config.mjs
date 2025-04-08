import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import mkcert from 'vite-plugin-mkcert';
import checker from 'vite-plugin-checker';

export default defineConfig({
  site: 'https://tengrikut1923.com/',
  base: '/',
  integrations: [ preact({ compat: true }) ],
  viewTransitions: true,
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate', injectRegister: 'auto', manifestFilename: 'site.webmanifest',
        manifest: {
            "name": "𐱅𐰭𐰼𐰃:𐰸𐰆𐱃:1923", "short_name": "TNG", "description": "TengriKut1923 - Yeniden Düreklenmiş",
            "start_url": "/", "scope": "/", "display": "standalone", "background_color": "#050505", "theme_color": "#007bff",
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
          runtimeCaching: [
             { urlPattern: ({ request, url }) => request.destination === 'fetch' && url.pathname.startsWith('/json/'), handler: 'CacheFirst', options: { cacheName: 'json-data-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60*60*24*7 }, cacheableResponse: { statuses: [0, 200] } } },
             { urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.startsWith('/bediz/'), handler: 'CacheFirst', options: { cacheName: 'static-images-cache', expiration: { maxEntries: 150, maxAgeSeconds: 60*60*24*30 }, cacheableResponse: { statuses: [0, 200] } } },
             { urlPattern: ({ request, url }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'script' || request.destination === 'font', handler: 'CacheFirst', options: { cacheName: 'processed-assets-cache', expiration: { maxEntries: 100, maxAgeSeconds: 60*60*24*365 }, cacheableResponse: { statuses: [0, 200] } } },
             { urlPattern: ({ request, url }) => request.destination === 'font' && url.pathname.startsWith('/woff2/'), handler: 'CacheFirst', options: { cacheName: 'fonts-cache', expiration: { maxEntries: 20, maxAgeSeconds: 60*60*24*365 }, cacheableResponse: { statuses: [0, 200] } } }
           ],
        }
      }),
      viteCompression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false, filter: /\.(js|css|html|svg|json|xml|webmanifest)$/i }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false, filter: /\.(js|css|html|svg|json|xml|webmanifest)$/i }),
      visualizer({ filename: './dist/stats.html', open: false, gzipSize: true, brotliSize: true }),
      mkcert(),
      checker({ typescript: true }),
    ],
    resolve: {
      alias: {
        'react': 'preact/compat', 'react-dom/test-utils': 'preact/test-utils', 'react-dom': 'preact/compat', 'react/jsx-runtime': 'preact/jsx-runtime',
        '@': '/src', // Alias tanımı
      },
    },
    build: {
      target: 'es2020', sourcemap: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) return `css/[name]-[hash][extname]`;
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name || '')) return `assets/img/[name]-[hash][extname]`;
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name || '')) return `assets/fonts/[name]-[hash][extname]`;
            return `assets/other/[name]-[hash][extname]`;
          },
        }
      },
    },
    server: { https: true }
  },
});