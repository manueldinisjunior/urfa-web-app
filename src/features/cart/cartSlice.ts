import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    replaceCart: (state, action: PayloadAction<CartItem[]>) => { state.items=action.payload; },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.lineId === action.payload.lineId);
      if (existingItem) existingItem.quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    setQuantity: (state, action: PayloadAction<{ lineId: string; quantity: number }>) => {
      const item = state.items.find((entry) => entry.lineId === action.payload.lineId);
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((entry) => entry.lineId !== action.payload.lineId);
      } else {
        item.quantity = Math.min(action.payload.quantity, 20);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.lineId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart, replaceCart } = cartSlice.actions;
export default cartSlice.reducer;
