<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login and get access token.
     * Accepts both JSON and form-encoded (OAuth2 spec compliant).
     */
    public function login(Request $request): JsonResponse
    {
        // Support both 'username' (OAuth2 spec) and 'email'
        $email = $request->input('username') ?? $request->input('email');
        $password = $request->input('password');

        if (!$email || !$password) {
            return response()->json([
                'detail' => 'Email and password are required'
            ], 400);
        }

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'detail' => 'Incorrect email or password'
            ], 400);
        }

        if (!$user->is_active) {
            return response()->json([
                'detail' => 'User account is inactive'
            ], 400);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user->makeHidden('password'),
        ]);
    }

    /**
     * Test if token is valid.
     */
    public function testToken(Request $request): JsonResponse
    {
        return response()->json($request->user()->makeHidden('password'));
    }
}
