import { BENGALI_DIGITS, type HomeProduct } from '@/types/home';

export function toBnNumber(value: number | string): string {
    return String(value).replace(
        /[0-9]/g,
        (digit) => BENGALI_DIGITS[Number(digit)],
    );
}

export function formatTaka(value: number): string {
    return `৳${toBnNumber(value.toLocaleString('en-US'))}`;
}

export function priceLabel(product: HomeProduct): string {
    if (product.sale_price !== null && product.sale_price < product.price) {
        return formatTaka(product.sale_price);
    }

    return formatTaka(product.price);
}

export function productImage(product: HomeProduct): string {
    if (product.image) {
        return product.image;
    }

    const base = '/images/home';

    if (product.category_slug) {
        return `${base}/cat-${product.category_slug}.svg`;
    }

    return `${base}/product-fallback.svg`;
}

export function unitLabel(product: HomeProduct): string {
    return `/${product.unit_label}`;
}
