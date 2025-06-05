<?php

namespace App\Policies;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ActivityLogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->role === 'admin') return true;
        
        return false;
    }
}
