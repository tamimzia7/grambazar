<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Response;

class PasswordController extends Controller
{
    public function edit(Request $request): Response
    {
        return inertia('account/password', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }
}
