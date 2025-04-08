// scripts/generate-sitemap.js
import fs from 'fs-extra'; // Dosya işlemleri için
import path from 'path'; // Yol işlemleri için
import { globby } from 'globby'; // Desenlere göre dosya bulmak için
import { fileURLToPath } from 'url'; // ES Modül context'inde __dirname benzeri işlev için

// Mevcut dosyanın ve dizinin yolunu al
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proje kök dizinini ve build çıktı dizinini belirle
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Site URL'nizi buraya girin (sondaki / olmadan)
const siteUrl = 'https://tengrikut1923.com';

// Hariç tutulacak dosyalar (isteğe bağlı)
const excludedFiles = [
    `!${distDir}/404.html`, // 404 sayfasını genellikle sitemap'e eklemeyiz
    // İsterseniz başka dosyaları da hariç tutabilirsiniz
    // `!${distDir}/private/**/*.html`,
];

async function generateSitemap() {
  console.info('[sitemap] Manuel sitemap oluşturuluyor...');
  try {
    // dist klasörünün var olduğundan emin ol (genellikle build sonrası vardır)
    if (!await fs.pathExists(distDir)) {
        console.error(`[sitemap] Hata: 'dist' klasörü bulunamadı: ${distDir}`);
        process.exit(1);
    }

    // dist içindeki tüm .html dosyalarını bul (hariç tutulanlar dışında)
    const pages = await globby(
      [
        `${distDir}/**/*.html`, // Tüm .html dosyaları
        ...excludedFiles        // Hariç tutulacaklar
      ],
      {
        cwd: distDir, // Çalışma dizini olarak dist belirle (yollar buna göre göreceli olur)
        absolute: true, // Mutlak yolları al (path.relative için daha kolay)
      }
    );

    console.info(`[sitemap] ${pages.length} sayfa bulundu.`);

    // Sitemap XML içeriğini oluştur
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map((pagePathAbsolute) => {
    // Mutlak dosya yolunu dist'e göre göreceli hale getir
    const pagePathRelative = path.relative(distDir, pagePathAbsolute);

    // Göreceli yolu URL formatına çevir
    let pageUrlSegment = pagePathRelative.replace(/\\/g, '/'); // Windows yollarını düzelt

    // 'index.html' kısmını kaldır
    if (pageUrlSegment.endsWith('index.html')) {
      pageUrlSegment = pageUrlSegment.slice(0, -'index.html'.length);
    } else {
      // Diğer .html uzantılarını kaldır
      pageUrlSegment = pageUrlSegment.replace(/\.html$/, '');
    }

    // Başına / ekle (eğer boş değilse)
    if (!pageUrlSegment.startsWith('/') && pageUrlSegment !== '') {
      pageUrlSegment = '/' + pageUrlSegment;
    }
    // Eğer segment boşsa (yani kök index.html ise), sadece / kullan
    pageUrlSegment = pageUrlSegment || '/';

    // Tam URL'yi oluştur
    const fullUrl = `${siteUrl}${pageUrlSegment}`;

    // Opsiyonel: Son değiştirilme tarihi (lastmod) ekleyebilirsiniz
    // const stats = fs.statSync(pagePathAbsolute);
    // const lastMod = stats.mtime.toISOString().split('T')[0]; // YYYY-MM-DD formatı
    // <lastmod>${lastMod}</lastmod>

    return `  <url>
    <loc>${fullUrl}</loc>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    // Sitemap dosyasını dist klasörüne yaz
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemapContent.trim());

    console.info(`[sitemap] sitemap.xml başarıyla oluşturuldu: ${sitemapPath}`);

  } catch (error) {
    console.error('[sitemap] Manuel sitemap oluşturulurken hata oluştu:', error);
    process.exit(1); // Hata durumunda işlemi durdur
  }
}

// Script'i çalıştır
generateSitemap();