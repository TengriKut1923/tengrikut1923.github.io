import { h } from 'preact';
import GridItem from './GridItem'; // GridItem'ı import ediyoruz

// GalleryManager'dan gelen veri tipini tanımlayın (eşleştiğinden emin olun)
interface GalleryItem {
    id: string;
    h: string; // href
    s: string; // imgSrc
    a: string; // alt
    p: boolean; // pinned
}

interface ImageGridProps {
    items: GalleryItem[];
    isLoading?: boolean; // İsteğe bağlı yükleme durumu
}

export default function ImageGrid({ items, isLoading }: ImageGridProps) {
    // Yükleme durumu için basit bir iskelet gösterimi (isteğe bağlı)
    if (isLoading) {
        // Kaç tane iskelet öğesi gösterileceğini ayarlayabilirsiniz
        const skeletonCount = 12;
        return (
            <div className="grid-container is-loading" aria-busy="true">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="image-box skeleton-box">
                         {/* İskelet içeriği (CSS ile stil verilebilir) */}
                    </div>
                ))}
                {/* CSS'e .is-loading ve .skeleton-box sınıfları eklenmeli */}
            </div>
        );
    }

    // Geçerli bir dizi gelip gelmediğini kontrol et
    if (!Array.isArray(items) || items.length === 0) {
        // Varsa ve boşsa belki "Gösterilecek öğe yok" mesajı gösterilebilir,
        // ancak GalleryManager'daki "Sonuç bulunamadı" mesajı bunu zaten yapabilir.
        // Şimdilik null dönelim.
        return null;
    }

    return (
        <div className="grid-container">
            {items.map((item) => (
                // GridItem bileşenini her öğe için render et
                // key prop'unun benzersiz olması önemli
                <GridItem item={item} key={item.id} />
            ))}
        </div>
    );
}