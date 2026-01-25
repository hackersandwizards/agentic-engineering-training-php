<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Show admin user management page.
     */
    public function index(Request $request): Response
    {
        $perPage = 5;

        $users = User::orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Hide password from all users
        $users->getCollection()->transform(function ($user) {
            return $user->makeHidden('password');
        });

        return Inertia::render('Admin/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|max:40',
            'full_name' => 'nullable|string|max:255',
            'is_superuser' => 'boolean',
        ]);

        User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'full_name' => $validated['full_name'] ?? null,
            'is_superuser' => $validated['is_superuser'] ?? false,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Update a user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|max:40',
            'full_name' => 'nullable|string|max:255',
            'is_superuser' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Remove password if not provided
        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Delete a user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'Super users cannot delete themselves');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}
