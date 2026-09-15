<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Restrict a route to administrator (admin/super admin) users.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->isAdministrator()) {
            abort(403, 'এই এলাকায় প্রবেশের অনুমতি নেই।');
        }

        return $next($request);
    }
}
