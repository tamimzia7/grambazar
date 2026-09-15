<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Require one or more permission keys. Super admins always pass.
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        foreach ($permissions as $permission) {
            if ($user === null || ! $user->hasPermission($permission)) {
                abort(403, 'এই কার্যক্রম চালানোর অনুমতি নেই।');
            }
        }

        return $next($request);
    }
}
