import { h } from 'preact';
import DOMPurify from 'dompurify';

// DOMPurify yapılandırması
const DOMPURIFY_CONFIG = { USE_PROFILES: { html: true }, ADD_ATTR: ['target'] };

// Tablo verisi öğesinin tipini tanımla
interface TableDataItem {
    href: string;
    text: string;
    label: string; // data-label için
}

interface StaticTableProps {
    title: string;
    data: TableDataItem[];
    columns?: number; // Varsayılan değeri aşağıda belirleyeceğiz
    tableClass?: string; // Varsayılan değeri aşağıda belirleyeceğiz
}

export default function StaticTable({
    title,
    data,
    columns = 3, // Varsayılan sütun sayısı
    tableClass = 'tags-container', // Varsayılan CSS sınıfı
}: StaticTableProps) {

    // Veri yoksa veya boşsa render etme
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Hücreleri render eden yardımcı fonksiyon
    const renderCell = (item: TableDataItem, index: number) => {
        // Girdileri sanitize et
        const safeLabel = DOMPurify.sanitize(item.label || `Veri ${index + 1}`);
        const safeHref = DOMPurify.sanitize(item.href || '#', DOMPURIFY_CONFIG);
        const safeText = DOMPurify.sanitize(item.text || safeLabel);

        return (
            <td data-label={safeLabel}>
                <a href={safeHref}>
                    {safeText}
                </a>
            </td>
        );
    };

    // Satırları oluşturma mantığı
    const rows = [];
    for (let i = 0; i < data.length; i += columns) {
        const rowCells = data
            .slice(i, i + columns)
            .map((item, idx) => renderCell(item, i + idx));

        if (rowCells.length > 0) {
            // Eksik hücreleri boş td ile doldur (isteğe bağlı, düzen için)
            while (rowCells.length < columns) {
                rowCells.push(<td aria-hidden="true"></td>);
            }
            rows.push(<tr key={`row-${i}`}>{rowCells}</tr>);
        }
    }

    // Hiç satır oluşmadıysa render etme (ekstra kontrol)
    if (rows.length === 0) {
        return null;
    }

    // Sanitize edilmiş başlık
    const safeTitle = DOMPurify.sanitize(title);

    return (
        <table className={tableClass}>
            <thead>
                <tr>
                    <th colSpan={columns}>
                         {/* Orijinal koddaki gibi div sarmalayıcı */}
                         <div className="th-content-wrapper">{safeTitle}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}