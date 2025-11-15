<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'thumbnail' => $this->thumbnail ? Storage::disk('public')->url($this->thumbnail) : null,
            'about' => $this->about,
            'is_populer' => $this->is_populer,
            'content_count' => $this->content_count,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                ];
            }),
            'benefits' => $this->whenLoaded('benefits'),
            'course_sections' => $this->whenLoaded('courseSections', function () {
                return $this->courseSections->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'name' => $section->name,
                        'position' => $section->position,
                        'section_contents' => $section->sectionContents->map(function ($content) {
                            return [
                                'id' => $content->id,
                                'name' => $content->name,
                                'content' => $content->content,
                            ];
                        }),
                    ];
                });
            }),
            'course_mentors' => $this->whenLoaded('courseMentors', function () {
                return $this->courseMentors->map(function ($courseMentor) {
                    return [
                        'id' => $courseMentor->id,
                        'mentor' => $courseMentor->mentor ? [
                            'id' => $courseMentor->mentor->id,
                            'name' => $courseMentor->mentor->name,
                        ] : null,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
