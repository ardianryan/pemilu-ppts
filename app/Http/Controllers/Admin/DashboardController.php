<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalVoters = Voter::count();
        $totalVoted = Voter::where('has_voted', true)->count();
        $totalNotVoted = $totalVoters - $totalVoted;
        $turnoutPercentage = $totalVoters > 0 ? round(($totalVoted / $totalVoters) * 100, 1) : 0;

        $candidates = Candidate::orderBy('candidate_number', 'asc')
            ->get()
            ->map(function ($c) use ($totalVoted) {
                $percentage = $totalVoted > 0 ? round(($c->vote_count / $totalVoted) * 100, 1) : 0;
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
            });

        // Partisipasi per Angkatan / Tingkat
        $gradeStats = Voter::select('grade', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
            ->groupBy('grade')
            ->orderBy('grade')
            ->get()
            ->map(function ($g) {
                $total = (int)$g->total;
                $voted = (int)$g->voted;
                $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;
                return [
                    'grade' => $g->grade,
                    'total' => $total,
                    'voted' => $voted,
                    'percentage' => $pct,
                ];
            });

        // Partisipasi per Rombel Kelas
        $classStats = Voter::select('class_room', DB::raw('count(*) as total'), DB::raw('sum(has_voted) as voted'))
            ->groupBy('class_room')
            ->orderBy('class_room')
            ->get()
            ->map(function ($c) {
                $total = (int)$c->total;
                $voted = (int)$c->voted;
                $pct = $total > 0 ? round(($voted / $total) * 100, 1) : 0;
                return [
                    'class_room' => $c->class_room,
                    'total' => $total,
                    'voted' => $voted,
                    'percentage' => $pct,
                ];
            });

        $setting = ElectionSetting::current();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_voters' => $totalVoters,
                'total_voted' => $totalVoted,
                'total_not_voted' => $totalNotVoted,
                'turnout_percentage' => $turnoutPercentage,
            ],
            'candidates' => $candidates,
            'grade_stats' => $gradeStats,
            'class_stats' => $classStats,
            'setting' => $setting,
        ]);
    }
}
