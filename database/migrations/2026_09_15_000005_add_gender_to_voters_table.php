<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('voters', 'gender')) {
            Schema::table('voters', function (Blueprint $table) {
                $table->string('gender', 10)->default('L')->after('grade');
                $table->index('gender');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('voters', 'gender')) {
            Schema::table('voters', function (Blueprint $table) {
                $table->dropColumn('gender');
            });
        }
    }
};
