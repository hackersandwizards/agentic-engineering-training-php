<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show settings page.
     */
    public function index(): Response
    {
        return Inertia::render('Settings');
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'full_name' => 'nullable|string|max:255',
        ]);

        $request->user()->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|max:40|different:current_password',
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return redirect()->back()->withErrors([
                'current_password' => 'Current password is incorrect'
            ]);
        }

        $request->user()->update(['password' => $validated['new_password']]);

        return redirect()->back()->with('success', 'Password changed successfully');
    }

    /**
     * Delete user account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user()->is_superuser) {
            return redirect()->back()->with('error', 'Super users cannot delete their own account');
        }

        $request->user()->delete();
        Auth::logout();
        $request->session()->invalidate();

        return redirect('/login');
    }
}
