<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $setting = ElectionSetting::current();

        return Inertia::render('Admin/Dashboard', [
            'setting' => $setting,
            'metrics' => Inertia::defer(fn () => $this->getDashboardPayload()['metrics']),
            'gender_stats' => Inertia::defer(fn () => $this->getDashboardPayload()['gender_stats']),
            'grade_stats' => Inertia::defer(fn () => $this->getDashboardPayload()['grade_stats']),
            'class_stats' => Inertia::defer(fn () => $this->getDashboardPayload()['class_stats']),
        ]);
    }

    private function getDashboardPayload(): array
    {
        return Cache::remember('admin_dashboard_payload', 5, function () {
            $totalVoters = Voter::count();
            $totalVoted = Voter::where('has_voted', true)->count();
            $totalNotVoted = $totalVoters - $totalVoted;
            $turnoutPercentage = $totalVoters > 0 ? round(($totalVoted / $totalVoters) * 100, 1) : 0;

            // Partisipasi Berdasarkan Jenis Kelamin
            $genderStats = Voter::select('gender', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
                ->groupBy('gender')
                ->orderBy('gender')
                ->get()
                ->map(function ($g) {
                    $total = (int) $g->total;
                    $voted = (int) $g->voted;
                    $notVoted = $total - $voted;
                    $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;
                    $label = $g->gender === 'P' ? 'Perempuan (P)' : 'Laki-Laki (L)';

                    return [
                        'gender' => $g->gender,
                        'label' => $label,
                        'total' => $total,
                        'voted' => $voted,
                        'not_voted' => $notVoted,
                        'percentage' => $pct,
                    ];
                })
                ->values()
                ->all();

            // Partisipasi per Angkatan / Kategori
            $gradeStats = Voter::select('grade', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
                ->groupBy('grade')
                ->orderBy('grade')
                ->get()
                ->map(function ($g) {
                    $total = (int) $g->total;
                    $voted = (int) $g->voted;
                    $notVoted = $total - $voted;
                    $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;

                    return [
                        'grade' => $g->grade,
                        'total' => $total,
                        'voted' => $voted,
                        'not_voted' => $notVoted,
                        'percentage' => $pct,
                    ];
                })
                ->values()
                ->all();

            // Partisipasi per Rombel Kelas & Pamong
            $classStats = Voter::select('class_room', 'grade', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
                ->groupBy('class_room', 'grade')
                ->orderBy('class_room')
                ->get()
                ->map(function ($c) {
                    $total = (int) $c->total;
                    $voted = (int) $c->voted;
                    $notVoted = $total - $voted;
                    $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;

                    return [
                        'class_room' => $c->class_room,
                        'grade' => $c->grade,
                        'total' => $total,
                        'voted' => $voted,
                        'not_voted' => $notVoted,
                        'percentage' => $pct,
                    ];
                })
                ->values()
                ->all();

            return [
                'metrics' => [
                    'total_voters' => $totalVoters,
                    'total_voted' => $totalVoted,
                    'total_not_voted' => $totalNotVoted,
                    'turnout_percentage' => $turnoutPercentage,
                ],
                'gender_stats' => $genderStats,
                'grade_stats' => $gradeStats,
                'class_stats' => $classStats,
            ];
        });
    }

    public function quickCount(): Response
    {
        $setting = ElectionSetting::current();

        return Inertia::render('Admin/QuickCount', [
            'setting' => $setting,
            'metrics' => Inertia::defer(fn () => $this->getQuickCountPayload()['metrics']),
            'candidates' => Inertia::defer(fn () => $this->getQuickCountPayload()['candidates']),
        ]);
    }

    private function getQuickCountPayload(): array
    {
        return Cache::remember('admin_quick_count_payload', 3, function () {
            $totalVoters = Voter::count();
            $totalVoted = Voter::where('has_voted', true)->count();
            $totalNotVoted = $totalVoters - $totalVoted;
            $turnoutPercentage = $totalVoters > 0 ? round(($totalVoted / $totalVoters) * 100, 1) : 0;

            $totalCandidateVotes = (int) Candidate::sum('vote_count');

            $candidates = Candidate::orderBy('candidate_number', 'asc')
                ->get()
                ->map(function ($c) use ($totalCandidateVotes) {
                    $percentage = $totalCandidateVotes > 0 ? round(($c->vote_count / $totalCandidateVotes) * 100, 1) : 0;

                    return [
                        'id' => $c->id,
                        'candidate_number' => $c->candidate_number,
                        'chairman_name' => $c->chairman_name,
                        'vice_chairman_name' => $c->vice_chairman_name,
                        'tagline' => $c->tagline,
                        'photo_path' => $c->photo_path,
                        'color_accent' => $c->color_accent,
                        'vote_count' => $c->vote_count,
                        'percentage' => $percentage,
                    ];
                })
                ->values()
                ->all();

            return [
                'metrics' => [
                    'total_voters' => $totalVoters,
                    'total_voted' => $totalVoted,
                    'total_not_voted' => $totalNotVoted,
                    'turnout_percentage' => $turnoutPercentage,
                ],
                'candidates' => $candidates,
            ];
        });
    }
}
