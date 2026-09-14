import type { HomeProduct } from '@/types/home';

export interface ShopProduct extends HomeProduct {}

export interface CategoryNode {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    children: { id: number; name: string; slug: string }[];
}

export interface CategorySelection {
    name: string;
    slug: string;
    root: { id: number; name: string; slug: string };
}

export interface ShopPageProps {
    products: {
        data: ShopProduct[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        from: number | null;
        to: number | null;
        per_page: number;
        total: number;
        first_page_url: string;
        last_page_url: string;
        next_page_url: string | null;
        prev_page_url: string | null;
        path: string;
    };
    categories: CategoryNode[];
    activeCategory: CategorySelection | null;
    search: string;
    sort: string;
}

export interface ProductDetailPageProps {
    product: ShopProduct & {
        images: string[];
        farmer: {
            display_name: string;
            bio: string | null;
            location: string | null;
        } | null;
    };
    related: ShopProduct[];
}

export interface CartProduct extends ShopProduct {
    quantity: number;
    subtotal: number;
    available: boolean;
}

export interface CartPageProps {
    items: CartProduct[];
    unavailableItems: CartProduct[];
    subtotal: number;
    count: number;
}

export interface CheckoutPageProps {
    items: CartProduct[];
    subtotal: number;
    deliveryCharge: number;
    freeDeliveryAbove: number;
}

export interface OrderLine {
    product_name: string;
    unit: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
}

export interface OrderPageProps {
    order: {
        order_number: string;
        customer_name: string;
        customer_phone: string;
        delivery_address: string;
        delivery_area: string | null;
        delivery_district: string;
        delivery_instructions: string | null;
        delivery_charge: number;
        subtotal: number;
        total: number;
        payment_method: string;
        payment_status: string;
        order_status: string;
        created_at: string;
        items: OrderLine[];
    };
}
