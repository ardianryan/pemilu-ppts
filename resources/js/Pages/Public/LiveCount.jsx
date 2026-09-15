import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    BarChart3, 
    ShieldCheck, 
    UserCheck, 
    Clock, 
    RefreshCw, 
    Lock, 
    ArrowLeft, 
    Sparkles, 
    School 
} from 'lucide-react';

export default function PublicLiveCount({ setting, is_public_enabled, metrics, candidates, grade_stats }) {
    
    // Auto refresh data every 10 seconds if livecount is enabled
    useEffect(() => {
        if (!is_public_enabled) return;

        const interval = setInterval(() => {
            router.reload({ preserveScroll: true });
        }, 10000);

        return () => clearInterval(interval);
    }, [is_public_enabled]);

    return (
        <div className="min-h-screen bg-[#F4F7F4] text-[#101F15] font-body flex flex-col justify-between selection:bg-[#386641]/20">
            <Head title="Real-Time Live Count Perolehan Suara - Pemilu PPTS" />

            {/* Civic Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E1F2E2] px-4 sm:px-8 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo Sekolah" 
                            className="h-10 w-10 object-contain drop-shadow-xs"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                            <span className="font-headline font-extrabold text-[#204E2B] text-base sm:text-lg tracking-tight block leading-tight">
                                PEMILU PPTS LIVE COUNT
                            </span>
                            <span className="text-[11px] font-medium text-[#414941] uppercase tracking-wider block">
                                {setting?.school_name || 'SMA TAMANSISWA MOJOKERTO'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href={route('login')}
                            className="px-3.5 py-1.5 rounded-xl border border-[#E1F2E2] bg-white hover:bg-[#E6F8E8] text-xs font-semibold text-[#204E2B] transition flex items-center gap-1.5"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Bilik Suara</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
                
                {/* Title Banner */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E6F8E8] text-[#204E2B] border border-[#E1F2E2] text-xs font-bold">
                        <BarChart3 className="w-4 h-4 text-[#386641]" />
                        <span>QUICK COUNT & PEROLEHAN SUARA DIGITAL</span>
                    </div>
                    <h1 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#101F15] tracking-tight">
                        {setting?.title || 'Pemilihan Ketua & Wakil Ketua PPTS'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#727970]">
                        Data hasil perhitungan suara otomatis diperbarui setiap 10 detik.
                    </p>
                </div>

                {!is_public_enabled ? (
                    /* Notice if public quick count is locked by Admin */
                    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E1F2E2] shadow-sm max-w-xl mx-auto text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2] text-[#727970] flex items-center justify-center mx-auto shadow-inner">
                            <Lock className="w-8 h-8 text-[#386641]" />
                        </div>
                        <h2 className="font-headline font-extrabold text-xl text-[#101F15]">
                            Hasil Live Count Belum Dibuka
                        </h2>
                        <p className="text-xs sm:text-sm text-[#727970] leading-relaxed">
                            Panitia KPU PPTS {setting?.school_name} belum mengaktifkan penayangan hasil perolehan suara secara publik. Grafik perolehan suara akan muncul setelah voting selesai dan hasil diumumkan secara resmi.
                        </p>
                        <div className="pt-2">
                            <Link 
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-bold text-xs shadow-md transition"
                            >
                                <span>Masuk ke Bilik Suara</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Live Count Data Grid */
                    <div className="space-y-8">
                        {/* Overall Metrics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            <div className="bg-white p-5 rounded-2xl border border-[#E1F2E2] shadow-xs">
                                <span className="text-[11px] font-bold text-[#727970] uppercase tracking-wider block">
                                    Total Hak Suara (DPT)
                                </span>
                                <span className="font-headline font-extrabold text-2xl sm:text-3xl text-[#101F15] block mt-1">
                                    {metrics.total_voters}
                                </span>
                                <span className="text-xs text-[#727970] block mt-0.5">Siswa terdaftar</span>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#E1F2E2] shadow-xs">
                                <span className="text-[11px] font-bold text-[#386641] uppercase tracking-wider block">
                                    Suara Masuk
                                </span>
                                <span className="font-headline font-extrabold text-2xl sm:text-3xl text-[#204E2B] block mt-1">
                                    {metrics.total_voted}
                                </span>
                                <span className="text-xs text-[#2D6A4F] block mt-0.5">Sudah memilih</span>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#E1F2E2] shadow-xs">
                                <span className="text-[11px] font-bold text-[#BA1A1A] uppercase tracking-wider block">
                                    Belum Memilih
                                </span>
                                <span className="font-headline font-extrabold text-2xl sm:text-3xl text-[#BA1A1A] block mt-1">
                                    {metrics.total_not_voted}
                                </span>
                                <span className="text-xs text-[#93000A] block mt-0.5">Belum menyalurkan</span>
                            </div>

                            <div className="bg-[#E6F8E8] p-5 rounded-2xl border border-[#A7C957]/40 shadow-xs">
                                <span className="text-[11px] font-bold text-[#204E2B] uppercase tracking-wider block">
                                    Persentase Partisipasi
                                </span>
                                <span className="font-headline font-extrabold text-2xl sm:text-3xl text-[#204E2B] block mt-1">
                                    {metrics.turnout_percentage}%
                                </span>
                                <span className="text-xs text-[#386641] block mt-0.5">Tingkat kehadiran</span>
                            </div>
                        </div>

                        {/* Candidates Live Standings Cards */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-[#E1F2E2] pb-4">
                                <div>
                                    <h2 className="font-headline font-bold text-lg text-[#101F15]">
                                        Perolehan Suara Pasangan Calon
                                    </h2>
                                    <p className="text-xs text-[#727970]">
                                        Hasil sementara perhitungan suara langsung (Live Count)
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[#386641] font-semibold">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Realtime</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {candidates.map((paslon) => (
                                    <div 
                                        key={paslon.id} 
                                        className="bg-[#F4F7F4] rounded-2xl p-5 border border-[#E1F2E2] space-y-4 flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            {/* Candidate Number Header */}
                                            <div className="flex items-center justify-between">
                                                <span className="w-10 h-10 rounded-xl bg-[#386641] text-white font-headline font-extrabold text-xl flex items-center justify-center shadow-xs">
                                                    0{paslon.candidate_number}
                                                </span>
                                                <span className="font-headline font-extrabold text-2xl text-[#204E2B]">
                                                    {paslon.percentage}%
                                                </span>
                                            </div>

                                            {/* Photo */}
                                            <div className="w-full h-40 rounded-xl bg-white border border-[#E1F2E2] overflow-hidden flex items-center justify-center relative shadow-xs">
                                                {paslon.photo_path ? (
                                                    <img 
                                                        src={paslon.photo_path} 
                                                        alt={paslon.chairman_name}
                                                        className="w-full h-full object-cover object-top" 
                                                    />
                                                ) : (
                                                    <span className="text-xs text-[#727970] font-medium">Foto Paslon 0{paslon.candidate_number}</span>
                                                )}
                                            </div>

                                            {/* Names */}
                                            <div>
                                                <h3 className="font-headline font-bold text-base text-[#101F15]">
                                                    {paslon.chairman_name}
                                                </h3>
                                                <p className="text-xs font-semibold text-[#386641]">
                                                    & {paslon.vice_chairman_name}
                                                </p>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-1">
                                                <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#E1F2E2]">
                                                    <div 
                                                        className="h-full bg-[#386641] rounded-full transition-all duration-700"
                                                        style={{ width: `${paslon.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-[11px] text-[#727970] font-medium">
                                                    <span>Total Suara:</span>
                                                    <span className="font-bold text-[#101F15]">{paslon.vote_count} Suara</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Partisipasi per Angkatan */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-sm space-y-4">
                            <h3 className="font-headline font-bold text-base text-[#101F15]">
                                Partisipasi Pemilih per Tingkat Kelas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {grade_stats.map((g) => (
                                    <div key={g.grade} className="bg-[#F4F7F4] p-4 rounded-2xl border border-[#E1F2E2] space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-headline font-bold text-sm text-[#101F15]">Kelas {g.grade}</span>
                                            <span className="font-bold text-xs text-[#386641]">{g.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E1F2E2]">
                                            <div 
                                                className="h-full bg-[#386641] rounded-full transition-all duration-500"
                                                style={{ width: `${g.percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[11px] text-[#727970] text-right">
                                            {g.voted} dari {g.total} Siswa
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="w-full text-center py-4 border-t border-[#E1F2E2] text-xs text-[#727970]">
                &copy; {new Date().getFullYear()} KPU PPTS {setting?.school_name || 'SMA TAMANSISWA MOJOKERTO'}
            </footer>
        </div>
    );
}
