import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from './productApi';
import type { Product, ProductsState } from '../../types';

export const loadProducts = createAsyncThunk('products/loadProducts', async () => {
    const response = await fetchProducts();
    return response;
});

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(product => product.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(loadProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unable to load products';
            });
    },
});

export const { addProduct, removeProduct } = productsSlice.actions;

export default productsSlice.reducer;
