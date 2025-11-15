<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Calculate average rating from testimonials (with error handling)
        $averageRating = null;
        $ratingCount = 0;

        try {
            if (DB::getSchemaBuilder()->hasTable('testimonials')) {
                $averageRating = DB::table('testimonials')
                    ->where('course_id', $this->id)
                    ->whereNotNull('rating')
                    ->avg('rating');

                $ratingCount = DB::table('testimonials')
                    ->where('course_id', $this->id)
                    ->whereNotNull('rating')
                    ->count();
            }
        } catch (\Exception $e) {
            // Silently fail - ratings are optional
            // Log error in development/debugging but don't expose to users
            if (config('app.debug')) {
                \Log::debug('Error calculating course rating: ' . $e->getMessage());
            }
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'thumbnail' => $this->thumbnail ? Storage::disk('public')->url($this->thumbnail) : null,
            'about' => $this->about,
            'is_populer' => $this->is_populer,
            'difficulty' => $this->difficulty ?? 'beginner',
            'is_free' => $this->is_free ?? false,
            'content_count' => $this->content_count,
            'rating' => $averageRating ? round($averageRating, 1) : null,
            'rating_count' => $ratingCount,
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
                            'photo' => $courseMentor->mentor->photo ? Storage::disk('public')->url($courseMentor->mentor->photo) : null,
                            'occupation' => $courseMentor->mentor->occupation,
                        ] : null,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
