<?php

namespace App\Providers;

use App\Models\ActivityLog;
use App\Models\Task;
use App\Models\User;
use App\Policies\ActivityLogPolicy;
use App\Policies\TaskPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);

        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
