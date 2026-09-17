<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
        RateLimiter::for('voter-login', function (Request $request) {
            return [
                Limit::perMinute(150)->by('global-voter-login'),
                Limit::perMinute(30)->by($request->ip()),
            ];
        });

        RateLimiter::for('voter-vote', function (Request $request) {
            return [
                Limit::perMinute(150)->by('global-voter-vote'),
                Limit::perMinute(10)->by($request->user()?->id ?: $request->ip()),
            ];
        });
    }
}
