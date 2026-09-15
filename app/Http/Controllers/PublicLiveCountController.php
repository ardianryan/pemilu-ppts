<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PublicLiveCountController extends Controller
{
    public function index(): Response
    {
        $setting = ElectionSetting::current();

        $currentHourKey = date('Y-m-d_H');
        $secondsUntilNextHour = max(60, 3600 - (time() % 3600));

        $lastUpdatedFormatted = date('H:00').' WIB';
        $nextUpdateFormatted = date('H:00', strtotime('+1 hour')).' WIB';

        $data = Cache::remember('public_livecount_payload_'.$currentHourKey, $secondsUntilNextHour, function () use ($setting) {
            $totalVoters = Voter::count();
            $totalVoted = Voter::where('has_voted', true)->count();
            $totalNotVoted = $totalVoters - $totalVoted;
            $turnoutPercentage = $totalVoters > 0 ? round(($totalVoted / $totalVoters) * 100, 1) : 0;

            $totalCandidateVotes = (int) Candidate::sum('vote_count');

            $candidates = Candidate::orderBy('candidate_number', 'asc')
                ->get()
                ->map(function ($c) use ($totalCandidateVotes, $setting) {
                    $percentage = $totalCandidateVotes > 0 ? round(($c->vote_count / $totalCandidateVotes) * 100, 1) : 0;

                    return [
                        'id' => $c->id,
                        'candidate_number' => $c->candidate_number,
                        'chairman_name' => $c->chairman_name,
                        'vice_chairman_name' => $c->vice_chairman_name,
                        'tagline' => $c->tagline,
                        'photo_path' => $c->photo_path,
                        'color_accent' => $c->color_accent,
                        'vote_count' => $setting->show_quick_count_public ? $c->vote_count : 0,
                        'percentage' => $setting->show_quick_count_public ? $percentage : 0,
                    ];
                })
                ->values()
                ->all();

            // Stats per Angkatan
            $gradeStats = Voter::select('grade', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
                ->groupBy('grade')
                ->orderBy('grade')
                ->get()
                ->map(function ($g) {
                    $total = (int) $g->total;
                    $voted = (int) $g->voted;
                    $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;

                    return [
                        'grade' => $g->grade,
                        'total' => $total,
                        'voted' => $voted,
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
                'candidates' => $candidates,
                'grade_stats' => $gradeStats,
            ];
        });

        return Inertia::render('Public/LiveCount', [
            'setting' => $setting,
            'is_public_enabled' => (bool) $setting->show_quick_count_public,
            'metrics' => $data['metrics'] ?? [],
            'candidates' => is_array($data['candidates'] ?? null) ? $data['candidates'] : [],
            'grade_stats' => is_array($data['grade_stats'] ?? null) ? $data['grade_stats'] : [],
            'last_updated' => $lastUpdatedFormatted,
            'next_update' => $nextUpdateFormatted,
        ]);
    }
}
