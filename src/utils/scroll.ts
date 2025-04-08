// src/utils/scroll.ts
import Logger from './logger';

/**
 * Kaydırma işlemleri için yardımcı fonksiyonlar.
 * Astro View Transitions ile birlikte davranışları gözden geçirilmelidir.
 */
const ScrollManager = {
  /**
   * Sayfanın en üstüne yumuşakça kaydırır.
   */
  scrollToTop: (smooth: boolean = true): void => {
    try {
      window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
      Logger.info('[Scroll] Sayfa başına kaydırıldı.');
    } catch (error) {
      Logger.error('[Scroll] Sayfa başına kaydırma hatası:', error);
    }
  },

  /**
   * Belirtilen dikey pozisyona (Y koordinatı) kaydırır.
   * @param y Dikey piksel pozisyonu.
   * @param smooth Yumuşak kaydırma etkinleştirilsin mi?
   */
  scrollToPosition: (y: number, smooth: boolean = true): void => {
    if (typeof y !== 'number') {
      Logger.warn('[Scroll] Geçersiz Y pozisyonu:', y);
      return;
    }
    try {
      window.scrollTo({
        top: y,
        behavior: smooth ? 'smooth' : 'auto',
      });
      Logger.info(`[Scroll] Pozisyon ${y}'ye kaydırıldı.`);
    } catch (error) {
      Logger.error(`[Scroll] Pozisyon ${y}'ye kaydırma hatası:`, error);
    }
  },

  /**
   * Geri/İleri butonları için kaydırma pozisyonunu kaydeder.
   * Astro View Transitions bunu otomatik yapabilir, bu manuel yöntem
   * genellikle gerekli olmaz ama gerekirse kullanılabilir.
   * @param key Genellikle `location.pathname + location.search`
   * @param position Kaydedilecek `window.scrollY` değeri
   */
  saveScrollPosition: (key: string, position: number): void => {
      if (typeof window !== 'undefined' && window.sessionStorage) {
          try {
              const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
              positions[key] = position;
              sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
              Logger.info(`[Scroll] Pozisyon kaydedildi: ${key} = ${position}`);
          } catch (e) {
              Logger.error('[Scroll] sessionStorage pozisyon kaydetme hatası:', e);
          }
      }
  },

  /**
   * Kaydedilmiş kaydırma pozisyonunu alır.
   * @param key Genellikle `location.pathname + location.search`
   * @returns Kaydedilmiş pozisyon veya 0
   */
  getScrollPosition: (key: string): number => {
      if (typeof window !== 'undefined' && window.sessionStorage) {
          try {
              const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
              Logger.info(`[Scroll] Pozisyon getirildi: ${key} = ${positions[key] ?? 0}`);
              return positions[key] ?? 0;
          } catch (e) {
              Logger.error('[Scroll] sessionStorage pozisyon getirme hatası:', e);
              return 0;
          }
      }
      return 0;
  },
};

export default ScrollManager;