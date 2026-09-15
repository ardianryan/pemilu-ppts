import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    CheckCircle2, 
    ShieldCheck, 
    Lock, 
    ArrowRight, 
    Award, 
    Clock, 
    Fingerprint, 
    FileText 
} from 'lucide-react';

export default function VotingReceipt({ receipt }) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown <= 0) {
            router.visit(route('login'));
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleImmediateExit = () => {
        router.visit(route('login'));
    };

    const progressPercentage = ((5 - countdown) / 5) * 100;

    return (
        <div className="min-h-screen bg-[#F4F7F4] flex flex-col items-center justify-center p-4 selection:bg-[#386641]/20 font-body text-[#101F15]">
            <Head title="Bukti Suara Sah - Pilketos Digital" />

            <div className="w-full max-w-[480px] space-y-6">
                {/* Celebration & Animated Checkmark */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative flex items-center justify-center w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-[#E6F8E8] animate-ping opacity-60"></div>
                        <div className="absolute inset-2 rounded-full bg-[#BAEE99]/50 opacity-80"></div>
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[#204E2B] text-white shadow-lg">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E6F8E8] text-[#2D6A4F] font-bold text-xs border border-[#E1F2E2]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SUARA SAH & TERCATAT</span>
                    </div>

                    <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#101F15] tracking-tight">
                        Suara Anda Berhasil Disimpan!
                    </h1>
                    <p className="text-xs sm:text-sm text-[#414941] max-w-xs leading-relaxed">
                        Terima kasih telah menunaikan hak suara Anda secara jujur, mandiri, dan bertanggung jawab.
                    </p>
                </div>

                {/* Digital Receipt Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#E1F2E2] space-y-4">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                        <div className="flex items-center gap-2.5">
                            <img 
                                src="/images/logo2.png" 
                                alt="Logo" 
                                className="w-7 h-7 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                                <span className="text-[10px] font-bold text-[#727970] uppercase tracking-wider block">
                                    TANDA TERIMA DIGITAL
                                </span>
                                <span className="font-headline font-bold text-xs sm:text-sm text-[#204E2B]">
                                    PILKETOS RESMI 2025/2026
                                </span>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-[#E6F8E8] text-[#204E2B] border border-[#E1F2E2] font-mono text-[11px] font-bold">
                            TERVERIFIKASI
                        </span>
                    </div>

                    {/* Receipt Metadata */}
                    <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-[#F4F7F4]">
                            <span className="text-[#727970]">Nama Pemilih</span>
                            <span className="font-semibold text-[#101F15]">{receipt?.voter_name || 'Siswa Pemilih'}</span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#F4F7F4]">
                            <span className="text-[#727970]">Nomor Token Bukti</span>
                            <span className="font-mono font-bold bg-[#E6F8E8] text-[#204E2B] px-2 py-0.5 rounded-md">
                                {receipt?.token_code || 'PLK-2025-XXXX'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#F4F7F4]">
                            <span className="text-[#727970]">Waktu Rekam Presisi</span>
                            <span className="font-semibold text-[#101F15]">{receipt?.voted_at || 'Baru saja'}</span>
                        </div>

                        <div className="flex justify-between items-start py-1 border-b border-[#F4F7F4]">
                            <span className="text-[#727970]">Enkripsi SHA-256</span>
                            <div className="text-right">
                                <span className="font-mono text-[10px] text-[#727970] truncate max-w-[170px] block">
                                    {receipt?.sha_proof ? receipt.sha_proof.substring(0, 24) + '...' : 'e7b4a2...98c14f'}
                                </span>
                                <span className="text-[10px] font-bold text-[#2D6A4F] inline-flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Terenkripsi Penuh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Digital Seal */}
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#E6F8E8] border border-[#A7C957]/30 text-xs text-[#204E2B]">
                        <Award className="w-5 h-5 text-[#386641] shrink-0" />
                        <div className="leading-tight">
                            <span className="font-bold block">Tanda Tangan Kriptografi Sah</span>
                            <span className="text-[10px] text-[#414941]">Otentikasi KPU OSIS Berhasil</span>
                        </div>
                    </div>
                </div>

                {/* Auto Logout & Reset Card */}
                <div className="bg-[#E6F8E8] rounded-3xl p-5 border border-[#E1F2E2] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[#414941] font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#386641]" />
                            <span>Membersihkan bilik suara otomatis dalam:</span>
                        </span>
                        <span className="font-headline font-extrabold text-base text-[#204E2B] font-mono">
                            0{countdown} detik
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#D5E7D7] h-2 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#386641] transition-all duration-1000 ease-linear rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    <p className="text-[11px] text-[#727970] text-center">
                        Demi menjaga kerahasiaan bilik suara, sesi Anda akan ditutup agar pemilih berikutnya dapat masuk.
                    </p>

                    {/* Immediate Exit Button */}
                    <button
                        type="button"
                        onClick={handleImmediateExit}
                        className="w-full py-3 px-4 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Selesai / Pemilih Berikutnya</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
