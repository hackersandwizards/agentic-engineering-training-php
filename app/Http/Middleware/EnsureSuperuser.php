<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperuser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->is_superuser) {
            if ($request->expectsJson()) {
                return response()->json([
                    'detail' => "The user doesn't have enough privileges"
                ], 403);
            }

            abort(403, "The user doesn't have enough privileges");
        }

        return $next($request);
    }
}
