<?php

namespace App\Http\Controllers;

use App\Models\MentorMessage;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MentorMessageController extends Controller
{
    /**
     * Store a newly created message to mentor.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:10', 'max:2000'],
            'course_id' => ['required', 'exists:courses,id'],
            'mentor_id' => ['required', 'exists:users,id'],
        ]);

        // Verify that the mentor is actually a mentor for this course
        $course = Course::with('courseMentors')->findOrFail($validated['course_id']);
        $isMentorForCourse = $course->courseMentors->contains(function ($cm) use ($validated) {
            return $cm->user_id == $validated['mentor_id'] && $cm->is_active;
        });

        if (!$isMentorForCourse) {
            return response()->json([
                'message' => 'The selected mentor is not associated with this course.'
            ], 422);
        }

        // Verify that the mentor_id is actually a mentor role
        $mentor = \App\Models\User::findOrFail($validated['mentor_id']);
        if (!$mentor->hasRole('mentor')) {
            return response()->json([
                'message' => 'The selected user is not a mentor.'
            ], 422);
        }

        try {
            $mentorMessage = MentorMessage::create([
                'user_id' => $user->id,
                'mentor_id' => $validated['mentor_id'],
                'course_id' => $validated['course_id'],
                'message' => $validated['message'],
                'is_read' => false,
            ]);

            $mentorMessage->load(['user', 'mentor', 'course']);

            Log::info('Mentor message created', [
                'message_id' => $mentorMessage->id,
                'user_id' => $user->id,
                'mentor_id' => $validated['mentor_id'],
                'course_id' => $validated['course_id'],
            ]);

            return response()->json([
                'message' => 'Your message has been sent to the mentor successfully.',
                'data' => [
                    'id' => $mentorMessage->id,
                    'message' => $mentorMessage->message,
                    'is_read' => $mentorMessage->is_read,
                    'created_at' => $mentorMessage->created_at,
                    'mentor' => [
                        'id' => $mentorMessage->mentor->id,
                        'name' => $mentorMessage->mentor->name,
                    ],
                    'course' => [
                        'id' => $mentorMessage->course->id,
                        'name' => $mentorMessage->course->name,
                        'slug' => $mentorMessage->course->slug,
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create mentor message', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'mentor_id' => $validated['mentor_id'],
                'course_id' => $validated['course_id'],
            ]);

            return response()->json([
                'message' => 'Failed to send message. Please try again.'
            ], 500);
        }
    }
}
