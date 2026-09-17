@extends('errors.layout')

@section('title', '429 - Anda Sedang dalam Antrean')

@section('content')
<div class="icon-container icon-yellow">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
</div>
<span class="badge badge-yellow">429 ANTREAN PADAT / QUEUED</span>
<h1 class="error-title">Anda Sedang Dalam Antrean</h1>
<p class="error-desc">
    Sistem saat ini sedang memproses lalu lintas data pemilih yang sangat padat secara bersamaan. Mohon tunggu 10–20 detik, lalu muat ulang halaman ini untuk melanjutkan.
</p>
@endsection
