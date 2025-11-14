<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "booking_trx_id",
        "user_id",
        "pricing_id",
        "grand_total_amount",
        "sub_total_amount",
        "total_tax_amount",
        "is_paid",
        "payment_type",
        "proof",
        "started_at",
        "ended_at"
    ];

    protected $casts = [
        "started_at" => "date",
        "ended_at" => "date"
    ];

    public function pricing(): BelongsTo
    {
        return $this->belongsTo(Pricing::class, "pricing_id");
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function isActive(): bool
    {
        return $this->is_paid && $this->ended_at->isFuture(); 
    }
}
