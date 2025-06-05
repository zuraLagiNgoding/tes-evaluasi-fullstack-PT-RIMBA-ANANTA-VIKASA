<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        if ($user->role === 'admin') return true;

        if ($user->role === 'manager') {
            return $task->created_by === $user->id || $task->assigned_to === $user->id;
        }

        return $task->assigned_to === $user->id;
    }

    public function assign(User $user, Task $task): bool
    {
        if ($user->role === 'admin') return true;

        if ($user->role === 'manager') {
            if ($task && $task->assignedTo) {
                return $task->assignedTo->role === 'staff';
            }
            return true;
        }

        return false;
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->role === 'admin' || $user->id === $task->created_by;
    }
}
