@extends('errors.layout')

@section('title', '500 - Gangguan Server')

@section('content')
<div class="icon-container icon-red">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
</div>
<span class="badge badge-red">500 SERVER ERROR</span>
<h1 class="error-title">Terjadi Kendala pada Server</h1>
<p class="error-desc">
    Sistem mengalami kendala teknis internal saat memproses data. Tim teknis sedang menangani kendala ini.
</p>
@endsection
