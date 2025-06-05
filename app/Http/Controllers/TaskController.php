<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = Task::with(['assignedTo'])->get();

        $filteredTasks = $tasks->filter(function ($task) use ($request) {
            return $request->user()->can('view', $task);
        });

        return response()->json([
            'success' => true,
            'data' => $filteredTasks->values()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $assignedUser = User::find($request->assigned_to);

        $tempTask = new Task();
        $tempTask->assignedTo = $assignedUser;

        Gate::authorize('assign', $tempTask);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'assigned_to' => $request->assigned_to,
            'created_by' => Auth::id(),
            'status' => $request->status || 'pending',
            'due_date' => $request->due_date,
        ]);

        $user = Auth::user();

        ActivityLog::create([
            'description' => "Task {$task->id} created and assigned to user {$assignedUser->email} by user " . $user->email,
            'user_id' => $user->id,
            'action' => "Create new task"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task->load(['assignedTo'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json([
            'success' => true,
            'data' => $task->load(['assignedTo'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->load(['assignedTo'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        Gate::authorize("delete", $task);

        $user = Auth::user();

        $task->delete();

        ActivityLog::create([
            'description' => "Task {$task->id} deleted by user " . $user->email,
            'user_id' => $user->id,
            'action' => "Delete a task"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * Assign task to user (only for admin/manager)
     */
    public function assignTask(Request $request, Task $task)
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id'
        ]);

        $user = Auth::user();

        $newAssignedUser = User::find($request->assigned_to);

        $tempTask = clone $task;
        $tempTask->assignedTo = $newAssignedUser;

        Gate::authorize('assign', $tempTask);

        $task->update([
            'assigned_to' => $request->assigned_to
        ]);

        ActivityLog::create([
            'description' => "Task {$task->id} assigned to user {$newAssignedUser->email} by user " . $user->email,
            'user_id' => $user->id,
            'action' => "Reassign task"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task assigned successfully',
            'data' => $task->load(['assignedTo'])
        ]);
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, Task $task)
    {
        Gate::authorize('view', $task);

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);

        $task->update([
            'status' => $request->status
        ]);

        $user = Auth::user();

        ActivityLog::create([
            'description' => "Task {$task->id} status updated to {$request->status} by user " . $user->email,
            'user_id' => $user->id,
            'action' => "Updated a task"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task status updated successfully',
            'data' => $task->load(['assignedTo'])
        ]);
    }
}
