<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->uuid('assigned_to');
            $table->uuid('created_by');
            $table->foreign('assigned_to')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->enum('status', ["pending", "in_proggress", "done"]);
            $table->dateTime('due_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
