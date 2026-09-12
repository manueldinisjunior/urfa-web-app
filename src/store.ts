import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import type { CartItem } from './types';

const CART_STORAGE_KEY = 'urfa-cart-v4';

const readSavedCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is CartItem => item && typeof item.id==='string' && typeof item.lineId==='string' && typeof item.name==='string' && Number.isFinite(item.price) && item.price>=0 && Number.isInteger(item.quantity) && item.quantity>0 && item.quantity<=20 && typeof item.imageUrl==='string') : [];
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: { items: readSavedCart() },
  },
});

store.subscribe(() => {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart.items)); } catch { /* Cart remains usable when storage is unavailable. */ }
});

export type AppDispatch = typeof store.dispatch;
