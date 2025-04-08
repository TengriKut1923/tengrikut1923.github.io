import { h } from 'preact';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    buildPath: (page: number) => string;
}

export default function Pagination({ currentPage, totalPages, buildPath }: PaginationProps) {
    if (!totalPages || totalPages <= 1) { return null; }
    const range = 2;
    const pages = [];

    const createLink = (page: number) => {
        const path = buildPath(page);
        const isCurrent = page === currentPage;
        return (
            <a href={path} className={isCurrent ? 'active' : ''} aria-label={`Sayfa ${page}`}
               aria-current={isCurrent ? 'page' : undefined} key={`page-${page}`} >
                {page.toString()}
            </a>
        );
    };

    if (currentPage > 1) {
        pages.push(<a href={buildPath(currentPage - 1)} key="prev" aria-label="Önceki Sayfa">«</a>);
    } else {
        pages.push(<span key="prev-disabled" className="page-disabled" aria-hidden="true" aria-disabled="true">«</span>);
    }

    if (totalPages <= (2 * range) + 3) {
        for (let i = 1; i <= totalPages; i++) pages.push(createLink(i));
    } else {
        pages.push(createLink(1));
        let start = Math.max(2, currentPage - range);
        let end = Math.min(totalPages - 1, currentPage + range);
        if (start > 2) pages.push(<span key="dots-start" className="page-dots" aria-hidden="true">...</span>);
        for (let i = start; i <= end; i++) pages.push(createLink(i));
        if (end < totalPages - 1) pages.push(<span key="dots-end" className="page-dots" aria-hidden="true">...</span>);
        pages.push(createLink(totalPages));
    }

    if (currentPage < totalPages) {
        pages.push(<a href={buildPath(currentPage + 1)} key="next" aria-label="Sonraki Sayfa">»</a>);
    } else {
        pages.push(<span key="next-disabled" className="page-disabled" aria-hidden="true" aria-disabled="true">»</span>);
    }

    return (<nav className="pagination" role="navigation" aria-label="Sayfalandırma">{pages}</nav>);
}