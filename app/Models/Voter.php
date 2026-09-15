<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Voter extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'voters';

    protected $fillable = [
        'nisn', // Kode Akses / NISN
        'token', // Token Akses
        'name',
        'grade',
        'class_room',
        'has_voted',
        'voted_at',
        'receipt_token',
        'voting_session_id',
        'ip_address',
        'user_agent',
    ];

    protected static function booted(): void
    {
        static::creating(function (Voter $voter) {
            if (empty($voter->token)) {
                $voter->token = static::generateUniqueToken();
            }
        });
    }

    public static function generateUniqueToken(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do {
            $token = '';
            for ($i = 0; $i < 6; $i++) {
                $token .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (static::where('token', $token)->exists());

        return $token;
    }

    protected function casts(): array
    {
        return [
            'has_voted' => 'boolean',
            'voted_at' => 'datetime',
        ];
    }
}
