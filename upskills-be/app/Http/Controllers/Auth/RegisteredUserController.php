<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            "occupation" => ["required", "string", "max:255"],
            "photo" => ["required", "image", "mimes:png,jpg,jpeg"]
        ]);

        if ($request->hasFile("photo")) {
            $photoPath = $request->file("photo")->store("photos", "public");
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            "occupation" => $request->occupation,
            "photo" => $photoPath
        ]);

        $user->assignRole("student");

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken('auth-token')->plainTextToken;
        
        return response()->json([
            'message' => 'Registration successful',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }
}
