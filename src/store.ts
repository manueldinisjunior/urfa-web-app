import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productsReducer from './features/products/productsSlice';
import type { CartItem } from './types';

const readSavedCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('urfa-cart');
    const parsed: unknown = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  preloadedState: {
    cart: { items: readSavedCart() },
  },
});

store.subscribe(() => {
  localStorage.setItem('urfa-cart', JSON.stringify(store.getState().cart.items));
});

export type AppDispatch = typeof store.dispatch;
