import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from './productApi';

export const loadProducts = createAsyncThunk('products/loadProducts', async () => {
    const response = await fetchProducts();
    return response;
});

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addProduct: (state, action) => {
            state.items.push(action.payload);
        },
        removeProduct: (state, action) => {
            state.items = state.items.filter(product => product.id !== action.payload.id);
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
                state.error = action.error.message;
            });
    },
});

export const { addProduct, removeProduct } = productsSlice.actions;

export default productsSlice.reducer;