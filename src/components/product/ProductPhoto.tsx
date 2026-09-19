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
export const hasProductPhoto = (product: Product) => Boolean(product.imageUrl || references[product.name]);
export default function ProductPhoto({ product }: { product: Product }) {
  if (product.imageUrl) return <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />;
  const reference = references[product.name];
  if (!reference) return null;
  return <span className="product-studio-photo"><img src={assetUrl(`assets/${reference}`)} alt={`${product.name} – Beispielabbildung`} loading="lazy" decoding="async" width="1000" height="1000"/><small>Beispielabbildung · Zutaten und Beilagen laut Auswahl</small></span>;
}
