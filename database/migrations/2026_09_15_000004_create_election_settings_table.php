<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('election_settings', function (Blueprint $table) {
            $table->id();
            $table->string('school_name', 150)->default('SMA TAMANSISWA MOJOKERTO');
            $table->string('academic_year', 20)->default('2025/2026');
            $table->string('title', 150)->default('Pemilihan Ketua & Wakil Ketua PPTS');
            $table->string('logo_path', 255)->default('/images/logo2.png');
            $table->timestamp('voting_open_at')->nullable();
            $table->timestamp('voting_close_at')->nullable();
            $table->boolean('is_voting_active')->default(true);
            $table->boolean('show_quick_count_public')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('election_settings');
    }
};
