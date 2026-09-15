<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'voter' => $request->user('voter') ? [
                    'id' => $request->user('voter')->id,
                    'name' => $request->user('voter')->name,
                    'nisn' => $request->user('voter')->nisn,
                    'nis' => $request->user('voter')->nis,
                    'grade' => $request->user('voter')->grade,
                    'class_room' => $request->user('voter')->class_room,
                    'has_voted' => $request->user('voter')->has_voted,
                ] : null,
                'admin' => $request->user('admin') ? [
                    'id' => $request->user('admin')->id,
                    'name' => $request->user('admin')->name,
                    'username' => $request->user('admin')->username,
                    'role' => $request->user('admin')->role,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'school_name' => config('app.school_name', 'SMA/SMK TAMANSISWA'),
            'logo_url' => '/images/logo2.png',
        ];
    }
}
