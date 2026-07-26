export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    modelUrl?: string; // Optional for 3D models
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface RootState {
    products: ProductsState;
    cart: {
        items: CartItem[];
    };
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: boolean;
}
