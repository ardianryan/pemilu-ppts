<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VotingController extends Controller
{
    public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        /** @var Voter|null $voter */
        $voter = Auth::guard('voter')->user();

        if (!$voter) {
            return redirect()->route('login');
        }

        if ($voter->has_voted) {
            return redirect()->route('login')->with('message', 'Anda sudah menggunakan hak suara.');
        }

        $setting = ElectionSetting::current();
        if (!$setting->is_voting_active) {
            Auth::guard('voter')->logout();
            return redirect()->route('login')->with('error', 'Bilik suara telah ditutup.');
        }

        $candidates = Candidate::where('is_active', true)
            ->orderBy('candidate_number', 'asc')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'candidate_number' => $c->candidate_number,
                'chairman_name' => $c->chairman_name,
                'vice_chairman_name' => $c->vice_chairman_name,
                'tagline' => $c->tagline,
                'vision' => $c->vision,
                'mission' => $c->mission,
                'photo_path' => $c->photo_path,
                'color_accent' => $c->color_accent,
            ]);

        return Inertia::render('Voting/Index', [
            'voter' => [
                'name' => $voter->name,
                'nisn' => $voter->nisn,
                'nis' => $voter->nis,
                'grade' => $voter->grade,
                'class_room' => $voter->class_room,
            ],
            'candidates' => $candidates,
            'setting' => [
                'title' => $setting->title,
                'school_name' => $setting->school_name,
                'academic_year' => $setting->academic_year,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        /** @var Voter|null $voter */
        $voter = Auth::guard('voter')->user();

        if (!$voter) {
            return redirect()->route('login');
        }

        $receiptData = null;

        DB::transaction(function () use ($voter, $request, &$receiptData) {
            // Lock voter record to prevent concurrent double-voting
            $lockedVoter = Voter::where('id', $voter->id)->lockForUpdate()->first();

            if ($lockedVoter->has_voted) {
                throw new \Exception('Hak suara telah digunakan.');
            }

            // 1. Tambahkan perolehan suara paslon secara atomik
            Candidate::where('id', $request->candidate_id)->increment('vote_count');

            // 2. Generate Kriptografi Bukti Suara Sah (SHA-256)
            $tokenCode = 'PLK-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
            $shaProof = hash('sha256', $lockedVoter->nisn . '|' . $request->candidate_id . '|' . microtime(true) . '|tamansiswa_secure');

            $now = now();

            // 3. Kunci status pemilih
            $lockedVoter->update([
                'has_voted' => true,
                'voted_at' => $now,
                'receipt_token' => $shaProof,
            ]);

            $candidate = Candidate::find($request->candidate_id);

            $receiptData = [
                'token_code' => $tokenCode,
                'sha_proof' => $shaProof,
                'voted_at' => $now->translatedFormat('d M Y, H:i:s') . ' WIB',
                'voter_name' => $lockedVoter->name,
                'candidate_number' => $candidate ? str_pad($candidate->candidate_number, 2, '0', STR_PAD_LEFT) : '00',
            ];
        });

        // 4. Logout Sesi Pemilih untuk Asas Kerahasiaan
        Auth::guard('voter')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Render langsung halaman tanda bukti dengan data resi
        return Inertia::render('Voting/Receipt', [
            'receipt' => $receiptData,
        ]);
    }

    public function receipt(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $receipt = session('receipt');

        if (!$receipt) {
            return redirect()->route('login');
        }

        return Inertia::render('Voting/Receipt', [
            'receipt' => $receipt,
        ]);
    }
}

