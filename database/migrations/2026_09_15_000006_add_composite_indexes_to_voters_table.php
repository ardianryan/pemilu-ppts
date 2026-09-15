<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            $table->index(['has_voted', 'gender']);
            $table->index(['has_voted', 'grade']);
            $table->index(['has_voted', 'class_room']);
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            $table->dropIndex(['has_voted', 'gender']);
            $table->dropIndex(['has_voted', 'grade']);
            $table->dropIndex(['has_voted', 'class_room']);
        });
    }
};
