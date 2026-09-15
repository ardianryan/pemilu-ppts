import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Vote, 
    ShieldCheck, 
    Lock, 
    UserCheck, 
    AlertCircle, 
    CheckCircle2, 
    ArrowRight, 
    School, 
    Clock, 
    Sparkles,
    BarChart3
} from 'lucide-react';

export default function Login({ setting, classes, errors: serverErrors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nisn: '',
        token: '',
    });

    const tokenInputRef = useRef(null);

    // Auto-advance cursor to Token field once NISN hits 10 digits
    const handleNisnChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setData('nisn', val);
        if (val.length === 10 && tokenInputRef.current) {
            tokenInputRef.current.focus();
        }
    };

    const handleTokenChange = (e) => {
        const val = e.target.value.toUpperCase().slice(0, 20);
        setData('token', val);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login.attempt'));
    };

    const isComplete = data.nisn.length === 10 && data.token.length >= 3;

    return (
        <div className="min-h-screen bg-[#F4F7F4] flex flex-col justify-between selection:bg-[#386641]/20 font-body text-[#101F15]">
            <Head title="Masuk Bilik Suara - Pilketos Digital" />

            {/* Top Bar / Civic Header */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E1F2E2] px-4 sm:px-8 py-3.5 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo Sekolah" 
                            className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-xs"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                            <span className="font-headline font-extrabold text-[#204E2B] text-base sm:text-lg tracking-tight block leading-tight">
                                PILKETOS
                            </span>
                            <span className="text-[11px] font-medium text-[#414941] uppercase tracking-wider block">
                                {setting?.school_name || 'SMA TAMANSISWA MOJOKERTO'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
                        <ShieldCheck className="w-4 h-4 text-[#386641]" />
                        <span>Bilik Suara Digital</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-[460px] space-y-6">
                    
                    {/* Welcome Card */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#E6F8E8] to-white border border-[#E1F2E2] shadow-xs p-6 sm:p-7 text-center space-y-2">
                        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#101F15] tracking-tight leading-snug">
                            {setting?.title || 'Pemilihan Ketua & Wakil Ketua PPTS'}
                        </h1>
                        <p className="text-sm text-[#414941] max-w-xs mx-auto leading-relaxed">
                            Masukkan Kode Akses / NISN dan Token Anda untuk membuka bilik suara digital.
                        </p>
                        <p className="pt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#3D6924]">
                            <Lock className="w-3.5 h-3.5 text-[#3D6924]" />
                            <span>Satu pemilih hanya memiliki 1 (satu) kali hak suara.</span>
                        </p>
                    </div>

                    {/* Authentication Form Card */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E1F2E2] space-y-6">
                        <div className="flex items-center gap-2.5 border-b border-[#E1F2E2] pb-4">
                            <div className="w-1.5 h-5 rounded-full bg-[#386641]"></div>
                            <h2 className="font-headline font-bold text-lg text-[#101F15]">
                                Verifikasi Identitas Pemilih
                            </h2>
                        </div>

                        {/* Error Alert Banner */}
                        {errors.nisn && (
                            <div className="p-4 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/20 text-[#93000A] text-xs sm:text-sm flex items-start gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
                                <div className="leading-relaxed font-medium">
                                    {errors.nisn}
                                </div>
                            </div>
                        )}

                        {errors.token && !errors.nisn && (
                            <div className="p-4 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/20 text-[#93000A] text-xs sm:text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
                                <div className="leading-relaxed font-medium">
                                    {errors.token}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* 1. Input Kode Akses / NISN */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="nisn" className="text-xs font-bold text-[#101F15] uppercase tracking-wider flex items-center gap-1.5">
                                        <span>Kode Akses / NISN (10 Digit)</span>
                                        <span className="text-[#BA1A1A]">*</span>
                                    </label>
                                    <span className={`text-xs font-mono font-semibold ${data.nisn.length === 10 ? 'text-[#2D6A4F]' : 'text-[#727970]'}`}>
                                        {data.nisn.length}/10
                                    </span>
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        id="nisn"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={10}
                                        autoFocus
                                        placeholder="Contoh: 0061234501"
                                        value={data.nisn}
                                        onChange={handleNisnChange}
                                        className="w-full h-13 px-4 bg-[#F4F7F4] text-[#101F15] rounded-xl font-mono text-lg font-semibold tracking-widest border border-[#E1F2E2] focus:bg-white focus:border-[#386641] focus:ring-4 focus:ring-[#A7C957]/25 outline-none transition-all"
                                        required
                                    />
                                    {data.nisn.length === 10 && (
                                        <div className="absolute right-3.5 flex items-center text-[#2D6A4F] animate-fade-in">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#727970] leading-tight">
                                    Nomor identitas unik atau NISN terdaftar pada DPT Panitia.
                                </p>
                            </div>

                            {/* 2. Input Token */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="token" className="text-xs font-bold text-[#101F15] uppercase tracking-wider flex items-center gap-1.5">
                                        <span>Token Akses</span>
                                        <span className="text-[#BA1A1A]">*</span>
                                    </label>
                                    {data.token.length >= 3 && (
                                        <span className="text-xs font-mono text-[#2D6A4F] font-semibold">Siap</span>
                                    )}
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        ref={tokenInputRef}
                                        id="token"
                                        type="text"
                                        maxLength={20}
                                        placeholder="Contoh: X7K9P2"
                                        value={data.token}
                                        onChange={handleTokenChange}
                                        className="w-full h-13 px-4 bg-[#F4F7F4] text-[#101F15] rounded-xl font-mono text-lg font-bold tracking-widest uppercase border border-[#E1F2E2] focus:bg-white focus:border-[#386641] focus:ring-4 focus:ring-[#A7C957]/25 outline-none transition-all"
                                        required
                                    />
                                    {data.token.length >= 3 && (
                                        <div className="absolute right-3.5 flex items-center text-[#2D6A4F] animate-fade-in">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#727970] leading-tight">
                                    Kode Token unik yang diberikan oleh Panitia KPU PPTS.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !isComplete}
                                className={`w-full h-13 rounded-xl font-headline font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                                    isComplete && !processing
                                        ? 'bg-[#386641] hover:bg-[#204E2B] text-white active:scale-[0.99] cursor-pointer shadow-[#386641]/20'
                                        : 'bg-[#E1F2E2] text-[#727970] cursor-not-allowed opacity-80'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>Memverifikasi Identitas...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Bilik Suara</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Bottom Info / Help Note */}
                    <div className="text-center space-y-3">
                        {setting?.show_quick_count_public && (
                            <div>
                                <Link 
                                    href={route('livecount')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E6F8E8] text-[#204E2B] border border-[#E1F2E2] hover:bg-[#D5E7D7] text-xs font-bold transition"
                                >
                                    <BarChart3 className="w-4 h-4 text-[#386641]" />
                                    <span>Lihat Live Count / Hasil Perolehan Suara</span>
                                </Link>
                            </div>
                        )}
                        <p className="text-xs text-[#727970]">
                            Mengalami kendala login atau nomor kartu tidak cocok?
                            <br />
                            Silakan lapor ke <strong>Panitia Pengawas Bilik Suara</strong> terdekat.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="w-full text-center py-4 border-t border-[#E1F2E2] text-xs text-[#727970]">
                &copy; {new Date().getFullYear()} PPTS {setting?.school_name || 'SMA TAMANSISWA MOJOKERTO'}
            </footer>
        </div>
    );
}
