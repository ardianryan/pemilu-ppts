@extends('errors.layout')

@section('title', '503 - Pemeliharaan Sistem')

@section('content')
<div class="icon-container icon-green">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 10v4h10v-4"></path>
        <path d="M12 2v8"></path>
        <path d="M12 14v8"></path>
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
</div>
<span class="badge badge-green">503 SERVICE UNAVAILABLE</span>
<h1 class="error-title">Sistem Sedang Pemeliharaan</h1>
<p class="error-desc">
    Layanan Pemilu PPTS saat ini sedang dalam proses pemeliharaan berkala atau optimalisasi sistem. Silakan coba kembali dalam beberapa saat.
</p>
@endsection
