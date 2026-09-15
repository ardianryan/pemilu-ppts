import React, { useState, useEffect } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Vote, 
    Award, 
    RefreshCw, 
    BarChart3, 
    Users, 
    UserX, 
    Activity, 
    Sparkles, 
    ExternalLink,
    Clock,
    CheckCircle2
} from 'lucide-react';

function QuickCountSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-5 border border-[#E1F2E2] space-y-2">
                        <div className="h-3 w-20 bg-[#E1F2E2] rounded-md"></div>
                        <div className="h-8 w-16 bg-[#D5E7D7] rounded-lg"></div>
                        <div className="h-3 w-24 bg-[#E1F2E2] rounded-md"></div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] space-y-6">
                <div className="h-6 w-48 bg-[#E1F2E2] rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl p-6 border border-[#E1F2E2] bg-[#F4F7F4] space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-12 h-12 rounded-2xl bg-[#E1F2E2]"></div>
                                <div className="h-6 w-16 bg-[#D5E7D7] rounded-full"></div>
                            </div>
                            <div className="w-full h-44 rounded-2xl bg-[#E1F2E2]"></div>
                            <div className="h-5 w-36 bg-[#E1F2E2] rounded-md"></div>
                            <div className="h-4 w-full bg-[#E1F2E2] rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function QuickCount({ metrics, candidates = [], setting }) {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let interval = null;
        if (autoRefresh) {
            // Auto refresh set to every 15 minutes (900,000 ms) to keep server light
            interval = setInterval(() => {
                router.reload({ only: ['metrics', 'candidates'] });
            }, 900000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({ 
            only: ['metrics', 'candidates'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    // Find leader candidate
    const sortedCandidates = [...candidates].sort((a, b) => b.vote_count - a.vote_count);
    const leader = sortedCandidates.length > 0 && sortedCandidates[0].vote_count > 0 ? sortedCandidates[0] : null;

    return (
        <AdminLayout title="Quick Count Live Perolehan Suara">
            <Head title="Quick Count - Admin Pemilu PPTS" />

            <div className="space-y-8">
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E1F2E2] shadow-xs">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F8E8] text-[#204E2B] flex items-center justify-center shrink-0">
                            <Vote className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-headline font-extrabold text-lg text-[#101F15]">
                                    Quick Count Perolehan Suara Paslon
                                </h2>
                                <span className="w-2.5 h-2.5 rounded-full bg-[#386641] animate-ping"></span>
                            </div>
                            <p className="text-xs text-[#727970]">
                                Hitung cepat perolehan suara Ketua & Wakil Ketua PPTS (Refresh otomatis 15 menit atau manual)
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F7F4] border border-[#E1F2E2] text-xs font-semibold text-[#101F15] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded text-[#386641] focus:ring-[#386641] accent-[#386641]"
                            />
                            <span>Auto Refresh (15 Menit)</span>
                        </label>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="px-4 py-2 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span>{isRefreshing ? 'Memperbarui...' : 'Refresh Suara Manual'}</span>
                        </button>

                        <a
                            href="/livecount"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-[#E6F8E8] hover:bg-[#D5E7D7] text-[#204E2B] text-xs font-bold transition flex items-center gap-1.5 border border-[#E1F2E2]"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Layar Publik</span>
                        </a>
                    </div>
                </div>

                <Deferred data={['metrics', 'candidates']} fallback={<QuickCountSkeleton />}>
                    {/* Core Stats Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#E6F8E8] text-[#204E2B] flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-[#727970] uppercase tracking-wider block">Total DPT</span>
                                <span className="font-headline font-extrabold text-2xl text-[#101F15] block">
                                    {(metrics?.total_voters ?? 0).toLocaleString('id-ID')}
                                </span>
                                <span className="text-[11px] text-[#727970]">Hak Suara Resmi</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#BAEE99]/50 text-[#3D6924] flex items-center justify-center shrink-0">
                                <Vote className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-[#386641] uppercase tracking-wider block">Suara Masuk (Sah)</span>
                                <span className="font-headline font-extrabold text-2xl text-[#204E2B] block">
                                    {(metrics?.total_voted ?? 0).toLocaleString('id-ID')}
                                </span>
                                <span className="text-[11px] font-bold text-[#2D6A4F]">Telah Mencoblos</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFDAD6]/60 text-[#BA1A1A] flex items-center justify-center shrink-0">
                                <UserX className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-[#BA1A1A] uppercase tracking-wider block">Belum Mencoblos</span>
                                <span className="font-headline font-extrabold text-2xl text-[#93000A] block">
                                    {(metrics?.total_not_voted ?? 0).toLocaleString('id-ID')}
                                </span>
                                <span className="text-[11px] text-[#727970]">Belum Menyalurkan</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#E6F8E8] text-[#2D6A4F] flex items-center justify-center shrink-0">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-[#727970] uppercase tracking-wider block">Partisipasi</span>
                                <span className="font-headline font-extrabold text-2xl text-[#2D6A4F] block">
                                    {metrics?.turnout_percentage ?? 0}%
                                </span>
                                <span className="text-[11px] font-semibold text-[#2D6A4F]">Progres Suara</span>
                            </div>
                        </div>
                    </div>

                {/* Main Quick Count Cards Grid */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1F2E2] pb-5">
                        <div>
                            <span className="text-xs font-bold text-[#386641] uppercase tracking-wider block mb-0.5">
                                REKAPITULASI LIVE COUNT
                            </span>
                            <h3 className="font-headline font-extrabold text-xl text-[#101F15]">
                                Perolehan Suara Pasangan Calon
                            </h3>
                        </div>

                        {leader && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E6F8E8] border border-[#A7C957]/50 text-[#204E2B] text-xs font-bold shadow-xs">
                                <Award className="w-4.5 h-4.5 text-[#386641]" />
                                <span>Unggul Sementara: Paslon 0{leader.candidate_number} ({leader.percentage}%)</span>
                            </div>
                        )}
                    </div>

                    {/* Candidate List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {candidates.map((paslon) => {
                            const isLead = leader && leader.id === paslon.id;

                            return (
                                <div
                                    key={paslon.id}
                                    className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                                        isLead
                                            ? 'bg-gradient-to-b from-[#E6F8E8] via-white to-white border-[#386641] shadow-md ring-2 ring-[#386641]/20'
                                            : 'bg-[#F4F7F4] border-[#E1F2E2]'
                                    }`}
                                >
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <span className={`w-12 h-12 rounded-2xl font-headline font-extrabold text-2xl flex items-center justify-center shadow-xs ${
                                                isLead ? 'bg-[#386641] text-white' : 'bg-white text-[#101F15] border border-[#E1F2E2]'
                                            }`}>
                                                0{paslon.candidate_number}
                                            </span>

                                            {isLead ? (
                                                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#386641] text-white flex items-center gap-1 shadow-xs">
                                                    <Award className="w-3.5 h-3.5" />
                                                    <span>Unggul</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-[#727970] px-3 py-1 rounded-full bg-white border border-[#E1F2E2]">
                                                    Paslon 0{paslon.candidate_number}
                                                </span>
                                            )}
                                        </div>

                                        {/* Photo if available */}
                                        {paslon.photo_path && (
                                            <div className="w-full h-44 rounded-2xl bg-white border border-[#E1F2E2] overflow-hidden shadow-xs">
                                                <img 
                                                    src={paslon.photo_path} 
                                                    alt={paslon.chairman_name}
                                                    className="w-full h-full object-cover object-top" 
                                                />
                                            </div>
                                        )}

                                        {/* Names */}
                                        <div>
                                            <h4 className="font-headline font-extrabold text-lg text-[#101F15] leading-snug">
                                                {paslon.chairman_name}
                                            </h4>
                                            <p className="text-xs font-bold text-[#386641] mt-0.5">
                                                & {paslon.vice_chairman_name}
                                            </p>
                                            {paslon.tagline && (
                                                <p className="text-xs italic text-[#727970] mt-1 line-clamp-1">
                                                    "{paslon.tagline}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vote Tally & Progress */}
                                    <div className="space-y-2.5 pt-3 border-t border-[#E1F2E2]/80">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-headline font-extrabold text-3xl text-[#204E2B]">
                                                {paslon.percentage}%
                                            </span>
                                            <span className="font-headline font-bold text-base text-[#101F15]">
                                                {paslon.vote_count.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#727970]">Suara</span>
                                            </span>
                                        </div>

                                        <div className="w-full bg-white h-4 rounded-full overflow-hidden border border-[#E1F2E2] p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${
                                                    isLead ? 'bg-[#386641]' : 'bg-[#6A994E]'
                                                }`}
                                                style={{ width: `${Math.max(paslon.percentage, 1)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                </Deferred>
            </div>
        </AdminLayout>
    );
}
