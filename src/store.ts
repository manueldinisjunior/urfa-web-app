import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { clearCart } from './features/cart/cartSlice';
import type { CartItem } from './types';

const CART_STORAGE_KEY = 'urfa-cart-v5';
let expiresAt = 0;

const readSavedCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const saved = savedCart ? JSON.parse(savedCart) : null;
    expiresAt = Number(saved?.expiresAt) || 0;
    if(expiresAt<=Date.now())expiresAt=0;
    const parsed: unknown = expiresAt > Date.now() ? saved.items : [];
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
  const items=store.getState().cart.items;
  if(!items.length) expiresAt=0;
  else if(!expiresAt) expiresAt=Date.now()+86400000;
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({items,expiresAt})); } catch { /* Cart remains usable when storage is unavailable. */ }
});
if(typeof window!=='undefined')window.setInterval(()=>{if(expiresAt && expiresAt<=Date.now())store.dispatch(clearCart());},1000);

export type AppDispatch = typeof store.dispatch;
