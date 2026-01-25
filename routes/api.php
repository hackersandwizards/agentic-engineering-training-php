<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health check (public)
    Route::get('/health-check', fn () => response()->json(['status' => 'ok']));

    // Public auth routes
    Route::post('/login/access-token', [AuthController::class, 'login']);
    Route::post('/users/signup', [UserController::class, 'signup']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/login/test-token', [AuthController::class, 'testToken']);

        // Current user routes
        Route::get('/users/me', [UserController::class, 'me']);
        Route::patch('/users/me', [UserController::class, 'updateMe']);
        Route::patch('/users/me/password', [UserController::class, 'updatePassword']);
        Route::delete('/users/me', [UserController::class, 'deleteMe']);

        // Contacts
        Route::apiResource('contacts', ContactController::class);

        // Admin only routes (superuser)
        Route::middleware('superuser')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::get('/users/{user}', [UserController::class, 'show']);
            Route::patch('/users/{user}', [UserController::class, 'update']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);
        });
    });
});
