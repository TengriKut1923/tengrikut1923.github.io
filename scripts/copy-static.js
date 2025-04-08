// scripts/copy-static.js
// Bu betik zaten iyi durumda, herhangi bir değişiklik ÖNERİLMİYOR.
// Yolların doğru hesaplanması ve loglama mevcut.
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proje kök dizinini betiğin bulunduğu yere göre hesapla
const projectRoot = path.resolve(__dirname, '..');
const staticSourceDir = path.join(projectRoot, 'static-to-copy');
const distDir = path.join(projectRoot, 'dist');

// Loglama: Hesaplanan yolları göster (Hata ayıklama için faydalı)
console.log(`[copy-static] Proje Kökü: ${projectRoot}`);
console.log(`[copy-static] Kaynak Dizin (static-to-copy): ${staticSourceDir}`);
console.log(`[copy-static] Hedef Dizin (dist): ${distDir}`);


// Kopyalanacak dosyalar (dist kök dizini)
const filesToCopy = [
  'favicon.ico',
  'google1e9a0ce83968867d.html',
  'robots.txt',
];

// Kopyalanacak klasörler (dist kök dizini)
const foldersToCopy = [
  { source: 'bediz', destination: 'bediz' },
  { source: 'woff2', destination: 'woff2' }, // woff2 zaten ekli
];

async function copyStaticAssets() {
  console.info('[copy-static] Statik varlıklar kopyalanıyor...');
  try {
    // Hedef dizinin var olduğundan emin ol (astro build zaten oluşturmuş olmalı ama garanti olsun)
    await fs.ensureDir(distDir);
    console.info(`[copy-static] Hedef dizin kontrol edildi/oluşturuldu: ${distDir}`);


    // Dosyaları kopyala
    for (const file of filesToCopy) {
      const sourcePath = path.join(staticSourceDir, file);
      const destinationPath = path.join(distDir, file);
      console.log(`[copy-static] Dosya kontrol ediliyor: ${sourcePath}`); // Ek log
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, destinationPath);
        console.info(`[copy-static] Dosya kopyalandı: ${file} -> ${destinationPath}`);
      } else {
        // Önemli: Eğer kaynak dosya yoksa bu uyarıyı Actions loglarında görmelisiniz.
        console.warn(`[copy-static] UYARI: Kaynak dosya bulunamadı, atlanıyor: ${sourcePath}`);
      }
    }

    // Klasörleri kopyala
    for (const folder of foldersToCopy) {
      const sourcePath = path.join(staticSourceDir, folder.source);
      const destinationPath = path.join(distDir, folder.destination);
      console.log(`[copy-static] Klasör kontrol ediliyor: ${sourcePath}`); // Ek log
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, destinationPath);
        console.info(`[copy-static] Klasör kopyalandı: ${folder.source} -> ${destinationPath}`);
      } else {
        // Önemli: Eğer kaynak klasör yoksa (örn. static-to-copy/bediz), bu uyarıyı Actions loglarında görmelisiniz!
        // Eğer bu uyarıyı görüyorsanız, sorun 'actions/checkout' adımında veya dosya yapısındadır.
        console.warn(`[copy-static] UYARI: Kaynak klasör bulunamadı, atlanıyor: ${sourcePath}`);
      }
    }

    console.info('[copy-static] Statik varlık kopyalama başarıyla tamamlandı.');
  } catch (error) {
    console.error('[copy-static] HATA: Statik varlık kopyalanırken hata oluştu:', error);
    // Hata durumunda build işlemini başarısız olarak işaretle
    process.exit(1);
  }
}

copyStaticAssets();