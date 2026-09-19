import type { Product } from '../../types';
import { assetUrl } from '../../utils/assetUrl';
import additionalReferences from '../../data/product-photo-references.json';

// User-supplied example photos; never substitute a different dish or imply Urfa provenance.
const references: Record<string, string> = {
  ...additionalReferences,
  'Lahmacun mit Dönerfleisch': 'example-lahmacun-white.webp',
  'Dönertasche': 'example-doener-white.webp',
  'Döner Box': 'example-doener-box.png',
  'Tavuk Şi̇ş': 'example-tavuk-sis-white.webp',
  'Urfa Karisik Izgara': 'example-karisik-izgara-white.webp',
  'Baklava Portion': 'example-baklava-white.webp',
};
// Each viewport isolates one plate from the user-approved generated selection.
const schnitzelViewports: Record<string, string> = {
  'Hollandaise Schnitzel (Putenfleisch)': '0 135 384 280',
  'Jägerschnitzel (Hähnchenschnitzel)': '384 135 384 280',
  'Paprikaschnitzel (Putenfleisch)': '768 135 384 280',
  'Hawaii Schnitzel (Hähnchenschnitzel)': '1152 135 384 280',
  'Hähnchenschnitzel': '90 520 445 310',
  'Urfa Schnitzel (Kalbfleisch)': '540 520 445 310',
  'Rahmschnitzel (Hähnchenschnitzel)': '990 520 445 310',
};
export const hasProductPhoto = (product: Product) => Boolean(product.imageUrl || references[product.name] || schnitzelViewports[product.name]);
export default function ProductPhoto({ product }: { product: Product }) {
  if (product.imageUrl) return <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />;
  const viewport = schnitzelViewports[product.name];
  if (viewport) return <span className="product-studio-photo">
    <span style={{ display: 'flex', alignItems: 'center', width: '100%', aspectRatio: '1', padding: '16px', boxSizing: 'border-box' }}>
      <svg viewBox={viewport} role="img" aria-label={`${product.name} – KI-generierte Beispielabbildung`} style={{ display: 'block', width: '100%', overflow: 'hidden' }}>
        <image href={assetUrl('assets/example-schnitzel-selection.png')} width="1536" height="1024" />
      </svg>
    </span>
    <small>KI-generierte Beispielabbildung · Beilagen laut Auswahl</small>
  </span>;
  const reference = references[product.name];
  if (!reference) return null;
  return <span className="product-studio-photo"><img src={assetUrl(`assets/${reference}`)} alt={`${product.name} – Beispielabbildung`} loading="lazy" decoding="async" width="1000" height="1000"/><small>Beispielabbildung · Zutaten und Beilagen laut Auswahl</small></span>;
}
