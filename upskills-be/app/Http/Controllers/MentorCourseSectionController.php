<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\SectionContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MentorCourseSectionController extends Controller
{
    /**
     * Get all sections for a course (only if mentor owns the course)
     */
    public function index(Course $course)
    {
        $mentor = Auth::user();

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only view sections of your own courses'], 403);
        }

        $sections = $course->courseSections()
            ->with('sectionContents')
            ->orderBy('position')
            ->get();

        return response()->json($sections);
    }

    /**
     * Create a new section for a course
     */
    public function store(Request $request, Course $course)
    {
        $mentor = Auth::user();

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only create sections for your own courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:1'],
        ]);

        // If position not provided, set it to the next available position
        if (!isset($validated['position'])) {
            $maxPosition = $course->courseSections()->max('position') ?? 0;
            $validated['position'] = $maxPosition + 1;
        }

        $section = CourseSection::create([
            'course_id' => $course->id,
            'name' => $validated['name'],
            'position' => $validated['position'],
        ]);

        $section->load('sectionContents');

        return response()->json([
            'message' => 'Section created successfully',
            'section' => $section,
        ], 201);
    }

    /**
     * Update a section
     */
    public function update(Request $request, Course $course, CourseSection $section)
    {
        $mentor = Auth::user();

        // Verify section belongs to course
        if ($section->course_id !== $course->id) {
            return response()->json(['message' => 'Section does not belong to this course'], 404);
        }

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only update sections of your own courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:1'],
        ]);

        $section->update($validated);
        $section->load('sectionContents');

        return response()->json([
            'message' => 'Section updated successfully',
            'section' => $section,
        ]);
    }

    /**
     * Delete a section
     */
    public function destroy(Course $course, CourseSection $section)
    {
        $mentor = Auth::user();

        // Verify section belongs to course
        if ($section->course_id !== $course->id) {
            return response()->json(['message' => 'Section does not belong to this course'], 404);
        }

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only delete sections of your own courses'], 403);
        }

        $section->delete();

        return response()->json(['message' => 'Section deleted successfully']);
    }
}


