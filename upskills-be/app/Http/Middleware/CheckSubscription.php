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

        if (!$user) {
            // Return JSON response for API requests
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'You need to be authenticated to proceed.',
                    'error' => 'authentication_required'
                ], 401);
            }

            // Return redirect for web requests
            return redirect()->route("front.pricing")->with("error", "You need to be authenticated to proceed.");
        }

        // Check if user is a mentor and owns the course
        $course = $request->route('course');
        
        if ($course && $user->hasRole('mentor')) {
            // Check if mentor created/owns this course
            $isMentorOfCourse = $course->courseMentors()
                ->where('user_id', $user->id)
                ->exists();
            
            if ($isMentorOfCourse) {
                // Mentor owns the course, allow access without subscription
                return $next($request);
            }
        }

        // Check if course is free - free courses don't require subscription
        if ($course && $course->is_free) {
            return $next($request);
        }

        // For non-mentor-owned courses or non-mentors, check subscription
        if (!$user->hasActiveSubscription()) {
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
