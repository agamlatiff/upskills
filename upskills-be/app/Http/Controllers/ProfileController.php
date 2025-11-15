<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo && \Storage::disk('public')->exists($user->photo)) {
                \Storage::disk('public')->delete($user->photo);
            }
            $photoPath = $request->file('photo')->store('photos', 'public');
            $user->photo = $photoPath;
        }
        
        // Update only provided fields
        $validated = $request->validated();
        
        if (isset($validated['name']) && $validated['name'] !== null) {
            $user->name = $validated['name'];
        }
        
        if (isset($validated['email']) && $validated['email'] !== null) {
            if ($user->email !== $validated['email']) {
                $user->email_verified_at = null;
            }
            $user->email = $validated['email'];
        }
        
        if (isset($validated['occupation']) && $validated['occupation'] !== null) {
            $user->occupation = $validated['occupation'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user->fresh())
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}
