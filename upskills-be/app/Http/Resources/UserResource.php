<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'photo' => $this->photo ? Storage::disk('public')->url($this->photo) : null,
            'occupation' => $this->occupation,
            'email_verified_at' => $this->email_verified_at,
            'has_active_subscription' => $this->when($request->user(), function () {
                return $this->hasActiveSubscription();
            }),
            'roles' => $this->when($request->user() && $request->user()->id === $this->id, function () {
                // Always include roles for authenticated user requesting their own data
                // Load roles relationship if not already loaded
                if (!$this->relationLoaded('roles')) {
                    $this->load('roles');
                }
                // getRoleNames() returns a Collection, convert to array
                return $this->getRoleNames()->toArray();
            }, []),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
