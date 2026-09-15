<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $routeUser = $this->route('admin_user');
        $user = $routeUser instanceof User ? $routeUser : null;

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email:strict', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\(\) ]+$/', Rule::unique('users', 'phone')->ignore($user?->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'নাম',
            'email' => 'ইমেইল',
            'phone' => 'মোবাইল নম্বর',
            'password' => 'পাসওয়ার্ড',
        ];
    }
}
