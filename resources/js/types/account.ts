import type { OrderLine } from '@/types/shop';

export interface OrderSummary {
    order_number: string;
    total: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    created_at: string;
    items_count: number;
}

export interface OrderSummaryPaginator {
    data: OrderSummary[];
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
}

export interface OrderDetail {
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
}

export interface AccountDashboardPageProps {
    total_orders: number;
    recent_orders: OrderSummary[];
}

export interface AccountOrdersPageProps {
    orders: OrderSummaryPaginator;
}

export interface AccountOrderShowPageProps {
    order: OrderDetail;
}
