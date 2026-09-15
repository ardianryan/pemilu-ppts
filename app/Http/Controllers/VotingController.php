<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VotingController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        /** @var Voter|null $voter */
        $voter = Auth::guard('voter')->user();

        if (! $voter) {
            return redirect()->route('login');
        }

        if ($voter->has_voted) {
            return redirect()->route('login')->with('message', 'Anda sudah menggunakan hak suara.');
        }

        $setting = ElectionSetting::current();
        if (! $setting->is_voting_active) {
            Auth::guard('voter')->logout();

            return redirect()->route('login')->with('error', 'Bilik suara telah ditutup.');
        }

        $candidates = Candidate::where('is_active', true)
            ->orderBy('candidate_number', 'asc')
            ->get()
            ->map(fn ($c) => [
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

        if (! $voter) {
            return redirect()->route('login');
        }

        $candidate = Candidate::select(['id', 'candidate_number'])->find($request->candidate_id);
        if (! $candidate) {
            return back()->withErrors(['candidate_id' => 'Kandidat pilihan tidak valid.']);
        }

        $now = now();
        $tokenCode = 'PLK-'.$now->year.'-'.strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        $receiptData = null;

        DB::transaction(function () use ($voter, $candidate, $now, $tokenCode, &$receiptData) {
            /** @var Voter|null $lockedVoter */
            $lockedVoter = Voter::where('id', $voter->id)->lockForUpdate()->first();

            if (! $lockedVoter || $lockedVoter->has_voted) {
                throw new \Exception('Hak suara telah digunakan.');
            }

            $shaProof = hash('sha256', $lockedVoter->nisn.'|'.$candidate->id.'|'.microtime(true).'|tamansiswa_secure');

            $lockedVoter->update([
                'has_voted' => true,
                'voted_at' => $now,
                'receipt_token' => $shaProof,
            ]);

            Candidate::where('id', $candidate->id)->increment('vote_count');

            $receiptData = [
                'token_code' => $tokenCode,
                'sha_proof' => $shaProof,
                'voted_at' => $now->translatedFormat('d M Y, H:i:s').' WIB',
                'voter_name' => $lockedVoter->name,
                'candidate_number' => str_pad((string) $candidate->candidate_number, 2, '0', STR_PAD_LEFT),
            ];
        });

        Auth::guard('voter')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::render('Voting/Receipt', [
            'receipt' => $receiptData,
        ]);
    }

    public function receipt(Request $request): Response|RedirectResponse
    {
        $receipt = session('receipt');

        if (! $receipt) {
            return redirect()->route('login');
        }

        return Inertia::render('Voting/Receipt', [
            'receipt' => $receipt,
        ]);
    }
}
