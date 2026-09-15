<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectionSetting extends Model
{
    use HasFactory;

    protected $table = 'election_settings';

    protected $fillable = [
        'school_name',
        'academic_year',
        'title',
        'logo_path',
        'voting_open_at',
        'voting_close_at',
        'is_voting_active',
        'show_quick_count_public',
    ];

    protected function casts(): array
    {
        return [
            'voting_open_at' => 'datetime',
            'voting_close_at' => 'datetime',
            'is_voting_active' => 'boolean',
            'show_quick_count_public' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return \Illuminate\Support\Facades\Cache::remember('election_setting_current', 300, function () {
            return static::firstOrCreate([], [
                'school_name' => 'SMA TAMANSISWA MOJOKERTO',
                'academic_year' => '2025/2026',
                'title' => 'Pemilihan Ketua & Wakil Ketua PPTS',
                'logo_path' => '/images/logo2.png',
                'is_voting_active' => true,
                'show_quick_count_public' => false,
            ]);
        });
    }

    public static function clearCache(): void
    {
        \Illuminate\Support\Facades\Cache::forget('election_setting_current');
    }
}
