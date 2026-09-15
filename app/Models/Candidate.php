<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $table = 'candidates';

    protected $fillable = [
        'candidate_number',
        'chairman_name',
        'vice_chairman_name',
        'tagline',
        'vision',
        'mission',
        'photo_path',
        'color_accent',
        'vote_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'candidate_number' => 'integer',
            'vote_count' => 'integer',
            'mission' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
