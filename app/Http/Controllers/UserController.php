<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        // Ambil semua user
        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }
}
