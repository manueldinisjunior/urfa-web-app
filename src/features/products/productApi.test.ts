import { describe, expect, it } from 'vitest';
import { fetchProductById, fetchProducts } from './productApi';

describe('product data', () => {
  it('loads the local menu without a network dependency', async () => {
    const menu = await fetchProducts();
    expect(menu.length).toBeGreaterThan(0);
    expect(menu.every((product) => product.price > 0)).toBe(true);
  });

  it('loads a known product and rejects an unknown one', async () => {
    await expect(fetchProductById('urfa-mix')).resolves.toMatchObject({ name: 'Urfa Grill Mix' });
    await expect(fetchProductById('missing')).rejects.toThrow('Produkt nicht gefunden');
  });
});
