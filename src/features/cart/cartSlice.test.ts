import { describe, expect, it } from 'vitest';
import reducer, { addItem, clearCart, removeItem, setQuantity } from './cartSlice';

const item = {
  id: 'adana-wrap',
  name: 'Adana Wrap',
  price: 8.9,
  quantity: 1,
  emoji: '🌯',
  accent: '#e8762f',
};

describe('cart reducer', () => {
  it('adds new items and combines duplicate quantities', () => {
    const once = reducer(undefined, addItem(item));
    const twice = reducer(once, addItem(item));

    expect(twice.items).toEqual([{ ...item, quantity: 2 }]);
  });

  it('updates, removes, and clears cart items', () => {
    const initial = reducer(undefined, addItem(item));
    const updated = reducer(initial, setQuantity({ id: item.id, quantity: 3 }));
    expect(updated.items[0].quantity).toBe(3);

    const removedByQuantity = reducer(updated, setQuantity({ id: item.id, quantity: 0 }));
    expect(removedByQuantity.items).toHaveLength(0);

    const removed = reducer(initial, removeItem(item.id));
    expect(removed.items).toHaveLength(0);

    const cleared = reducer(initial, clearCart());
    expect(cleared.items).toHaveLength(0);
  });

  it('caps a single item quantity at twenty', () => {
    const initial = reducer(undefined, addItem(item));
    const updated = reducer(initial, setQuantity({ id: item.id, quantity: 50 }));
    expect(updated.items[0].quantity).toBe(20);
  });
});
