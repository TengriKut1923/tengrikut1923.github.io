import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import debounce from 'just-debounce-it';

type DebouncedFunction<T extends (...args: any[]) => any> = T & { cancel?: () => void };

interface SearchBarProps {
    initialQuery?: string;
    onSearch: (query: string) => void;
    isLoading: boolean;
    placeholder?: string;
    ariaLabel?: string;
    debounceWait?: number;
}

export default function SearchBar({
    initialQuery = '',
    onSearch,
    isLoading,
    placeholder = 'Ara...',
    ariaLabel = 'Arama',
    debounceWait = 300, // debounceWait prop'u eklendi (varsayılan 300ms)
}: SearchBarProps) {
    const [inputValue, setInputValue] = useState(initialQuery);
    // useRef kullanarak debounce fonksiyonunu sakla
    const debouncedSearchRef = useRef<DebouncedFunction<(value: string) => void> | null>(null);

    // Debounce fonksiyonunu oluştur/güncelle (sadece onSearch veya debounceWait değişirse)
    useEffect(() => {
        const debouncedFn = debounce((value: string) => {
            onSearch(value);
        }, debounceWait);
        debouncedSearchRef.current = debouncedFn;

        // Component unmount olduğunda debounce timer'ını temizle
        return () => {
            debouncedFn.cancel?.(); // cancel varsa çağır
        };
    }, [onSearch, debounceWait]);

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        // Debounce edilmiş fonksiyonu çağır (varsa)
        debouncedSearchRef.current?.(value);
    };

    const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        // Submit edildiğinde debounce'ı iptal et ve hemen ara
        debouncedSearchRef.current?.cancel?.();
        onSearch(inputValue);
    };

    // initialQuery dışarıdan (URL'den vb.) değişirse input değerini güncelle
    useEffect(() => {
        setInputValue(initialQuery);
    }, [initialQuery]);

    return (
        <form className={`search-bar ${isLoading ? 'is-loading' : ''}`} onSubmit={handleSubmit} role="search">
            <div class="search-input-wrapper">
                <input
                    type="search"
                    id="search-input"
                    placeholder={placeholder}
                    value={inputValue}
                    onInput={handleInputChange}
                    aria-label={ariaLabel}
                    aria-busy={isLoading} // isLoading durumunu aria-busy ile belirt
                    autoComplete="off" // Tarayıcı otomatik tamamlamasını kapat
                    // Gerekirse diğer input nitelikleri: autoFocus, required vb.
                />
                {/* Yükleme göstergesi */}
                {isLoading && (
                    <span class="search-loading-spinner" aria-hidden="true"></span>
                    /* İsteğe bağlı: Ekran okuyucular için gizli metin
                    <span class="visually-hidden">Arama yapılıyor...</span>
                    */
                )}
            </div>
            {/* İsteğe bağlı: Submit butonu (Enter ile de çalışır)
            <button type="submit" class="search-submit-button" aria-label="Ara">
                Ara
            </button>
             */}
        </form>
    );
}