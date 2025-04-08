import { h } from 'preact';
import DOMPurify from 'dompurify';

interface GalleryItem {
    id: string;
    h: string; // href
    s: string; // imgSrc
    a: string; // alt
    p: boolean; // pinned
}

interface GridItemProps {
    item: GalleryItem;
}

const DOMPURIFY_CONFIG = { USE_PROFILES: { html: true }, ADD_ATTR: ['target'] };

export default function GridItem({ item }: GridItemProps) {
    // Girdileri sanitize et
    const safeHref = DOMPurify.sanitize(item.h || '#', DOMPURIFY_CONFIG);
    const safeSrc = DOMPurify.sanitize(item.s || '', DOMPURIFY_CONFIG);
    const safeAlt = DOMPurify.sanitize(item.a || '');
    const safeTitle = safeAlt; // Başlık olarak alt metni kullan

    // Gerekli veriler yoksa render etme
    if (!safeSrc || !safeAlt) {
        return null;
    }

    return (
        <a
            href={safeHref}
            target="_blank" // Linkleri yeni sekmede aç
            rel="noopener noreferrer" // Güvenlik
            title={safeTitle}
            className="image-box-link" // CSS için sınıf
            data-item-id={item.id} // Debug veya test için ID
        >
            <div className={`image-box ${item.p ? 'pinned' : ''}`}>
                <img
                    src={safeSrc}
                    alt={safeAlt}
                    loading="lazy" // Lazy loading
                    decoding="async" // Asenkron decode
                    width="200" // Tarayıcıya ipucu (CSS yönetir)
                    height="200" // Tarayıcıya ipucu (CSS yönetir)
                />
            </div>
        </a>
    );
}