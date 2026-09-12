import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import { createCartItem } from './cartItem';

describe('createCartItem', () => {
  it('adds selected option and extra prices and creates a stable cart line', () => {
    const wrap = products.find((product) => product.id === 'adana-wrap');
    expect(wrap).toBeDefined();

    const item = createCartItem(wrap!, { schaerfe: 'urfa' }, ['kaese'], 2);

    expect(item.price).toBeCloseTo(11.2);
    expect(item.quantity).toBe(2);
    expect(item.lineId).toBe('adana-wrap::schaerfe:urfa|extra:kaese');
    expect(item.selectedOptions?.[0].optionName).toBe('Urfa scharf');
    expect(item.selectedExtras?.[0].name).toBe('Schafskäse');
  });
});
