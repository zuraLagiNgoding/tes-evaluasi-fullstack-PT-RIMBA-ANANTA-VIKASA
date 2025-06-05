<?php

use App\Console\Commands\CheckOverdueTasks;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command(CheckOverdueTasks::class)->everyMinute();
