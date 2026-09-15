import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import GsapModal from '@/Components/GsapModal';
import GsapSheet from '@/Components/GsapSheet';
import { 
    Vote, 
    ShieldCheck, 
    CheckCircle2, 
    AlertTriangle, 
    X, 
    Eye, 
    Timer, 
    User, 
    Check, 
    LogOut,
    Sparkles,
    ChevronRight,
    HelpCircle
} from 'lucide-react';

export default function VotingIndex({ voter, candidates, setting }) {
    const [currentStep, setCurrentStep] = useState(1); // 1: Identitas, 2: Bilik Suara
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalManifesto, setModalManifesto] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 menit hitung mundur

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            alert('Waktu bilik suara telah habis. Sesi Anda akan dialihkan ke halaman login.');
            router.post(route('logout'));
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleSelect = (candidate) => {
        // Trigger haptic vibration on mobile
        if (navigator.vibrate) {
            navigator.vibrate(40);
        }
        setSelectedCandidate(candidate);
    };

    const handleConfirmSubmit = () => {
        if (!selectedCandidate || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(null);

        router.post(route('voting.store'), {
            candidate_id: selectedCandidate.id,
        }, {
            preserveScroll: true,
            onError: (err) => {
                setIsSubmitting(false);
                setSubmitError(err.candidate_id || err.message || 'Terjadi kesalahan saat memproses suara.');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleCancelSession = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari bilik suara? Suara Anda belum tersimpan.')) {
            router.post(route('logout'));
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7F4] text-[#101F15] font-body flex flex-col justify-between selection:bg-[#386641]/20 pb-28">
            <Head title="Bilik Suara Digital - Pemilu PPTS" />

            {/* Official Civic Top Header (Slim & Uncluttered) */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E1F2E2] shadow-xs px-4 sm:px-8 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo Sekolah" 
                            className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-xs"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                            <h1 className="font-headline font-extrabold text-[#204E2B] text-base sm:text-lg tracking-tight leading-none">
                                PEMILU PPTS
                            </h1>
                            <span className="text-[11px] font-semibold text-[#727970] block mt-0.5">
                                {setting?.school_name || 'SMA TAMANSISWA MOJOKERTO'}
                            </span>
                        </div>
                    </div>

                    {/* Center: Wizard Stepper */}
                    <div className="hidden md:flex items-center gap-2 bg-[#F4F7F4] px-3 py-1.5 rounded-xl border border-[#E1F2E2]">
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold transition ${
                            currentStep === 1 
                                ? 'bg-[#386641] text-white shadow-xs' 
                                : 'text-[#2D6A4F]'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">1</span>
                            <span>Konfirmasi Identitas</span>
                        </div>
                        <span className="text-[#727970] text-xs font-bold">›</span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold transition ${
                            currentStep === 2 
                                ? 'bg-[#386641] text-white shadow-xs' 
                                : 'text-[#727970]'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-black/10 text-center text-[10px] leading-4">2</span>
                            <span>Pilih Paslon</span>
                        </div>
                        <span className="text-[#727970] text-xs font-bold">›</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold text-[#727970] opacity-50">
                            <span className="w-4 h-4 rounded-full bg-black/10 text-center text-[10px] leading-4">3</span>
                            <span>Selesai</span>
                        </div>
                    </div>

                    {/* Right: Timer & Cancel */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-[#F4F7F4] border border-[#E1F2E2] text-[#204E2B] px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                            <Timer className="w-4 h-4 text-[#386641]" />
                            <span>{formatTimer(timeLeft)}</span>
                        </div>
                        <button
                            onClick={handleCancelSession}
                            title="Batalkan sesi dan keluar"
                            className="p-2 text-[#727970] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 rounded-xl transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* STEP 1: Konfirmasi Identitas Pemilih */}
            {currentStep === 1 && (
                <main className="max-w-2xl mx-auto w-full px-4 py-8 flex-1 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-xl w-full space-y-6 animate-scale-up">
                        <div className="text-center space-y-2 border-b border-[#E1F2E2] pb-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#E6F8E8] text-[#386641] flex items-center justify-center mx-auto shadow-xs">
                                <User className="w-7 h-7" />
                            </div>
                            <h2 className="font-headline font-extrabold text-xl text-[#101F15]">
                                Langkah 1 dari 3: Konfirmasi Identitas Pemilih
                            </h2>
                            <p className="text-xs text-[#727970]">
                                Silakan periksa data identitas diri Anda di bawah ini sebelum melanjutkan ke bilik suara.
                            </p>
                        </div>

                        {/* Summary Data Card */}
                        <div className="bg-[#F4F7F4] rounded-2xl p-5 border border-[#E1F2E2] space-y-3">
                            <div className="flex items-center justify-between border-b border-[#E1F2E2] pb-2.5">
                                <span className="text-xs text-[#727970] font-medium">Nama Pemilih:</span>
                                <span className="font-headline font-bold text-sm text-[#101F15] text-right">{voter.name}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E1F2E2] pb-2.5">
                                <span className="text-xs text-[#727970] font-medium">Kelas / Jabatan:</span>
                                <span className="font-bold text-xs bg-[#E6F8E8] text-[#204E2B] px-2.5 py-1 rounded-md">{voter.class_room}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E1F2E2] pb-2.5">
                                <span className="text-xs text-[#727970] font-medium">Kategori Pemilih:</span>
                                <span className="font-semibold text-xs text-[#101F15]">
                                    {voter.grade === 'GURU' ? 'Guru Pamong' : voter.grade === 'TENDIK' ? 'Tenaga Kependidikan' : `Kelas ${voter.grade}`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E1F2E2] pb-2.5">
                                <span className="text-xs text-[#727970] font-medium">Kode Akses / Token:</span>
                                <span className="font-mono font-semibold text-xs text-[#101F15]">{voter.nisn} / {voter.token}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs text-[#727970] font-medium">Status Hak Suara:</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F]">
                                    <ShieldCheck className="w-4 h-4 text-[#386641]" />
                                    <span>1 Suara Aktif</span>
                                </span>
                            </div>
                        </div>

                        {/* CTA Next Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="w-full h-13 rounded-2xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-extrabold text-base shadow-lg shadow-[#386641]/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Ya, Benar. Lanjutkan</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {/* STEP 2: Bilik Suara & Pemilihan Paslon */}
            {currentStep === 2 && (
                <>
                    {/* Instruction Alert Banner */}
                    <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-2">
                        <div className="bg-white border border-[#E1F2E2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#E6F8E8] text-[#386641] flex items-center justify-center shrink-0">
                                    <Vote className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-headline font-bold text-sm sm:text-base text-[#101F15]">
                                        Langkah 2 dari 3: Sentuh Salah Satu Kartu Paslon Untuk Memilih
                                    </h2>
                                    <p className="text-xs text-[#414941]">
                                        Pemilih: <strong>{voter.name}</strong> ({voter.class_room}) • Sentuh kartu kandidat pilihanmu, lalu kunci pilihan.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
                                <ShieldCheck className="w-4 h-4 text-[#386641]" />
                                <span>Dijamin Asas RAHASIA</span>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Cards Grid */}
                    <main className="max-w-6xl mx-auto w-full px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {candidates.map((paslon) => {
                                const isSelected = selectedCandidate?.id === paslon.id;
                                const isDimmed = selectedCandidate && !isSelected;

                                return (
                                    <div
                                        key={paslon.id}
                                        onClick={() => handleSelect(paslon)}
                                        className={`group relative bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border-2 select-none ${
                                            isSelected
                                                ? 'border-[#386641] shadow-xl ring-4 ring-[#A7C957]/40 scale-[1.02] z-10'
                                                : isDimmed
                                                ? 'border-[#E1F2E2] opacity-60 hover:opacity-90 hover:border-[#6A994E]'
                                                : 'border-[#E1F2E2] hover:border-[#6A994E] shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        <div>
                                            {/* Header Card Paslon */}
                                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E1F2E2]">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-12 h-12 rounded-2xl bg-[#E6F8E8] text-[#204E2B] font-headline font-extrabold text-2xl flex items-center justify-center shadow-xs">
                                                        {String(paslon.candidate_number).padStart(2, '0')}
                                                    </span>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-[#727970] uppercase tracking-wider block">
                                                            PASLON NOMOR URUT
                                                        </span>
                                                        <span className="font-headline font-bold text-sm text-[#101F15]">
                                                            Kandidat 0{paslon.candidate_number}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                    isSelected 
                                                        ? 'bg-[#386641] text-white shadow-sm scale-110' 
                                                        : 'bg-[#F4F7F4] text-[#727970] group-hover:bg-[#E1F2E2]'
                                                }`}>
                                                    {isSelected ? (
                                                        <Check className="w-5 h-5 stroke-[3]" />
                                                    ) : (
                                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#727970]/50"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Single Paslon Photo Container */}
                                            <div className="w-full h-48 sm:h-56 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2] overflow-hidden relative flex items-center justify-center shadow-inner group-hover:border-[#6A994E]/40 transition my-2">
                                                {paslon.photo_path ? (
                                                    <img 
                                                        src={paslon.photo_path} 
                                                        alt={`Pasangan Calon 0${paslon.candidate_number}`}
                                                        className="w-full h-full object-cover object-top" 
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-[#727970] p-4 text-center">
                                                        <User className="w-14 h-14 text-[#727970]/40" />
                                                        <span className="text-xs font-semibold mt-2">Foto Pasangan Calon</span>
                                                    </div>
                                                )}
                                                <span className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                                                    PASLON 0{paslon.candidate_number}
                                                </span>
                                            </div>

                                            {/* Stacked Candidate Names List */}
                                            <div className="bg-[#F4F7F4] p-3.5 rounded-2xl border border-[#E1F2E2] space-y-2.5 my-2">
                                                <div>
                                                    <span className="text-[10px] font-bold text-[#386641] uppercase tracking-wider block">
                                                        Calon Ketua
                                                    </span>
                                                    <h4 className="font-headline font-bold text-sm sm:text-base text-[#101F15] leading-snug break-words">
                                                        {paslon.chairman_name}
                                                    </h4>
                                                </div>

                                                <div className="border-t border-[#E1F2E2] pt-2">
                                                    <span className="text-[10px] font-bold text-[#386641] uppercase tracking-wider block">
                                                        Calon Wakil Ketua
                                                    </span>
                                                    <h4 className="font-headline font-bold text-sm sm:text-base text-[#101F15] leading-snug break-words">
                                                        {paslon.vice_chairman_name}
                                                    </h4>
                                                </div>
                                            </div>

                                            {/* Tagline Aspirasi */}
                                            <div className="mt-3 p-3 rounded-xl bg-[#F4F7F4] border border-[#E1F2E2] space-y-1">
                                                <div className="flex items-center gap-1.5 text-[#386641] text-xs font-bold uppercase tracking-wider">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    <span>Tagline Aspirasi</span>
                                                </div>
                                                <p className="font-headline text-xs font-bold italic text-[#204E2B] leading-snug">
                                                    "{paslon.tagline || 'Bersama Membangun PPTS yang Lebih Baik'}"
                                                </p>
                                                <p className="text-xs text-[#414941] line-clamp-2 leading-relaxed pt-1">
                                                    {paslon.vision}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons Inside Card */}
                                        <div className="mt-5 pt-3 border-t border-[#E1F2E2] flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalManifesto(paslon);
                                                }}
                                                className="flex-1 py-2.5 px-3 rounded-xl bg-[#E1F2E2] hover:bg-[#D5E7D7] text-[#204E2B] text-xs font-bold transition flex items-center justify-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Visi & Misi</span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-headline font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                                                    isSelected
                                                        ? 'bg-[#386641] text-white shadow-md'
                                                        : 'bg-[#204E2B] text-white hover:bg-[#386641]'
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>✓ Terpilih</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Pilih Paslon</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </>
            )}

            {/* Sticky Floating Bottom Bar with GSAP */}
            <GsapSheet isOpen={Boolean(selectedCandidate && !showConfirmModal)} position="bottom">
                {selectedCandidate && (
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                            <span className="w-10 h-10 rounded-xl bg-[#386641] text-white font-headline font-bold text-lg flex items-center justify-center shrink-0">
                                0{selectedCandidate.candidate_number}
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#386641] uppercase tracking-wider block">
                                    Pilihan Paslon Kamu
                                </span>
                                <span className="font-headline font-extrabold text-sm sm:text-base text-[#101F15] block leading-tight">
                                    {selectedCandidate.chairman_name} & {selectedCandidate.vice_chairman_name}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowConfirmModal(true)}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-extrabold text-base shadow-lg shadow-[#386641]/25 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Kunci & Simpan Pilihan</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </GsapSheet>

            {/* Modal 1: Konfirmasi Final Pilihan with GSAP */}
            <GsapModal
                isOpen={Boolean(showConfirmModal && selectedCandidate)}
                onClose={() => setShowConfirmModal(false)}
                maxWidth="max-w-md"
            >
                {({ requestClose }) => (
                    <div className="p-6 sm:p-7 space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between pb-3 border-b border-[#E1F2E2]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-full bg-[#E6F8E8] text-[#2D6A4F] flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-extrabold text-lg text-[#101F15]">
                                        Konfirmasi Pilihan Suara
                                    </h3>
                                    <span className="text-xs text-[#727970]">Langkah Terakhir Bilik Suara</span>
                                </div>
                            </div>
                            <button 
                                onClick={requestClose}
                                className="p-1 rounded-lg text-[#727970] hover:bg-[#F4F7F4]"
                                disabled={isSubmitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Candidate Selected Summary Card */}
                        {selectedCandidate && (
                            <div className="bg-[#F4F7F4] rounded-2xl p-4 border border-[#E1F2E2] flex items-center gap-3.5">
                                <span className="w-12 h-12 rounded-xl bg-[#386641] text-white font-headline font-extrabold text-xl flex items-center justify-center shrink-0 shadow-xs">
                                    0{selectedCandidate.candidate_number}
                                </span>
                                <div>
                                    <span className="text-[11px] font-bold text-[#386641] uppercase tracking-wider block">
                                        Paslon Nomor 0{selectedCandidate.candidate_number}
                                    </span>
                                    <h4 className="font-headline font-extrabold text-base text-[#101F15] leading-tight">
                                        {selectedCandidate.chairman_name} & {selectedCandidate.vice_chairman_name}
                                    </h4>
                                    <p className="text-xs italic text-[#414941] mt-0.5">
                                        "{selectedCandidate.tagline}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Warning Box */}
                        <div className="bg-[#FFDAD6]/60 border border-[#BA1A1A]/20 rounded-2xl p-3.5 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
                            <div className="text-xs text-[#93000A] leading-relaxed">
                                <strong className="font-bold block mb-0.5">Perhatian Penting:</strong>
                                Pilihan Anda bersifat <strong>permanen dan tidak dapat diubah kembali</strong>. Akun Anda akan otomatis logout setelah suara tersimpan.
                            </div>
                        </div>

                        {/* Error Banner if submission fails */}
                        {submitError && (
                            <div className="bg-[#FFDAD6] border border-[#BA1A1A]/30 rounded-2xl p-3 flex items-start gap-2 text-xs text-[#93000A]">
                                <AlertTriangle className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Modal Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={requestClose}
                                disabled={isSubmitting}
                                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-[#414941] font-semibold text-sm transition"
                            >
                                Periksa Kembali
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-headline font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                                    isSubmitting
                                        ? 'bg-[#E1F2E2] text-[#727970] cursor-not-allowed'
                                        : 'bg-[#386641] hover:bg-[#204E2B] text-white cursor-pointer'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#386641]/30 border-t-[#386641] rounded-full animate-spin"></span>
                                        <span>Menyimpan Suara...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Ya, Simpan & Selesai</span>
                                        <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </GsapModal>

            {/* Modal 2: Detail Visi & Misi with GSAP */}
            <GsapModal
                isOpen={Boolean(modalManifesto)}
                onClose={() => setModalManifesto(null)}
                maxWidth="max-w-lg"
            >
                {({ requestClose }) => (
                    <div className="p-6 sm:p-7 max-h-[85vh] flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                            <div className="flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-[#E6F8E8] text-[#204E2B] font-headline font-bold text-lg flex items-center justify-center">
                                    0{modalManifesto?.candidate_number}
                                </span>
                                <div>
                                    <h3 className="font-headline font-bold text-base text-[#101F15]">
                                        Visi & Misi Paslon 0{modalManifesto?.candidate_number}
                                    </h3>
                                    <span className="text-xs text-[#727970]">
                                        {modalManifesto?.chairman_name} & {modalManifesto?.vice_chairman_name}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={requestClose}
                                className="p-1 rounded-lg text-[#727970] hover:bg-[#F4F7F4]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        {modalManifesto && (
                            <div className="overflow-y-auto pr-1 space-y-4 py-4 my-1">
                                {/* Vision */}
                                <div className="space-y-1.5 bg-[#F4F7F4] p-4 rounded-2xl border border-[#E1F2E2]">
                                    <h4 className="text-xs font-bold text-[#386641] uppercase tracking-wider flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Visi Utama</span>
                                    </h4>
                                    <p className="text-sm font-medium text-[#101F15] leading-relaxed">
                                        {modalManifesto.vision}
                                    </p>
                                </div>

                                {/* Mission */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-[#386641] uppercase tracking-wider flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Program Misi Kerja</span>
                                    </h4>
                                    <div className="space-y-2">
                                        {Array.isArray(modalManifesto.mission) && modalManifesto.mission.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E1F2E2]">
                                                <span className="w-5 h-5 rounded-full bg-[#E6F8E8] text-[#204E2B] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-xs text-[#414941] leading-relaxed">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <div className="pt-3 border-t border-[#E1F2E2] flex justify-end">
                            <button
                                type="button"
                                onClick={requestClose}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#386641] text-white font-headline font-bold text-sm hover:bg-[#204E2B] transition"
                            >
                                Tutup & Kembali
                            </button>
                        </div>
                    </div>
                )}
            </GsapModal>
        </div>
    );
}
