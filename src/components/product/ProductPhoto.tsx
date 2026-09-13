import type { Product } from '../../types';
import { assetUrl } from '../../utils/assetUrl';

// Exact dish names only. Uploaded reference posters are not restaurant photos.
const references: Record<string, { file: string; box: string; width: number; height: number }> = {
  'Mercimek': { file: 'dish-reference-classics.png', box: '150 90 140 95', width: 452, height: 678 },
  'Cacik': { file: 'dish-reference-classics.png', box: '150 235 140 100', width: 452, height: 678 },
  'Baklava Portion': { file: 'dish-reference-classics.png', box: '295 90 145 95', width: 452, height: 678 },
  'Lahmacun': { file: 'dish-reference-cuisine.png', box: '166 237 145 126', width: 476, height: 644 },
};
export const hasProductPhoto = (product: Product) => Boolean(product.imageUrl || references[product.name]);
export default function ProductPhoto({ product }: { product: Product }) {
  if (product.imageUrl) return <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />;
  const reference = references[product.name];
  if (!reference) return null;
  return <span className="dish-reference"><svg viewBox={reference.box} role="img" aria-label={`${product.name} – Beispielabbildung, kein Foto von Urfa`}><image href={assetUrl(`assets/${reference.file}`)} width={reference.width} height={reference.height} /></svg><small>Beispielabbildung · kein Urfa-Produktfotoshooting</small></span>;
}
