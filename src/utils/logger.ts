// src/utils/logger.ts

/**
 * Geliştirme ortamında konsola log basan basit bir logger.
 * İleride Sentry gibi harici servislere gönderim eklenebilir.
 */
const Logger = {
  info: (message: string, ...optionalParams: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.info(`[BİLGİ] ${message}`, ...optionalParams);
    }
    // Üretimde harici loglama servisine gönderilebilir
    // trackEvent('info', message, optionalParams);
  },

  warn: (message: string, ...optionalParams: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.warn(`[UYARI] ${message}`, ...optionalParams);
    }
    // Üretimde harici loglama servisine gönderilebilir
    // trackEvent('warning', message, optionalParams);
  },

  error: (message: string, error?: Error | unknown, ...optionalParams: unknown[]): void => {
    console.error(`[HATA] ${message}`, error ?? '', ...optionalParams);
    // Üretimde harici hata takip servisine gönderilebilir
    // reportError(error ?? new Error(message), { extra: optionalParams });
  },
};

export default Logger;