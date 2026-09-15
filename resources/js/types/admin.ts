import type { OrderLine } from '@/types/shop';

// ---------------------------------------------------------------------------
// Shared admin types
// ---------------------------------------------------------------------------

export type StatusOption = { value: string; label: string };

export interface AdminFilters {
    search?: string | number | null;
    [key: string]: string | number | boolean | null | undefined;
}

export interface Paginator<T> {
    data: T[];
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

export interface AdminStats {
    users: number;
    farmers: number;
    pendingFarmers: number;
    products: number;
    activeProducts: number;
    orders: number;
    ongoingOrders: number;
    completedOrders: number;
    totalSales: number;
    unpaidSales: number;
}

export type RecentOrders = Array<{
    order_number: string;
    customer_name: string;
    total: number;
    order_status: string;
    created_at: string;
}>;

export type RecentFarmers = Array<{
    id: number;
    display_name: string;
    district: string;
    approval_status: string;
    created_at: string;
}>;

export type RecentProducts = Array<{
    id: number;
    name: string;
    price: number;
    is_active: boolean;
    created_at: string;
}>;

export type RecentUsers = Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}>;

export interface DashboardPageProps {
    stats: AdminStats;
    recentOrders: RecentOrders;
    recentFarmers: RecentFarmers;
    recentProducts: RecentProducts;
    recentUsers: RecentUsers;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface AdminUserRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: StatusOption;
    is_active: boolean;
    created_at: string;
}

export interface AdminUsersIndexPageProps {
    users: Paginator<AdminUserRow>;
    filters: AdminFilters;
    roles: StatusOption[];
}

export interface AdminUserShowPageProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        role: StatusOption;
        is_active: boolean;
        created_at: string;
        orders_count: number;
        total_spent: number;
    };
    farmer: {
        id: number;
        display_name: string;
        approval_status: string;
        district: string;
        products_count: number;
    } | null;
    can: { manage_status: boolean };
}

// ---------------------------------------------------------------------------
// Farmers
// ---------------------------------------------------------------------------

export interface AdminFarmerRow {
    id: number;
    display_name: string;
    district: string;
    approval_status: StatusOption;
    account_active: boolean;
    products_count: number;
    created_at: string;
}

export interface AdminFarmersIndexPageProps {
    farmers: Paginator<AdminFarmerRow>;
    filters: AdminFilters;
    statuses: StatusOption[];
}

export interface AdminFarmerShowPageProps {
    farmer: {
        id: number;
        display_name: string;
        bio: string | null;
        district: string;
        village: string | null;
        address: string | null;
        approval_status: StatusOption;
        created_at: string;
        user: { id: number; name: string; email: string; phone: string | null; is_active: boolean };
    };
    products: Array<{
        id: number;
        name: string;
        category: string | null;
        price: number;
        sale_price: number | null;
        stock_quantity: number;
        is_active: boolean;
    }>;
    can: {
        approve: boolean;
        reject: boolean;
        suspend: boolean;
        toggle_account: boolean;
    };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export interface AdminCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
    is_active: boolean;
    sort_order: number;
    products_count: number;
    has_products: boolean;
    children: AdminCategory[];
}

export interface AdminCategoriesIndexPageProps {
    categories: AdminCategory[];
    totalProducts: number;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface AdminProductRow {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    category: string | null;
    farmer: string | null;
    price: number;
    sale_price: number | null;
    stock_quantity: number;
    is_active: boolean;
    created_at: string;
}

export interface AdminProductsIndexPageProps {
    products: Paginator<AdminProductRow>;
    filters: AdminFilters;
    categories: Array<{ id: number; name: string }>;
}

export interface AdminProductShowPageProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        sale_price: number | null;
        unit: string;
        unit_label: string;
        image: string | null;
        images: string[];
        short_description: string | null;
        description: string | null;
        stock_quantity: number;
        min_order_quantity: number;
        category_slug: string | null;
        is_featured: boolean;
        is_popular: boolean;
        is_seasonal: boolean;
        is_active: boolean;
        farmer: {
            id: number;
            display_name: string;
            status: string;
            owner_user_id: number | null;
            owner_phone: string | null;
        } | null;
        category: { id: number; name: string } | null;
        created_at?: string;
    };
    units: StatusOption[];
    can: { edit: boolean; stock: boolean; moderate: boolean };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface AdminOrderRow {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    items_count: number;
    total: number;
    payment_method: string;
    order_status: StatusOption;
    payment_status: StatusOption;
    created_at: string;
}

export interface AdminOrdersIndexPageProps {
    orders: Paginator<AdminOrderRow>;
    filters: AdminFilters;
    orderStatuses: StatusOption[];
    paymentStatuses: StatusOption[];
}

export interface AdminOrderShowPageProps {
    order: {
        id: number;
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
        coupon_code: string | null;
        discount_amount: number;
        payment_method: string;
        payment_status: string;
        order_status: string;
        created_at: string;
        items: OrderLine[];
    };
    transitions: { order: string[]; payment: string[] };
    orderStatuses: StatusOption[];
    paymentStatuses: StatusOption[];
    can: { update: boolean; payment: boolean };
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export interface AdminCouponRow {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_value: number | null;
    max_uses: number | null;
    used_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export interface AdminCouponsIndexPageProps {
    coupons: Paginator<AdminCouponRow>;
    filters: AdminFilters;
}

export interface AdminCouponFormValues {
    code: string;
    type: 'percentage' | 'fixed';
    value: string;
    min_order_value: string;
    max_uses: string;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
    description: string;
}

export interface AdminCouponEditPageProps {
    coupon: {
        id: number;
        code: string;
        type: 'percentage' | 'fixed';
        value: number;
        min_order_value: string | number;
        max_uses: number | null;
        starts_at: string;
        expires_at: string;
        is_active: boolean;
        description: string | null;
    };
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export interface ReportFilters {
    date_from: string | null;
    date_to: string | null;
    [key: string]: string | number | boolean | null | undefined;
}

export interface ReportMeta {
    title: string;
    count: number;
    generated_at: string;
    settled_sum?: number;
    paid_sum?: number;
    unpaid_sum?: number;
    discount_sum?: number;
}

export interface ReportProps<T = Record<string, unknown>> {
    rows: T[];
    filters: ReportFilters;
    meta: ReportMeta;
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export interface SiteSettingItem {
    key: string;
    label: string;
    value: string | null;
}

export interface SiteSettingsGroup {
    group: string;
    items: SiteSettingItem[];
}

export interface AdminSiteIndexPageProps {
    groups: SiteSettingsGroup[];
    can: { edit: boolean };
}

// ---------------------------------------------------------------------------
// Admin management
// ---------------------------------------------------------------------------

export interface AdminAdminRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    is_super_admin: boolean;
    is_active: boolean;
    created_at: string;
}

export interface AdminAdminsIndexPageProps {
    admins: Paginator<AdminAdminRow>;
    filters: AdminFilters;
}

export interface AdminAdminFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    is_active: boolean;
}

export interface AdminAdminEditPageProps {
    admin: { id: number; name: string; email: string; phone: string | null; is_active: boolean };
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export interface AdminPermissionsPageProps {
    admin: { id: number; name: string; email: string };
    groups: Array<{
        group: string;
        permissions: Array<{ name: string; label: string }>;
    }>;
    granted: string[];
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export interface AdminAuditLogRow {
    id: number;
    actor: { id: number; name: string; email: string } | null;
    action: string;
    target_type: string | null;
    target_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export interface AdminAuditLogIndexPageProps {
    logs: Paginator<AdminAuditLogRow>;
    filters: AdminFilters;
}