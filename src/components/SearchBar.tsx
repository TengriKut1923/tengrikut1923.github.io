import { h } from 'preact';
// useCallback kaldırıldı, useRef eklendi
import { useState, useEffect, useRef } from 'preact/hooks';
import debounce from 'just-debounce-it';

// Debounce fonksiyonunun tipini tanımla (isteğe bağlı)
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
    debounceWait = 300,
}: SearchBarProps) {
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedSearchRef = useRef<DebouncedFunction<(value: string) => void> | null>(null);

    // Debounce fonksiyonunu oluştur/güncelle
    useEffect(() => {
        debouncedSearchRef.current = debounce((value: string) => {
            onSearch(value);
        }, debounceWait);

        // Component unmount olduğunda debounce timer'ını temizle
        return () => {
            if (debouncedSearchRef.current?.cancel) {
                debouncedSearchRef.current.cancel();
            }
        };
    }, [onSearch, debounceWait]);

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        // Düzeltme: null kontrolü
        if (debouncedSearchRef.current) {
            debouncedSearchRef.current(value);
        }
    };

    const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        if (debouncedSearchRef.current?.cancel) {
            debouncedSearchRef.current.cancel();
        }
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
                    aria-busy={isLoading}
                    autoComplete="off"
                />
                {isLoading && (
                    <span class="search-loading-spinner" aria-hidden="true"></span>
                )}
            </div>
        </form>
    );
}