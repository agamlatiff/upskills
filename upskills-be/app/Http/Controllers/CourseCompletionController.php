<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCompletion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CourseCompletionController extends Controller
{
    /**
     * Mark a course as completed for the authenticated user
     */
    public function store(Request $request, Course $course)
    {
        $user = Auth::user();

        // Check if already completed
        $existingCompletion = CourseCompletion::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existingCompletion) {
            return response()->json([
                'message' => 'Course already marked as completed',
                'completion' => $existingCompletion,
            ], 200);
        }

        // Create completion record
        $completion = CourseCompletion::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Course marked as completed',
            'completion' => $completion,
        ], 201);
    }

    /**
     * Check if user has completed a course
     */
    public function check(Course $course)
    {
        $user = Auth::user();
        
        $completed = CourseCompletion::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        return response()->json([
            'completed' => $completed,
        ]);
    }

    /**
     * Get user's completed courses
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $completions = CourseCompletion::where('user_id', $user->id)
            ->with('course.category')
            ->latest('completed_at')
            ->get();

        return response()->json($completions);
    }

    /**
     * Delete a course completion for the authenticated user
     */
    public function destroy(Course $course)
    {
        $user = Auth::user();

        $completion = CourseCompletion::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$completion) {
            return response()->json([
                'message' => 'Course completion not found',
            ], 404);
        }

        $completion->delete();

        return response()->json([
            'message' => 'Course completion removed successfully',
        ], 200);
    }
}

