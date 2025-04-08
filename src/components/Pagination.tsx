import { h } from 'preact';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    buildPath: (page: number) => string; // Sayfa için URL üreten fonksiyon
}

export default function Pagination({ currentPage, totalPages, buildPath }: PaginationProps) {
    if (!totalPages || totalPages <= 1) {
        return null;
    }

    const range = 2; // Gösterilecek sayfa aralığı
    const pages = [];

    const createLink = (page: number) => {
        const path = buildPath(page);
        const isCurrent = page === currentPage;
        return (
            <a
                href={path} // Astro bu linkleri yakalayıp View Transitions yapacak
                className={isCurrent ? 'active' : ''}
                aria-label={`Sayfa ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
                key={`page-${page}`}
                // data-astro-prefetch // @astrojs/prefetch zaten handle eder
            >
                {page.toString()}
            </a>
        );
    };

    // Önceki Sayfa Butonu
    if (currentPage > 1) {
        pages.push(
            <a href={buildPath(currentPage - 1)} key="prev" aria-label="Önceki Sayfa">
                «
            </a>
        );
    } else {
        pages.push(
            <span key="prev-disabled" className="page-disabled" aria-hidden="true" aria-disabled="true">
                «
            </span>
        );
    }

    // Sayfa Numaraları
    if (totalPages <= (2 * range) + 3) { // Çok az sayfa varsa hepsini göster
        for (let i = 1; i <= totalPages; i++) {
            pages.push(createLink(i));
        }
    } else { // Çok sayfa varsa aralık ve ... kullan
        pages.push(createLink(1)); // İlk sayfa her zaman görünür

        let start = Math.max(2, currentPage - range);
        let end = Math.min(totalPages - 1, currentPage + range);

        if (start > 2) {
            pages.push(<span key="dots-start" className="page-dots" aria-hidden="true">...</span>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(createLink(i));
        }

        if (end < totalPages - 1) {
            pages.push(<span key="dots-end" className="page-dots" aria-hidden="true">...</span>);
        }

        pages.push(createLink(totalPages)); // Son sayfa her zaman görünür
    }

    // Sonraki Sayfa Butonu
    if (currentPage < totalPages) {
        pages.push(
            <a href={buildPath(currentPage + 1)} key="next" aria-label="Sonraki Sayfa">
                »
            </a>
        );
    } else {
        pages.push(
            <span key="next-disabled" className="page-disabled" aria-hidden="true" aria-disabled="true">
                »
            </span>
        );
    }

    return (
        <nav className="pagination" role="navigation" aria-label="Sayfalandırma">
            {pages}
        </nav>
    );
}