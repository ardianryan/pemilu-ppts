<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('nisn', 20)->unique(); // Kode Akses / NISN
            $table->string('token', 20)->unique(); // Token Otomatis
            $table->string('name', 120);
            $table->string('grade', 30)->default('X'); // X, XI, XII, GURU, TENDIK
            $table->string('class_room', 50);
            $table->boolean('has_voted')->default(false);
            $table->timestamp('voted_at')->nullable();
            $table->string('receipt_token', 64)->nullable();
            $table->string('voting_session_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index(['nisn', 'token']);
            $table->index('has_voted');
            $table->index('class_room');
            $table->index('grade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
