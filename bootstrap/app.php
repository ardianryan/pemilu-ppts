<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('admin*') ? route('admin.login') : route('login')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return $response;
            }

            $status = $response->getStatusCode();

            if (in_array($status, [403, 404, 419, 429, 500, 503])) {
                if (app()->environment('testing')) {
                    return $response;
                }

                if (config('app.debug') && $status === 500) {
                    return $response;
                }

                return Inertia::render('Error', [
                    'status' => $status,
                    'message' => $exception->getMessage() ?: null,
                ])->toResponse($request)->setStatusCode($status);
            }

            return $response;
        });
    })->create();
