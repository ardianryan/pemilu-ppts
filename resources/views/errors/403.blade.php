@extends('errors.layout')

@section('title', '403 - Akses Ditolak')

@section('content')
<div class="icon-container icon-red">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
</div>
<span class="badge badge-red">403 FORBIDDEN</span>
<h1 class="error-title">Akses Ditolak / Dilarang</h1>
<p class="error-desc">
    {{ $exception->getMessage() ?: 'Anda tidak memiliki hak otorisasi atau izin akses untuk membuka halaman ini. Silakan periksa kembali hak akses akun Anda.' }}
</p>
@endsection
