<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Shop defaults
    |--------------------------------------------------------------------------
    |
    | Centralised place for storefront behaviour so delivery charges etc.
    | can later be made configurable (e.g. via a database driven settings
    | table) without touching controllers.
    |
    */

    'currency' => env('SHOP_CURRENCY', 'BDT'),

    // Flat delivery charge in BDT. Charged unless the subtotal qualifies for free delivery.
    'delivery_charge' => (float) env('SHOP_DELIVERY_CHARGE', 60),

    // Orders with a subtotal at or above this amount get free delivery (0 disables).
    'free_delivery_above' => (float) env('SHOP_FREE_DELIVERY_ABOVE', 1000),

    // Number of products shown per shop page.
    'products_per_page' => (int) env('SHOP_PRODUCTS_PER_PAGE', 12),
];
