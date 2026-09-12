import { describe, expect, it } from 'vitest';
import reducer, { addItem, clearCart, removeItem, setQuantity } from './cartSlice';

const item = {
  lineId: 'adana-wrap',
  id: 'adana-wrap',
  name: 'Adana Wrap',
  price: 8.9,
  quantity: 1,
  imageUrl: 'assets/product-adana-wrap.webp',
};

describe('cart reducer', () => {
  it('adds new items and combines duplicate quantities', () => {
    const once = reducer(undefined, addItem(item));
    const twice = reducer(once, addItem(item));

    expect(twice.items).toEqual([{ ...item, quantity: 2 }]);
  });

  it('updates, removes, and clears cart items', () => {
    const initial = reducer(undefined, addItem(item));
    const updated = reducer(initial, setQuantity({ lineId: item.lineId, quantity: 3 }));
    expect(updated.items[0].quantity).toBe(3);

    const removedByQuantity = reducer(updated, setQuantity({ lineId: item.lineId, quantity: 0 }));
    expect(removedByQuantity.items).toHaveLength(0);

    const removed = reducer(initial, removeItem(item.lineId));
    expect(removed.items).toHaveLength(0);

    const cleared = reducer(initial, clearCart());
    expect(cleared.items).toHaveLength(0);
  });

  it('caps a single item quantity at twenty', () => {
    const initial = reducer(undefined, addItem(item));
    const updated = reducer(initial, setQuantity({ lineId: item.lineId, quantity: 50 }));
    expect(updated.items[0].quantity).toBe(20);
  });

  it('keeps differently configured versions as separate cart lines', () => {
    const mild = { ...item, lineId: 'adana-wrap::schaerfe:mild' };
    const spicy = { ...item, lineId: 'adana-wrap::schaerfe:urfa', price: 9.4 };
    const state = reducer(reducer(undefined, addItem(mild)), addItem(spicy));

    expect(state.items).toHaveLength(2);
    expect(state.items.map((entry) => entry.lineId)).toEqual([mild.lineId, spicy.lineId]);
  });
});
