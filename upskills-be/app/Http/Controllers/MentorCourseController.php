<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseBenefit;
use App\Models\CourseMentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MentorCourseController extends Controller
{
    /**
     * Get courses created by the authenticated mentor
     */
    public function index(Request $request)
    {
        $mentor = Auth::user();
        
        // Get courses where the mentor is assigned as a course mentor
        $courses = Course::whereHas('courseMentors', function ($query) use ($mentor) {
            $query->where('user_id', $mentor->id);
        })
        ->with(['category', 'benefits', 'courseMentors.mentor'])
        ->latest()
        ->get();

        return CourseResource::collection($courses);
    }

    /**
     * Store a newly created course by mentor
     */
    public function store(Request $request)
    {
        $mentor = Auth::user();

        // Check if user has mentor role
        if (!$mentor->hasRole('mentor')) {
            return response()->json(['message' => 'Only mentors can create courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'thumbnail' => ['required', 'image', 'max:2048'], // 2MB max
            'about' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'difficulty' => ['required', 'in:beginner,intermediate,advanced'],
            'is_free' => ['required', 'boolean'],
            'is_populer' => ['sometimes', 'boolean'],
            'benefits' => ['sometimes', 'array'],
            'benefits.*' => ['string', 'max:255'],
        ]);

        DB::beginTransaction();
        try {
            // Create course
            $course = Course::create([
                'name' => $validated['name'],
                'thumbnail' => $request->file('thumbnail')->store('courses', 'public'),
                'about' => $validated['about'],
                'category_id' => $validated['category_id'],
                'difficulty' => $validated['difficulty'],
                'is_free' => $validated['is_free'],
                'is_populer' => $validated['is_populer'] ?? false,
            ]);

            // Create course benefits
            if (isset($validated['benefits']) && is_array($validated['benefits'])) {
                foreach ($validated['benefits'] as $benefitName) {
                    CourseBenefit::create([
                        'course_id' => $course->id,
                        'name' => $benefitName,
                    ]);
                }
            }

            // Assign mentor to course
            CourseMentor::create([
                'course_id' => $course->id,
                'user_id' => $mentor->id,
                'about' => 'Course creator',
                'is_active' => true,
            ]);

            DB::commit();

            $course->load(['category', 'benefits', 'courseMentors.mentor']);

            return response()->json([
                'message' => 'Course created successfully',
                'course' => new CourseResource($course),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Delete uploaded thumbnail if course creation failed
            if (isset($course) && isset($course->thumbnail)) {
                Storage::disk('public')->delete($course->thumbnail);
            }

            return response()->json([
                'message' => 'Failed to create course',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a course created by the mentor
     */
    public function update(Request $request, Course $course)
    {
        $mentor = Auth::user();

        // Check if user is a mentor and assigned to this course
        if (!$mentor->hasRole('mentor')) {
            return response()->json(['message' => 'Only mentors can update courses'], 403);
        }

        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only update your own courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'thumbnail' => ['sometimes', 'image', 'max:2048'],
            'about' => ['sometimes', 'string'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'difficulty' => ['sometimes', 'in:beginner,intermediate,advanced'],
            'is_free' => ['sometimes', 'boolean'],
            'is_populer' => ['sometimes', 'boolean'],
            'benefits' => ['sometimes', 'array'],
            'benefits.*' => ['string', 'max:255'],
        ]);

        DB::beginTransaction();
        try {
            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail
                if ($course->thumbnail) {
                    Storage::disk('public')->delete($course->thumbnail);
                }
                $validated['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
            }

            // Update course
            $course->update(array_filter($validated, function ($key) {
                return !in_array($key, ['benefits']);
            }, ARRAY_FILTER_USE_KEY));

            // Update benefits if provided
            if (isset($validated['benefits'])) {
                // Delete existing benefits
                $course->benefits()->delete();
                
                // Create new benefits
                foreach ($validated['benefits'] as $benefitName) {
                    CourseBenefit::create([
                        'course_id' => $course->id,
                        'name' => $benefitName,
                    ]);
                }
            }

            DB::commit();

            $course->load(['category', 'benefits', 'courseMentors.mentor']);

            return response()->json([
                'message' => 'Course updated successfully',
                'course' => new CourseResource($course),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update course',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a course created by the mentor
     */
    public function destroy(Course $course)
    {
        $mentor = Auth::user();

        // Check if user is a mentor and assigned to this course
        if (!$mentor->hasRole('mentor')) {
            return response()->json(['message' => 'Only mentors can delete courses'], 403);
        }

        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only delete your own courses'], 403);
        }

        // Delete thumbnail
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}

