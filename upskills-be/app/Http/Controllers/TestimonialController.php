<?php

namespace App\Http\Controllers;

use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index(Request $request)
    {
        $query = Testimonial::with(['user', 'course']);

        // Filter by verified status
        if ($request->has('verified') && $request->boolean('verified')) {
            $query->where('is_verified', true);
        }

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Limit results
        $limit = $request->integer('limit', 50);
        $testimonials = $query->latest()->limit($limit)->get();

        return TestimonialResource::collection($testimonials);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => ['required', 'string', 'max:1000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'outcome' => ['nullable', 'string', 'max:255'],
            'course_id' => ['nullable', 'exists:courses,id'],
        ]);

        $testimonial = Testimonial::create([
            'user_id' => Auth::id(),
            'course_id' => $validated['course_id'] ?? null,
            'quote' => $validated['quote'],
            'rating' => $validated['rating'] ?? null,
            'outcome' => $validated['outcome'] ?? null,
            'is_verified' => false,
        ]);

        $testimonial->load(['user', 'course']);

        return new TestimonialResource($testimonial);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        // Check if user owns the testimonial or is admin
        if ($testimonial->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'quote' => ['sometimes', 'string', 'max:1000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'outcome' => ['nullable', 'string', 'max:255'],
            'course_id' => ['nullable', 'exists:courses,id'],
        ]);

        $testimonial->update($validated);
        $testimonial->load(['user', 'course']);

        return new TestimonialResource($testimonial);
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        // Check if user owns the testimonial or is admin
        if ($testimonial->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
}

