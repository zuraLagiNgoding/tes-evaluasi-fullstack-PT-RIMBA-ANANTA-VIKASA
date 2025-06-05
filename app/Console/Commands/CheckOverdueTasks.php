<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckOverdueTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-overdue-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        // Ambil semua task yang overdue dan belum dilog
        $overdueTasks = Task::where('due_date', '<', $now)->get();

        foreach ($overdueTasks as $task) {
            // Cek apakah sudah ada log untuk task ini (opsional, agar tidak double log)
            $existingLog = ActivityLog::where('description', 'like', "Task overdue: {$task->id}%")->first();
            if ($existingLog) {
                continue;
            }

            ActivityLog::create([
                'description' => "Task overdue: {$task->id} via scheduler",
                'action' => "Task Overdue"
            ]);

            $this->info("Logged overdue task: {$task->id}");
        }

        $this->info('Overdue task logging completed.');
        
        return Command::SUCCESS;
    }
}
