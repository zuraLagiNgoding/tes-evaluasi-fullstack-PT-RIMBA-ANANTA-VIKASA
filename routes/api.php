<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::patch('tasks/{task}/assign', [TaskController::class, 'assignTask']);
    Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus']);

    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post('/login', [AuthController::class, 'login']);
