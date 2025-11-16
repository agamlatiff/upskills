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
     * Requires: User must have completed the course
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'quote' => ['required', 'string', 'min:10', 'max:1000'],
            'outcome' => ['nullable', 'string', 'max:255'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        // Check if user has completed the course
        if (!$user->hasCompletedCourse($validated['course_id'])) {
            return response()->json([
                'message' => 'You must complete the course before leaving a testimonial.'
            ], 403);
        }

        // Check if user already left a testimonial for this course
        $existingTestimonial = Testimonial::where('user_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existingTestimonial) {
            return response()->json([
                'message' => 'You have already left a testimonial for this course. You can update your existing testimonial instead.'
            ], 422);
        }

        $testimonial = Testimonial::create([
            'user_id' => $user->id,
            'course_id' => $validated['course_id'],
            'quote' => $validated['quote'],
            'outcome' => $validated['outcome'] ?? null,
            'is_verified' => false,
        ]);

        $testimonial->load(['user', 'course']);

        return response()->json([
            'message' => 'Testimonial created successfully',
            'testimonial' => new TestimonialResource($testimonial),
        ], 201);
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
            'quote' => ['sometimes', 'string', 'min:10', 'max:1000'],
            'outcome' => ['nullable', 'string', 'max:255'],
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

