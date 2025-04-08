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
    debounceWait = 300,
}: SearchBarProps) {
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedSearchRef = useRef<DebouncedFunction<(value: string) => void> | null>(null);

    useEffect(() => {
        const debouncedFn = debounce((value: string) => { onSearch(value); }, debounceWait);
        debouncedSearchRef.current = debouncedFn;
        return () => { debouncedFn.cancel?.(); };
    }, [onSearch, debounceWait]);

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        debouncedSearchRef.current?.(value);
    };

    const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        debouncedSearchRef.current?.cancel?.();
        onSearch(inputValue);
    };

    useEffect(() => { setInputValue(initialQuery); }, [initialQuery]);

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
                {isLoading && ( <span class="search-loading-spinner" aria-hidden="true"></span> )}
            </div>
        </form>
    );
}