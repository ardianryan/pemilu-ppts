<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $setting = ElectionSetting::current();

        return Inertia::render('Admin/Settings/Index', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $setting = ElectionSetting::current();

        $validated = $request->validate([
            'school_name' => 'required|string|max:150',
            'academic_year' => 'required|string|max:20',
            'title' => 'required|string|max:150',
            'is_voting_active' => 'boolean',
            'show_quick_count_public' => 'boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'school_name' => $validated['school_name'],
            'academic_year' => $validated['academic_year'],
            'title' => $validated['title'],
            'is_voting_active' => $validated['is_voting_active'] ?? true,
            'show_quick_count_public' => $validated['show_quick_count_public'] ?? false,
        ];

        if ($request->hasFile('logo')) {
            $data['logo_path'] = '/storage/' . $request->file('logo')->store('settings', 'public');
        }

        $setting->update($data);
        ElectionSetting::clearCache();

        return redirect()->back()->with('success', 'Pengaturan sistem pemilu berhasil diperbarui.');
    }

    public function resetAllVotes(Request $request)
    {
        $request->validate([
            'confirmation' => 'required|in:RESET SEMUA SUARA',
        ], [
            'confirmation.in' => 'Konfirmasi tidak sesuai. Harap ketik "RESET SEMUA SUARA".',
        ]);

        // Reset vote counts
        Candidate::query()->update(['vote_count' => 0]);

        // Reset all voters
        Voter::query()->update([
            'has_voted' => false,
            'voted_at' => null,
            'receipt_token' => null,
            'voting_session_id' => null,
        ]);

        return redirect()->back()->with('success', 'Seluruh data suara berhasil direset ke 0. Pemilihan siap dimulai kembali.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'Password saat ini wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        /** @var \App\Models\Admin $admin */
        $admin = auth('admin')->user();

        if (!\Illuminate\Support\Facades\Hash::check($validated['current_password'], $admin->password)) {
            return redirect()->back()->withErrors([
                'current_password' => 'Password saat ini yang Anda masukkan tidak sesuai.',
            ]);
        }

        $admin->update([
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password admin berhasil diperbarui.');
    }
}
