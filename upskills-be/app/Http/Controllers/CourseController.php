<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;

use function Laravel\Prompts\search;

class CourseController extends Controller
{

    public function __construct(protected CourseService $courseService)
    {
    }

    public function index(Request $request)
    {
        $coursesByCategory = $this->courseService->getCoursesGroupedByCategory();
        
        $formatted = $coursesByCategory->map(function ($courses, $categoryName) {
            return [
                'category' => $categoryName,
                'courses' => CourseResource::collection($courses)
            ];
        })->values();
        
        return response()->json($formatted);
    }

    public function details(Request $request, Course $course)
    {
        $course->load(["category", "benefits", "courseSections.sectionContents", "courseMentors.mentor"]);
        return new CourseResource($course);
    }

    public function join(Request $request, Course $course)
    {
        $studentName = $this->courseService->enrollUser($course);
        $firstSectionAndContent = $this->courseService->getFirstSectionAndContent($course);

        return response()->json([
            'message' => 'Successfully joined course',
            'course' => new CourseResource($course),
            'student_name' => $studentName,
            'first_section_id' => $firstSectionAndContent['firstSectionId'],
            'first_content_id' => $firstSectionAndContent['firstContentId'],
        ]);
    }

    public function learning(Request $request, Course $course, $contentSectionId, $sectionContentid)
    {
        $learningData = $this->courseService->getLearningData($course, $contentSectionId, $sectionContentid);

        return response()->json([
            'course' => new CourseResource($learningData['course']),
            'current_section' => $learningData['currentSection'] ? [
                'id' => $learningData['currentSection']->id,
                'name' => $learningData['currentSection']->name,
                'position' => $learningData['currentSection']->position,
            ] : null,
            'current_content' => $learningData['currentContent'] ? [
                'id' => $learningData['currentContent']->id,
                'name' => $learningData['currentContent']->name,
                'content' => $learningData['currentContent']->content,
            ] : null,
            'next_content' => $learningData['nextContent'] ? [
                'id' => $learningData['nextContent']->id,
                'name' => $learningData['nextContent']->name,
            ] : null,
            'is_finished' => $learningData['isFinished'] ?? false,
        ]);
    }

    public function learning_finished(Request $request, Course $course)
    {
        return response()->json([
            'message' => 'Course completed successfully',
            'course' => new CourseResource($course),
        ]);
    }


    public function search_courses(Request $request)
    {
        $request->validate([
            "search" => "required|string"
        ]);

        $keyword = $request->search;
        $courses = $this->courseService->searchCourses($keyword);

        return response()->json([
            'keyword' => $keyword,
            'courses' => CourseResource::collection($courses),
        ]);
    }
}
