<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionContentResource extends JsonResource
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
            'name' => $this->name,
            'content' => $this->content,
            'course_section_id' => $this->course_section_id,
            'course_section' => $this->whenLoaded('courseSection', function () {
                return [
                    'id' => $this->courseSection->id,
                    'name' => $this->courseSection->name,
                    'position' => $this->courseSection->position,
                    'course_id' => $this->courseSection->course_id,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
