<?php

namespace App\Http\Controllers;

use App\Http\Resources\WishlistResource;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist.
     */
    public function index(Request $request)
    {
        $wishlistItems = Wishlist::with('course.category')
            ->forUser(Auth::id())
            ->latest()
            ->get();

        return WishlistResource::collection($wishlistItems);
    }

    /**
     * Add a course to the wishlist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        // Check if already in wishlist
        $existing = Wishlist::where('user_id', Auth::id())
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Course already in wishlist',
                'wishlist' => new WishlistResource($existing->load('course'))
            ], 200);
        }

        $wishlist = Wishlist::create([
            'user_id' => Auth::id(),
            'course_id' => $validated['course_id'],
        ]);

        $wishlist->load('course');

        return new WishlistResource($wishlist);
    }

    /**
     * Remove a course from the wishlist.
     */
    public function destroy(Course $course)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if (!$wishlist) {
            return response()->json(['message' => 'Course not in wishlist'], 404);
        }

        $wishlist->delete();

        return response()->json(['message' => 'Course removed from wishlist']);
    }
}

