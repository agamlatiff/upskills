<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;

use function Laravel\Prompts\search;

class CourseController extends Controller
{

    public function __construct(protected CourseService $courseService)
    {
    }

    public function index()
    {
        $coursesByCategory = $this->courseService->getCoursesGroupedByCategory();
        return view("courses.index", compact("coursesByCategory"));
    }

    public function details(Course $course)
    {
        $course->load(["category", "benefits", "courseSections.sectionContents"]);
        return view("course.detals", compact("course"));
    }

    public function join(Course $course)
    {
        $studentName = $this->courseService->enrollUser($course);
        $firstSectionAndContent = $this->courseService->getFirstSectionAndContent($course);

        return view("course.success_joined", array_merge(
            compact("course", "studentName"),
            $firstSectionAndContent
        ));
    }

    public function learning(Course $course, $contentSectionId, $sectionContentid)
    {
        $learningData = $this->courseService->getLearningData($course, $contentSectionId, $sectionContentid);

        return view("course.learning", $learningData);
    }

    public function learning_finished(Course $course)
    {
        return view("courses.learning_finished", compact("course"));
    }


    public function search_courses(Request $request)
    {
        $request->validate([
            "search" => "required|string"
        ]);

        $keyword = $request->search;
        $course = $this->courseService->searchCourses($keyword);

        return view("courses.search", compact("courses", "keyword"));
    }
}
