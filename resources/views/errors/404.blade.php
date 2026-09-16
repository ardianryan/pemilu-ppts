@extends('errors.layout')

@section('title', '404 - Halaman Tidak Ditemukan')

@section('content')
<div class="icon-container icon-green">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
</div>
<span class="badge badge-green">404 NOT FOUND</span>
<h1 class="error-title">Halaman Tidak Ditemukan</h1>
<p class="error-desc">
    Mohon maaf, halaman atau tautan yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL salah ketik.
</p>
@endsection
