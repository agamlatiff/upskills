<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseCompletion extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who completed the course.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course that was completed.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
