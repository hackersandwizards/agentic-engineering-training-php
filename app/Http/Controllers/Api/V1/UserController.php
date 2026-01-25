<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * List all users (superuser only).
     */
    public function index(Request $request): JsonResponse
    {
        $skip = (int) $request->query('skip', 0);
        $limit = min((int) $request->query('limit', 100), 100);

        $users = User::orderBy('created_at', 'desc')
            ->skip($skip)
            ->take($limit)
            ->get()
            ->makeHidden('password');

        return response()->json([
            'data' => $users,
            'count' => User::count(),
        ]);
    }

    /**
     * Create a new user (superuser only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->max(40)],
            'full_name' => 'nullable|string|max:255',
            'is_superuser' => 'boolean',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'full_name' => $validated['full_name'] ?? null,
            'is_superuser' => $validated['is_superuser'] ?? false,
            'is_active' => true,
        ]);

        return response()->json($user->makeHidden('password'), 201);
    }

    /**
     * Get a user by ID (superuser only).
     */
    public function show(Request $request, User $user): JsonResponse
    {
        // Allow users to view their own profile
        if ($request->user()->id !== $user->id && !$request->user()->is_superuser) {
            return response()->json(['detail' => 'Not enough permissions'], 403);
        }

        return response()->json($user->makeHidden('password'));
    }

    /**
     * Update a user by ID (superuser only).
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => ['sometimes', Password::min(8)->max(40)],
            'full_name' => 'nullable|string|max:255',
            'is_superuser' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $user->update($validated);

        return response()->json($user->fresh()->makeHidden('password'));
    }

    /**
     * Delete a user by ID (superuser only).
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'detail' => 'Super users are not allowed to delete themselves'
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get current authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->makeHidden('password'));
    }

    /**
     * Update current authenticated user.
     */
    public function updateMe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'full_name' => 'nullable|string|max:255',
        ]);

        $request->user()->update($validated);

        return response()->json($request->user()->fresh()->makeHidden('password'));
    }

    /**
     * Update password for current authenticated user.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', Password::min(8)->max(40), 'different:current_password'],
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return response()->json(['detail' => 'Incorrect password'], 400);
        }

        $request->user()->update(['password' => $validated['new_password']]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    /**
     * Delete current authenticated user.
     */
    public function deleteMe(Request $request): JsonResponse
    {
        if ($request->user()->is_superuser) {
            return response()->json([
                'detail' => 'Super users are not allowed to delete themselves'
            ], 403);
        }

        $request->user()->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Public user registration.
     */
    public function signup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->max(40)],
            'full_name' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'full_name' => $validated['full_name'] ?? null,
            'is_active' => true,
            'is_superuser' => false,
        ]);

        return response()->json($user->makeHidden('password'), 201);
    }
}
