import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Compass, 
    ShieldAlert, 
    Clock, 
    AlertTriangle, 
    ServerOff, 
    AlertCircle, 
    Home, 
    RefreshCw, 
    LogIn, 
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

export default function ErrorPage({ status = 404, message = null }) {
    const errorConfigs = {
        404: {
            title: 'Halaman Tidak Ditemukan',
            subtitle: 'Mohon maaf, halaman atau tautan yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL salah ketik.',
            icon: Compass,
            badge: '404 NOT FOUND',
            badgeBg: 'bg-[#E6F8E8] text-[#204E2B] border-[#C2E9C6]',
            iconBg: 'bg-[#E6F8E8] text-[#386641]',
        },
        403: {
            title: 'Akses Ditolak / Dilarang',
            subtitle: 'Anda tidak memiliki hak otorisasi atau izin akses untuk membuka halaman ini. Silakan periksa kembali hak akses akun Anda.',
            icon: ShieldAlert,
            badge: '403 FORBIDDEN',
            badgeBg: 'bg-[#FFDAD6] text-[#93000A] border-[#FFB4AB]',
            iconBg: 'bg-[#FFDAD6] text-[#BA1A1A]',
        },
        419: {
            title: 'Sesi Halaman Kedaluwarsa',
            subtitle: 'Masa berlaku sesi atau token keamanan halaman ini telah berakhir karena tidak ada aktivitas. Silakan muat ulang halaman untuk memperbarui sesi.',
            icon: Clock,
            badge: '419 SESSION EXPIRED',
            badgeBg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
            iconBg: 'bg-[#FEF3C7] text-[#D97706]',
        },
        500: {
            title: 'Terjadi Kendala pada Server',
            subtitle: 'Sistem mengalami kendala teknis internal yang tidak terduga saat memproses data. Tim teknis sedang menangani kendala ini.',
            icon: AlertTriangle,
            badge: '500 INTERNAL SERVER ERROR',
            badgeBg: 'bg-[#FFDAD6] text-[#93000A] border-[#FFB4AB]',
            iconBg: 'bg-[#FFDAD6] text-[#BA1A1A]',
        },
        503: {
            title: 'Sistem Sedang Pemeliharaan',
            subtitle: 'Layanan Pemilu PPTS saat ini sedang dalam proses pemeliharaan berkala atau peningkatan kapasitas server. Silakan coba kembali dalam beberapa saat.',
            icon: ServerOff,
            badge: '503 SERVICE UNAVAILABLE',
            badgeBg: 'bg-[#E6F8E8] text-[#204E2B] border-[#C2E9C6]',
            iconBg: 'bg-[#E6F8E8] text-[#386641]',
        },
    };

    const config = errorConfigs[status] || {
        title: 'Terjadi Kesalahan',
        subtitle: message || 'Terjadi kesalahan sistem saat memproses permintaan Anda.',
        icon: AlertCircle,
        badge: `${status} ERROR`,
        badgeBg: 'bg-[#F4F7F4] text-[#414941] border-[#E1F2E2]',
        iconBg: 'bg-[#F4F7F4] text-[#386641]',
    };

    const IconComponent = config.icon;

    return (
        <div className="min-h-screen bg-[#F4F7F4] text-[#101F15] font-body flex flex-col justify-between selection:bg-[#386641]/20">
            <Head title={`${status} - ${config.title}`} />

            {/* Official Civic Header */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E1F2E2] shadow-xs px-4 sm:px-8 py-3.5">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo Sekolah" 
                            className="h-10 w-10 object-contain drop-shadow-xs"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                            <span className="font-headline font-extrabold text-[#204E2B] text-base sm:text-lg tracking-tight block leading-tight">
                                PEMILU PPTS
                            </span>
                            <span className="text-[11px] font-semibold text-[#727970] block">
                                SMA TAMANSISWA MOJOKERTO
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F] bg-[#E6F8E8] px-3 py-1.5 rounded-xl border border-[#C2E9C6]">
                        <ShieldCheck className="w-4 h-4 text-[#386641]" />
                        <span className="hidden sm:inline">Sistem Bilik Suara Digital</span>
                        <span className="sm:hidden">Sistem Resmi</span>
                    </div>
                </div>
            </header>

            {/* Error Body Card */}
            <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
                <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#E1F2E2] shadow-xl shadow-[#386641]/5 text-center space-y-6 animate-scale-up">
                    
                    {/* Status Code Large Display & Icon */}
                    <div className="space-y-4">
                        <div className={`w-20 h-20 rounded-3xl ${config.iconBg} flex items-center justify-center mx-auto shadow-sm`}>
                            <IconComponent className="w-10 h-10" />
                        </div>

                        <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${config.badgeBg} mb-2`}>
                                {config.badge}
                            </span>
                            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#101F15] tracking-tight leading-snug">
                                {config.title}
                            </h1>
                        </div>

                        <p className="text-sm text-[#414941] leading-relaxed max-w-md mx-auto">
                            {config.subtitle}
                        </p>

                        {/* Optional Custom Error Details if available */}
                        {message && message !== config.subtitle && (
                            <div className="bg-[#F4F7F4] border border-[#E1F2E2] rounded-2xl p-3 text-xs text-[#727970] font-mono break-words text-left">
                                <span className="font-bold text-[#101F15] block mb-1">Rincian Tambahan:</span>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/"
                            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-bold text-sm shadow-md shadow-[#386641]/20 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Home className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-[#204E2B] font-headline font-bold text-sm border border-[#E1F2E2] transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Muat Ulang</span>
                        </button>
                    </div>

                    {/* Secondary Link for Login */}
                    <div className="pt-2 border-t border-[#E1F2E2]">
                        <Link 
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#386641] hover:text-[#204E2B] hover:underline"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Menuju Halaman Masuk Bilik Suara</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Civic Footer */}
            <footer className="py-6 px-4 text-center border-t border-[#E1F2E2] bg-white/60">
                <p className="text-xs text-[#727970]">
                    &copy; {new Date().getFullYear()} Sistem Pemilu PPTS • SMA Tamansiswa Mojokerto. Seluruh hak cipta dilindungi.
                </p>
            </footer>
        </div>
    );
}
