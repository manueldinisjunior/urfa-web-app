import type { Product } from '../../types';
import { assetUrl } from '../../utils/assetUrl';
import brandedPhotos from '../../data/branded-product-photos.json';

const references: Record<string, string> = brandedPhotos;
export const hasProductPhoto = (product: Product) => Boolean(references[product.name] || product.imageUrl);

export default function ProductPhoto({ product }: { product: Product }) {
  const reference = references[product.name];
  const source = reference ? `assets/${reference}` : product.imageUrl;
  if (!source) return null;
  return <span className="product-studio-photo product-branded-photo">
    <img src={assetUrl(source)} alt={`${product.name}${reference ? ' – KI-bearbeitete Beispielabbildung' : ''}`} loading="lazy" decoding="async" width="768" height="768" />
    {reference && <small>Beispielabbildung · Zutaten und Beilagen laut Auswahl</small>}
  </span>;
}
