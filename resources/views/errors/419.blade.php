@extends('errors.layout')

@section('title', '419 - Sesi Kedaluwarsa')

@section('content')
<div class="icon-container icon-yellow">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
</div>
<span class="badge badge-yellow">419 SESSION EXPIRED</span>
<h1 class="error-title">Sesi Halaman Kedaluwarsa</h1>
<p class="error-desc">
    Masa berlaku sesi atau token keamanan halaman ini telah berakhir karena tidak ada aktivitas. Silakan muat ulang halaman untuk memperbarui sesi.
</p>
@endsection
