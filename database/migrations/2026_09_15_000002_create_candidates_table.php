<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('candidate_number')->unique();
            $table->string('chairman_name', 100);
            $table->string('vice_chairman_name', 100);
            $table->string('tagline', 255)->nullable();
            $table->text('vision');
            $table->json('mission'); // JSON Array
            $table->string('photo_path', 255)->nullable();
            $table->string('color_accent', 30)->default('#386641');
            $table->unsignedInteger('vote_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('candidate_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
