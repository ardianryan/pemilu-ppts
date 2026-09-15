import React, { useState } from 'react';
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
    Search,
    Filter,
    Upload,
    UserCheck,
    GraduationCap,
    Briefcase
} from 'lucide-react';

export default function Dashboard({ metrics, candidates, gender_stats = [], grade_stats = [], class_stats = [], setting }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const handleRefresh = () => {
        router.reload({ only: ['metrics', 'candidates', 'gender_stats', 'grade_stats', 'class_stats'] });
    };

    // Find current leader
    const leader = candidates && candidates.length > 0 
        ? [...candidates].sort((a, b) => b.vote_count - a.vote_count)[0] 
        : null;

    // Filter class_stats by search & category tab
    const filteredClassStats = class_stats.filter((c) => {
        const matchesSearch = c.class_room.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        if (filterCategory === 'SISWA') {
            return ['X', 'XI', 'XII'].includes(c.grade);
        } else if (filterCategory === 'GURU_TENDIK') {
            return ['GURU', 'TENDIK'].includes(c.grade);
        }
        return true;
    });

    return (
        <AdminLayout title="Dashboard & Live Quick Count">
            <Head title="Admin Dashboard - Pemilu PPTS" />

            <div className="space-y-8">
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E1F2E2] shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#386641] animate-ping"></div>
                        <span className="font-headline font-bold text-sm text-[#101F15]">
                            Pemantauan Suara Real-time (Live Count PPTS)
                        </span>
                        <span className="text-xs text-[#727970] hidden sm:inline">
                            • Diperbarui secara otomatis
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="px-3.5 py-2 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-xs font-semibold text-[#414941] transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Perbarui Data</span>
                        </button>

                        <Link
                            href={route('admin.voters.index')}
                            className="px-3.5 py-2 rounded-xl bg-[#E6F8E8] hover:bg-[#D5E7D7] text-xs font-semibold text-[#204E2B] transition flex items-center gap-1.5"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Kelola DPT</span>
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
                            <span className="text-[11px] text-[#727970]">Pemilih belum mencoblos</span>
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
                                <span>Perolehan Suara Pasangan Calon (Quick Count)</span>
                            </h2>
                            <p className="text-xs text-[#727970]">
                                Perolehan suara sah berdasarkan transaksi database terenkripsi
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

                {/* 2-Column Section: Gender Breakdown & Grade Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. Sebaran Berdasarkan Jenis Kelamin */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E1F2E2] shadow-xs space-y-4">
                        <div className="border-b border-[#E1F2E2] pb-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-headline font-bold text-base text-[#101F15] flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-[#386641]" />
                                    <span>Sebaran Suara per Jenis Kelamin</span>
                                </h3>
                                <span className="text-xs text-[#727970]">
                                    Partisipasi suara pemilih Laki-Laki (L) dan Perempuan (P)
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gender_stats.map((g) => (
                                <div key={g.gender} className="bg-[#F4F7F4] p-4 rounded-2xl border border-[#E1F2E2] space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-headline font-bold text-sm text-[#101F15]">
                                            {g.label}
                                        </span>
                                        <span className="font-bold text-xs text-[#386641] bg-[#E6F8E8] px-2.5 py-0.5 rounded-full border border-[#A7C957]/40">
                                            {g.percentage}% Suara Masuk
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#E1F2E2]">
                                            <div
                                                className="h-full bg-[#386641] rounded-full transition-all duration-500"
                                                style={{ width: `${g.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-[#E1F2E2]/60">
                                        <div>
                                            <span className="text-[10px] text-[#727970] block uppercase">Total DPT</span>
                                            <span className="font-bold text-[#101F15]">{g.total}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#2D6A4F] block uppercase font-bold">Memilih</span>
                                            <span className="font-bold text-[#204E2B]">{g.voted}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#BA1A1A] block uppercase">Belum</span>
                                            <span className="font-bold text-[#93000A]">{g.not_voted}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Sebaran Berdasarkan Kategori / Angkatan */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E1F2E2] shadow-xs space-y-4">
                        <div className="border-b border-[#E1F2E2] pb-3">
                            <h3 className="font-headline font-bold text-base text-[#101F15] flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-[#386641]" />
                                <span>Partisipasi Berdasarkan Kategori</span>
                            </h3>
                            <span className="text-xs text-[#727970]">
                                Rekap suara masuk per angkatan (X, XI, XII), Guru Pamong, & Tendik
                            </span>
                        </div>

                        <div className="space-y-3">
                            {grade_stats.map((g) => (
                                <div key={g.grade} className="space-y-1 bg-[#F4F7F4] p-3 rounded-xl border border-[#E1F2E2]">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-[#101F15]">
                                            {g.grade === 'GURU' ? '👨‍🏫 Guru Pamong' : (g.grade === 'TENDIK' ? '💼 Staf Tata Usaha' : `Siswa Kelas ${g.grade}`)}
                                        </span>
                                        <span className="text-[#414941] font-semibold">
                                            {g.voted} / {g.total} Suara ({g.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#E1F2E2]">
                                        <div
                                            className="h-full bg-[#386641] rounded-full transition-all duration-500"
                                            style={{ width: `${g.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Class & Staff Breakdown Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1F2E2] shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1F2E2] pb-4">
                        <div>
                            <h3 className="font-headline font-extrabold text-lg text-[#101F15] flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#386641]" />
                                <span>Detail Sebaran Suara Masuk per Rombel & Guru</span>
                            </h3>
                            <p className="text-xs text-[#727970]">
                                Rincian lengkap jumlah pemilih, suara masuk, dan sisa per rombel kelas & pamong
                            </p>
                        </div>

                        {/* Search & Tabs Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 text-[#727970] absolute left-3" />
                                <input
                                    type="text"
                                    placeholder="Cari kelas / jabatan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-[#F4F7F4] text-xs rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none w-full sm:w-48"
                                />
                            </div>

                            <div className="inline-flex rounded-xl bg-[#F4F7F4] p-1 border border-[#E1F2E2] text-xs">
                                <button
                                    onClick={() => setFilterCategory('ALL')}
                                    className={`px-3 py-1 rounded-lg font-bold transition ${
                                        filterCategory === 'ALL' ? 'bg-[#386641] text-white shadow-xs' : 'text-[#727970] hover:text-[#101F15]'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setFilterCategory('SISWA')}
                                    className={`px-3 py-1 rounded-lg font-bold transition ${
                                        filterCategory === 'SISWA' ? 'bg-[#386641] text-white shadow-xs' : 'text-[#727970] hover:text-[#101F15]'
                                    }`}
                                >
                                    Siswa
                                </button>
                                <button
                                    onClick={() => setFilterCategory('GURU_TENDIK')}
                                    className={`px-3 py-1 rounded-lg font-bold transition ${
                                        filterCategory === 'GURU_TENDIK' ? 'bg-[#386641] text-white shadow-xs' : 'text-[#727970] hover:text-[#101F15]'
                                    }`}
                                >
                                    Guru & Staf
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Class Stats Grid / Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#F4F7F4] border-b border-[#E1F2E2] text-[#101F15] font-bold">
                                    <th className="py-3 px-4 rounded-l-xl">Rombel / Jabatan</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4 text-center">Total DPT</th>
                                    <th className="py-3 px-4 text-center">Suara Masuk</th>
                                    <th className="py-3 px-4 text-center">Belum Memilih</th>
                                    <th className="py-3 px-4 text-center">Progres %</th>
                                    <th className="py-3 px-4 rounded-r-xl">Status Partisipasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E1F2E2]">
                                {filteredClassStats.length > 0 ? (
                                    filteredClassStats.map((c) => (
                                        <tr key={c.class_room} className="hover:bg-[#F4F7F4]/50 transition">
                                            <td className="py-3 px-4 font-bold text-[#101F15]">
                                                {c.class_room}
                                            </td>
                                            <td className="py-3 px-4 text-[#727970]">
                                                <span className="px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#2D6A4F] text-[11px] font-semibold">
                                                    {c.grade}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-semibold text-[#101F15]">
                                                {c.total}
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold text-[#204E2B]">
                                                {c.voted}
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium text-[#BA1A1A]">
                                                {c.not_voted}
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold text-[#386641]">
                                                {c.percentage}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-[#F4F7F4] h-2 rounded-full overflow-hidden border border-[#E1F2E2]">
                                                        <div
                                                            className="h-full bg-[#386641] rounded-full"
                                                            style={{ width: `${c.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                        c.percentage === 100
                                                            ? 'bg-[#E6F8E8] text-[#2D6A4F]'
                                                            : c.percentage > 50
                                                            ? 'bg-[#BAEE99]/50 text-[#3D6924]'
                                                            : 'bg-[#F4F7F4] text-[#727970]'
                                                    }`}>
                                                        {c.percentage === 100 ? '100% Selesai' : (c.percentage > 0 ? 'Berjalan' : 'Belum')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-[#727970]">
                                            Tidak ada data rombel/kelas yang sesuai pencarian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
