export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Grill' | 'Wraps' | 'Vegetarisch' | 'Beilagen';
    emoji: string;
    accent: string;
    featured?: boolean;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    emoji: string;
    accent: string;
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
