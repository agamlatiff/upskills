<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'booking_trx_id' => $this->booking_trx_id,
            'user_id' => $this->user_id,
            'pricing_id' => $this->pricing_id,
            'grand_total_amount' => $this->grand_total_amount,
            'sub_total_amount' => $this->sub_total_amount,
            'total_tax_amount' => $this->total_tax_amount,
            'is_paid' => $this->is_paid,
            'payment_type' => $this->payment_type,
            'proof' => $this->proof,
            'started_at' => $this->started_at,
            'ended_at' => $this->ended_at,
            'is_active' => $this->isActive(),
            'pricing' => $this->whenLoaded('pricing', function () {
                return [
                    'id' => $this->pricing->id,
                    'name' => $this->pricing->name,
                    'duration' => $this->pricing->duration,
                    'price' => $this->pricing->price,
                ];
            }),
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'email' => $this->student->email,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
