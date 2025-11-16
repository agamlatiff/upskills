<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\SectionContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MentorSectionContentController extends Controller
{
    /**
     * Get all contents for a section (only if mentor owns the course)
     */
    public function index(Course $course, CourseSection $section)
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
            return response()->json(['message' => 'You can only view contents of your own courses'], 403);
        }

        $contents = $section->sectionContents()->orderBy('id')->get();

        return response()->json($contents);
    }

    /**
     * Create a new content for a section
     */
    public function store(Request $request, Course $course, CourseSection $section)
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
            return response()->json(['message' => 'You can only create contents for your own courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $content = SectionContent::create([
            'course_section_id' => $section->id,
            'name' => $validated['name'],
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Content created successfully',
            'content' => $content,
        ], 201);
    }

    /**
     * Update a content
     */
    public function update(Request $request, Course $course, CourseSection $section, SectionContent $content)
    {
        $mentor = Auth::user();

        // Verify section belongs to course
        if ($section->course_id !== $course->id) {
            return response()->json(['message' => 'Section does not belong to this course'], 404);
        }

        // Verify content belongs to section
        if ($content->course_section_id !== $section->id) {
            return response()->json(['message' => 'Content does not belong to this section'], 404);
        }

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only update contents of your own courses'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
        ]);

        $content->update($validated);

        return response()->json([
            'message' => 'Content updated successfully',
            'content' => $content,
        ]);
    }

    /**
     * Delete a content
     */
    public function destroy(Course $course, CourseSection $section, SectionContent $content)
    {
        $mentor = Auth::user();

        // Verify section belongs to course
        if ($section->course_id !== $course->id) {
            return response()->json(['message' => 'Section does not belong to this course'], 404);
        }

        // Verify content belongs to section
        if ($content->course_section_id !== $section->id) {
            return response()->json(['message' => 'Content does not belong to this section'], 404);
        }

        // Check if mentor owns this course
        $isMentorOfCourse = $course->courseMentors()
            ->where('user_id', $mentor->id)
            ->exists();

        if (!$isMentorOfCourse && !$mentor->hasRole('admin')) {
            return response()->json(['message' => 'You can only delete contents of your own courses'], 403);
        }

        $content->delete();

        return response()->json(['message' => 'Content deleted successfully']);
    }
}


