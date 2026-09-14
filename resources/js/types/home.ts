export interface HomeCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string;
}

export interface HomeProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    unit: string;
    unit_label: string;
    short_description: string | null;
    description: string | null;
    stock_quantity: number;
    min_order_quantity: number;
    category_slug: string | null;
    image: string | null;
    is_featured: boolean;
    is_popular: boolean;
    is_seasonal: boolean;
}

export interface HomeStats {
    farmers: number;
    products: number;
    categories: number;
}

export interface HomeProps {
    categories: HomeCategory[];
    popularProducts: HomeProduct[];
    seasonalProducts: HomeProduct[];
    spiceProducts: HomeProduct[];
    featuredProduct: HomeProduct | null;
    stats: HomeStats;
}

export const BENGALI_DIGITS = [
    '০',
    '১',
    '২',
    '৩',
    '৪',
    '৫',
    '৬',
    '৭',
    '৮',
    '৯',
] as const;

export function toBnNumber(value: number | string): string {
    return String(value).replace(
        /[0-9]/g,
        (digit) => BENGALI_DIGITS[Number(digit)],
    );
}

export function formatTaka(value: number): string {
    return `৳${toBnNumber(value)}`;
}

export function formatUnit(value: string, label: string): string {
    return `${formatTaka(Number(value))}/${label}`;
}
