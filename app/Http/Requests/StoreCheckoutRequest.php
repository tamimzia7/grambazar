<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\-\(\) ]+$/'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'delivery_address' => ['required', 'string', 'max:255'],
            'delivery_area' => ['nullable', 'string', 'max:100'],
            'delivery_district' => ['required', 'string', 'max:100'],
            'delivery_instructions' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'customer_name' => 'নাম',
            'customer_phone' => 'মোবাইল নম্বর',
            'customer_email' => 'ইমেইল',
            'delivery_address' => 'ঠিকানা',
            'delivery_area' => 'এলাকা',
            'delivery_district' => 'জেলা',
            'delivery_instructions' => 'বিশেষ নির্দেশনা',
        ];
    }
}
