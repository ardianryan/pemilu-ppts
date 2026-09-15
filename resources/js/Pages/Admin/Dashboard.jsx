import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Users, 
    Vote, 
    UserX, 
    Activity, 
    TrendingUp, 
    Award, 
    CheckCircle2, 
    Clock, 
    ExternalLink,
    RefreshCw,
    Plus,
    Upload
} from 'lucide-react';

export default function Dashboard({ metrics, candidates, grade_stats, class_stats, setting }) {
    const handleRefresh = () => {
        router.reload({ only: ['metrics', 'candidates', 'grade_stats', 'class_stats'] });
    };

    // Find current leader
    const leader = candidates && candidates.length > 0 
        ? [...candidates].sort((a, b) => b.vote_count - a.vote_count)[0] 
        : null;

    return (
        <AdminLayout title="Dashboard & Live Quick Count">
            <Head title="Admin Dashboard - Pilketos" />

            <div className="space-y-8">
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E1F2E2] shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#386641] animate-ping"></div>
                        <span className="font-headline font-bold text-sm text-[#101F15]">
                            Pemantauan Suara Real-time (Live Count)
                        </span>
                        <span className="text-xs text-[#727970] hidden sm:inline">
                            • Diperbarui secara otomatis
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="px-3.5 py-2 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-xs font-semibold text-[#414941] transition flex items-center gap-1.5"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Perbarui Data</span>
                        </button>

                        <Link
                            href={route('admin.voters.index')}
                            className="px-3.5 py-2 rounded-xl bg-[#E6F8E8] hover:bg-[#D5E7D7] text-xs font-semibold text-[#204E2B] transition flex items-center gap-1.5"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Import DPT</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Core Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Metric 1: Total DPT */}
                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F8E8] text-[#204E2B] flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#727970] uppercase tracking-wider block">
                                Total DPT Terdaftar
                            </span>
                            <span className="font-headline font-extrabold text-2xl text-[#101F15] block">
                                {metrics.total_voters.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] text-[#727970]">Hak suara terverifikasi</span>
                        </div>
                    </div>

                    {/* Metric 2: Suara Masuk */}
                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#BAEE99]/50 text-[#3D6924] flex items-center justify-center shrink-0">
                            <Vote className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#727970] uppercase tracking-wider block">
                                Suara Masuk (Sah)
                            </span>
                            <span className="font-headline font-extrabold text-2xl text-[#204E2B] block">
                                {metrics.total_voted.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] font-semibold text-[#2D6A4F]">
                                {metrics.turnout_percentage}% Partisipasi
                            </span>
                        </div>
                    </div>

                    {/* Metric 3: Belum Memilih */}
                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F4F7F4] text-[#727970] flex items-center justify-center shrink-0">
                            <UserX className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#727970] uppercase tracking-wider block">
                                Belum Memilih
                            </span>
                            <span className="font-headline font-extrabold text-2xl text-[#101F15] block">
                                {metrics.total_not_voted.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] text-[#727970]">Siswa dalam antrean</span>
                        </div>
                    </div>

                    {/* Metric 4: Status Bilik Suara */}
                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            setting?.is_voting_active 
                                ? 'bg-[#E6F8E8] text-[#2D6A4F]' 
                                : 'bg-[#FFDAD6] text-[#BA1A1A]'
                        }`}>
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#727970] uppercase tracking-wider block">
                                Status Bilik Suara
                            </span>
                            <span className={`font-headline font-extrabold text-xl block ${
                                setting?.is_voting_active ? 'text-[#2D6A4F]' : 'text-[#BA1A1A]'
                            }`}>
                                {setting?.is_voting_active ? 'TERBUKA / AKTIF' : 'DITUTUP'}
                            </span>
                            <Link href={route('admin.settings.index')} className="text-[11px] text-[#386641] hover:underline font-semibold">
                                Ubah status
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Candidate Live Count Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1F2E2] shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1F2E2] pb-4">
                        <div>
                            <h2 className="font-headline font-extrabold text-lg text-[#101F15] flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#386641]" />
                                <span>Perolehan Suara Pasangan Calon</span>
                            </h2>
                            <p className="text-xs text-[#727970]">
                                Total perolehan suara sah berdasarkan transaksi database terenkripsi
                            </p>
                        </div>

                        {leader && leader.vote_count > 0 && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F8E8] border border-[#A7C957]/50 text-[#204E2B] text-xs font-bold">
                                <Award className="w-4 h-4 text-[#386641]" />
                                <span>Unggul Sementara: Paslon 0{leader.candidate_number} ({leader.percentage}%)</span>
                            </div>
                        )}
                    </div>

                    {/* Candidate Progress Bars */}
                    <div className="space-y-6">
                        {candidates.map((paslon) => {
                            const isLead = leader && leader.id === paslon.id && paslon.vote_count > 0;

                            return (
                                <div key={paslon.id} className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-xl bg-[#E6F8E8] text-[#204E2B] font-headline font-extrabold text-base flex items-center justify-center shrink-0">
                                                0{paslon.candidate_number}
                                            </span>
                                            <div>
                                                <h3 className="font-headline font-bold text-sm sm:text-base text-[#101F15]">
                                                    {paslon.chairman_name} & {paslon.vice_chairman_name}
                                                </h3>
                                                <span className="text-xs text-[#727970] italic">
                                                    "{paslon.tagline || '-'}"
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="font-headline font-extrabold text-lg sm:text-xl text-[#204E2B] block">
                                                {paslon.vote_count} <span className="text-xs font-normal text-[#727970]">Suara</span>
                                            </span>
                                            <span className="text-xs font-bold text-[#386641]">
                                                {paslon.percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar Track */}
                                    <div className="w-full bg-[#F4F7F4] h-4 rounded-full overflow-hidden p-0.5 border border-[#E1F2E2]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${
                                                isLead ? 'bg-[#386641]' : 'bg-[#6A994E]'
                                            }`}
                                            style={{ width: `${Math.max(paslon.percentage, 1)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2-Column: Turnout by Grade & Class */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grade Stats */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E1F2E2] shadow-xs space-y-4">
                        <div className="border-b border-[#E1F2E2] pb-3">
                            <h3 className="font-headline font-bold text-base text-[#101F15]">
                                Partisipasi Berdasarkan Tingkat
                            </h3>
                            <span className="text-xs text-[#727970]">
                                Rekap kehadiran per angkatan kelas
                            </span>
                        </div>

                        <div className="space-y-4">
                            {grade_stats.map((g) => (
                                <div key={g.grade} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-[#101F15]">Kelas {g.grade}</span>
                                        <span className="text-[#414941]">
                                            {g.voted} dari {g.total} siswa ({g.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#F4F7F4] h-2.5 rounded-full overflow-hidden border border-[#E1F2E2]">
                                        <div
                                            className="h-full bg-[#386641] rounded-full transition-all duration-500"
                                            style={{ width: `${g.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class Stats Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E1F2E2] shadow-xs space-y-4">
                        <div className="border-b border-[#E1F2E2] pb-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-headline font-bold text-base text-[#101F15]">
                                    Kehadiran per Rombel Kelas
                                </h3>
                                <span className="text-xs text-[#727970]">
                                    Tinjauan progres pencoblosan tiap rombel
                                </span>
                            </div>
                            <Link href={route('admin.voters.index')} className="text-xs font-semibold text-[#386641] hover:underline">
                                Lihat DPT Lengkap ➜
                            </Link>
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                            {class_stats.map((c) => (
                                <div key={c.class_room} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F4] text-xs">
                                    <span className="font-bold text-[#101F15]">{c.class_room}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#727970]">{c.voted}/{c.total}</span>
                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                            c.percentage === 100 
                                                ? 'bg-[#E6F8E8] text-[#2D6A4F]' 
                                                : c.percentage > 50 
                                                ? 'bg-[#BAEE99]/50 text-[#3D6924]' 
                                                : 'bg-white text-[#727970] border border-[#E1F2E2]'
                                        }`}>
                                            {c.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
