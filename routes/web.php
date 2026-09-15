<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\VoterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VotingController;
use App\Http\Controllers\PublicLiveCountController;
use Illuminate\Support\Facades\Route;

// Redirect root to student login
Route::get('/', fn() => redirect()->route('login'));

// Public Live Count Page
Route::get('/livecount', [PublicLiveCountController::class, 'index'])->name('livecount');

// Student / Voter Authentication
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Student Voting Flow (Protected)
Route::middleware('auth:voter')->group(function () {
    Route::get('/voting', [VotingController::class, 'index'])->name('voting.index');
    Route::post('/voting/store', [VotingController::class, 'store'])->name('voting.store');
});

Route::get('/voting/receipt', [VotingController::class, 'receipt'])->name('voting.receipt');

// Admin Authentication
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.attempt');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Admin Dashboard Suite (Protected)
    Route::middleware('auth:admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Candidates Management
        Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
        Route::post('/candidates', [CandidateController::class, 'store'])->name('candidates.store');
        Route::post('/candidates/{candidate}', [CandidateController::class, 'update'])->name('candidates.update');
        Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy'])->name('candidates.destroy');

        // Voters Management
        Route::get('/voters', [VoterController::class, 'index'])->name('voters.index');
        Route::post('/voters', [VoterController::class, 'store'])->name('voters.store');
        Route::put('/voters/{voter}', [VoterController::class, 'update'])->name('voters.update');
        Route::delete('/voters/{voter}', [VoterController::class, 'destroy'])->name('voters.destroy');
        Route::post('/voters/{voter}/reset', [VoterController::class, 'resetStatus'])->name('voters.reset');
        Route::post('/voters/import', [VoterController::class, 'import'])->name('voters.import');
        Route::get('/voters/template', [VoterController::class, 'downloadTemplate'])->name('voters.template');
        Route::get('/voters/export', [VoterController::class, 'export'])->name('voters.export');
        Route::get('/voters/print-cards', [VoterController::class, 'printCards'])->name('voters.print_cards');

        // Settings & System Control
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::post('/settings/password', [SettingController::class, 'updatePassword'])->name('settings.password');
        Route::post('/settings/reset-votes', [SettingController::class, 'resetAllVotes'])->name('settings.reset_votes');
    });
});
