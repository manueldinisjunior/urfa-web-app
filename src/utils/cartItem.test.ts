import { describe, expect, it } from 'vitest';
import type { Product } from '../types';
import { createCartItem } from './cartItem';

describe('createCartItem', () => {
  it('adds selected option and extra prices and creates a stable cart line', () => {
    const wrap: Product = {id:'adana-wrap',name:'Wrap',description:'',price:8.9,category:'Wraps',imageUrl:'',optionGroups:[{id:'schaerfe',name:'Schärfe',options:[{id:'urfa',name:'Urfa scharf',price:.5}]}],extras:[{id:'kaese',name:'Schafskäse',price:1.8}]};
    expect(wrap).toBeDefined();

    const item = createCartItem(wrap!, { schaerfe: 'urfa' }, ['kaese'], 2);

    expect(item.price).toBeCloseTo(11.2);
    expect(item.quantity).toBe(2);
    expect(item.lineId).toBe('adana-wrap::schaerfe:urfa|extra:kaese');
    expect(item.selectedOptions?.[0].optionName).toBe('Urfa scharf');
    expect(item.selectedExtras?.[0].name).toBe('Schafskäse');
  });
});
