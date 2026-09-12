export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    variants?: ProductVariant[];
    ingredients?: string[];
    modelUrl?: string;
    productInfo?: string;
    depositCents?: number;
    minAge?: number;
    allergenCodes?: string[];
    additiveCodes?: string[];
    configurationPending?: boolean;
    sourceUrl?: string;

    available?: boolean;
    stockAvailable?: boolean;
    internalNotes?: string;
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
    minAge?: number;
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


export interface ProductVariant { id: string; name: string; price: number; optionGroups: ProductOptionGroup[]; extras: ProductExtra[]; }
