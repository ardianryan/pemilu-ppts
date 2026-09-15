<?php

namespace App\Http\Controllers;

use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::guard('voter')->check()) {
            return redirect()->route('voting.index');
        }

        $setting = ElectionSetting::current();

        return Inertia::render('Auth/Login', [
            'setting' => [
                'school_name' => $setting->school_name,
                'title' => $setting->title,
                'academic_year' => $setting->academic_year,
                'is_voting_active' => $setting->is_voting_active,
            ],
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string|size:10',
            'token' => 'required|string|min:3|max:20',
        ], [
            'nisn.required' => 'Kode Akses / NISN wajib diisi.',
            'nisn.size' => 'Kode Akses / NISN harus berjumlah 10 digit numerik.',
            'token.required' => 'Token wajib diisi.',
        ]);

        $setting = ElectionSetting::current();
        if (! $setting->is_voting_active) {
            return back()->withErrors([
                'nisn' => 'Bilik suara saat ini sedang ditutup oleh panitia pemilihan.',
            ]);
        }

        $voter = Voter::where('nisn', $request->nisn)
            ->where('token', strtoupper(trim($request->token)))
            ->first();

        if (! $voter) {
            return back()->withErrors([
                'nisn' => 'Data pemilih tidak ditemukan. Pastikan Kode Akses / NISN dan Token sesuai.',
            ]);
        }

        if ($voter->has_voted) {
            $votedAtFormatted = $voter->voted_at ? $voter->voted_at->translatedFormat('d M Y, H:i').' WIB' : 'sebelumnya';

            return back()->withErrors([
                'nisn' => "Halo {$voter->name}, hak suara Anda sudah tercatat pada {$votedAtFormatted}. Satu pemilih hanya memiliki 1 kali hak pilih.",
            ]);
        }

        // Catat jejak login & login voter
        $voter->update([
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
            'voting_session_id' => session()->getId(),
        ]);

        Auth::guard('voter')->login($voter);

        return redirect()->route('voting.index');
    }

    public function logout(Request $request)
    {
        Auth::guard('voter')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
