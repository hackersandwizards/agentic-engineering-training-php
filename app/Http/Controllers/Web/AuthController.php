<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show login page.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login request.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if (!$user->is_active) {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Your account is inactive.',
                ]);
            }

            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Incorrect email or password',
        ]);
    }

    /**
     * Show signup page.
     */
    public function showSignup(): Response
    {
        return Inertia::render('Auth/Signup');
    }

    /**
     * Handle signup request.
     */
    public function signup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|max:40|confirmed',
            'full_name' => 'nullable|string|max:255',
        ]);

        User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'full_name' => $validated['full_name'] ?? null,
            'is_active' => true,
            'is_superuser' => false,
        ]);

        return redirect('/login')->with('success', 'Account created successfully. Please log in.');
    }

    /**
     * Handle logout request.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
