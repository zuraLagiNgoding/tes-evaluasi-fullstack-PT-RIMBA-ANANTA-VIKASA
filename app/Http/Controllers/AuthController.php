<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        Gate::authorize('create', User::class);

        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'status' => true,
        ]);

        $user = Auth::user();

        $email = $validated['email'];

        ActivityLog::create([
            'description' => "User with email $email created by user " . $user->email,
            'user_id' => $user->id,
            'action' => "Registered new User"
        ]);

        return response()->json([
            'message' => 'User register success'
        ]);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->firstOrFail();

        if (! $user || $user->status === 0) {
            return response()->json([
                'message' => 'Account inactive'
            ], 403);
        }

        if (! Auth::attempt($validated) || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        ActivityLog::create([
            'description' => "User with email $user->email logged in",
            'user_id' => $user->id,
            'action' => "User logged in"
        ]);

        return response()->json([
            'message' => 'Login success',
            'role' => $user->role,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        $user = Auth::user();

        ActivityLog::create([
            'description' => "User with email $user->email logged out",
            'user_id' => $user->id,
            'action' => "User logged out"
        ]);

        return response()->json([
            'message' => 'Logout success'
        ]);
    }
}
