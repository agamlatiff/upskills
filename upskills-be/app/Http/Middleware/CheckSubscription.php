<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || !$user->hasActiveSubscription()) {
            // Return JSON response for API requests
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'You need an active subscription to proceed.',
                    'error' => 'subscription_required'
                ], 403);
            }

            // Return redirect for web requests
            return redirect()->route("front.pricing")->with("error", "You need an active subscription to proceed.");
        }

        return $next($request);
    }
}
