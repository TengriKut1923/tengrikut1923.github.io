// scripts/split-data.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const sourceDataDir = path.join(projectRoot, 'kaynak-veriler');
const distJsonDir = path.join(projectRoot, 'dist', 'json');

const Config = {
  ITEMS_PER_PAGE: 48, // Sayfa başına öğe sayısı
};

async function splitAndOptimizeData() {
  console.info('[split-data] JSON verileri işleniyor...');

  try {
    // Kaynak dosyaların yolları
    const sunumSourcePath = path.join(sourceDataDir, 'sunum.json');
    const cizelgeSourcePath = path.join(sourceDataDir, 'cizelge.json');

    // Hedef json klasörünü oluştur
    await fs.ensureDir(distJsonDir);

    // Kaynak JSON verilerini oku
    console.info(`[split-data] ${sunumSourcePath} okunuyor...`);
    const rawSunumData = await fs.readJson(sunumSourcePath);
    console.info(`[split-data] ${cizelgeSourcePath} okunuyor...`);
    const rawCizelgeData = await fs.readJson(cizelgeSourcePath);

    // --- Optimizasyon ve Veri İşleme ---

    // 1. sunum.json verisini optimize et (yalnızca gerekli alanları tut, ID ekle)
    if (!Array.isArray(rawSunumData)) {
        throw new Error('kaynak-veriler/sunum.json bir dizi değil!');
    }
    const allItems = rawSunumData.map((item, index) => ({
      id: item.id || `item-${index}-${Date.now()}`, // Benzersiz ID sağla
      h: item.href,       // Anahtar kısaltma örneği (href -> h)
      s: item.imgSrc,     // Anahtar kısaltma örneği (imgSrc -> s)
      a: item.alt,        // Anahtar kısaltma örneği (alt -> a)
      t: item.tags || [], // Etiketler (varsa)
      p: item.pinned || false, // Pinned durumu
      // Diğer gerekli alanları buraya ekleyin (kısaltılmış veya orijinal isimlerle)
    }));

    // Pinned öğeleri başa alarak sırala (orijinal koddaki gibi)
    allItems.sort((a, b) => (a.p === b.p) ? 0 : a.p ? -1 : 1);

    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / Config.ITEMS_PER_PAGE) || 1;

    // 2. sunum.json verisini sayfalara böl ve kaydet
    for (let i = 0; i < totalPages; i++) {
      const pageNumber = i + 1;
      const startIndex = i * Config.ITEMS_PER_PAGE;
      const endIndex = startIndex + Config.ITEMS_PER_PAGE;
      const pageItems = allItems.slice(startIndex, endIndex);
      const pageFileName = `page-${pageNumber}.json`;
      const pageFilePath = path.join(distJsonDir, pageFileName);

      // Minify ederek kaydet (JSON.stringify boşlukları kaldırır)
      await fs.writeFile(pageFilePath, JSON.stringify(pageItems));
      console.info(`[split-data] ${pageFileName} oluşturuldu (${pageItems.length} öğe).`);
    }

    // 3. cizelge.json verisini optimize et ve sayfalama bilgisi ekle
    const optimizedCizelgeData = {
      tags: rawCizelgeData.tags || [], // Gerekli alanları al
      updated: rawCizelgeData.updated || [], // Gerekli alanları al
      // --- Sayfalama Bilgisi ---
      paginationInfo: {
        totalItems: totalItems,
        itemsPerPage: Config.ITEMS_PER_PAGE,
        totalPages: totalPages,
      },
      // Diğer gerekli cizelge verileri buraya eklenebilir
    };

    const cizelgeFilePath = path.join(distJsonDir, 'cizelge.json');
    await fs.writeFile(cizelgeFilePath, JSON.stringify(optimizedCizelgeData));
    console.info(`[split-data] Optimize edilmiş cizelge.json oluşturuldu.`);

    console.info('[split-data] JSON veri işleme tamamlandı.');

  } catch (error) {
    console.error('[split-data] JSON verileri işlenirken hata oluştu:', error);
    process.exit(1); // Hata durumunda build işlemini durdur
  }
}

splitAndOptimizeData();