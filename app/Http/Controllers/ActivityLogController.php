<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Http\Requests\StoreActivityLogRequest;
use App\Http\Requests\UpdateActivityLogRequest;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        $data = ActivityLog::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
