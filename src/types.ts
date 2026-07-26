export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    modelUrl?: string; // Optional for 3D models
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: boolean;
}