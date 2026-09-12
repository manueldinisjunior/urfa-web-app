export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Grill' | 'Wraps' | 'Vegetarisch' | 'Beilagen' | 'Getränke';
    imageUrl: string;
    featured?: boolean;
    optionGroups?: ProductOptionGroup[];
    extras?: ProductExtra[];
}

export interface ProductOption {
    id: string;
    name: string;
    price?: number;
}

export interface ProductOptionGroup {
    id: string;
    name: string;
    required?: boolean;
    options: ProductOption[];
}

export interface ProductExtra {
    id: string;
    name: string;
    price: number;
}

export interface SelectedProductOption {
    groupId: string;
    groupName: string;
    optionId: string;
    optionName: string;
    price: number;
}

export interface CartItem {
    lineId: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    selectedOptions?: SelectedProductOption[];
    selectedExtras?: ProductExtra[];
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface RootState {
    cart: {
        items: CartItem[];
    };
}

