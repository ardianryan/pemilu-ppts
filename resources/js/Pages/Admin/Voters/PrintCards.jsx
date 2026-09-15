import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Printer, 
    ArrowLeft, 
    Info, 
    CheckCircle2, 
    Vote, 
    ShieldCheck, 
    Scissors
} from 'lucide-react';

export default function PrintCards({ voters = [], setting = {}, filters = {} }) {
    // Chunk array into pages of 8 cards each
    const chunkSize = 8;
    const pages = [];
    for (let i = 0; i < voters.length; i += chunkSize) {
        pages.push(voters.slice(i, i + chunkSize));
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#F4F7F4] font-sans antialiased text-[#101F15] print:bg-white print:p-0 print:m-0">
            <Head title={`Cetak Kartu Pemilih (${voters.length} Pemilih)`} />

            {/* Custom Print CSS Styles for A4 Page Rules */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 6mm 6mm;
                    }
                    html, body {
                        background: #ffffff !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .page-sheet {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        min-height: 0 !important;
                        height: auto !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .page-sheet:last-child {
                        page-break-after: auto !important;
                        break-after: auto !important;
                    }
                }
            ` }} />

            {/* Top Toolbar (Hidden on Print) */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#E1F2E2] shadow-xs px-4 py-3 sm:px-6 print:hidden">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                            href={route('admin.voters.index', filters)}
                            className="p-2 rounded-xl text-[#414941] hover:bg-[#F4F7F4] hover:text-[#101F15] transition shrink-0"
                            title="Kembali ke Manajemen DPT"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-headline font-bold text-base sm:text-lg text-[#101F15] flex items-center gap-2">
                                <span>Cetak Kartu Pemilih DPT Pilketos</span>
                                <span className="bg-[#E6F8E8] text-[#204E2B] text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    8 Kartu / Lembar A4
                                </span>
                            </h1>
                            <p className="text-xs text-[#727970]">
                                Total {voters.length} Pemilih &bull; Estimasi {pages.length} Lembar A4
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                            onClick={handlePrint}
                            className="px-5 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Cetak / Simpan PDF</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Print Instructions Alert (Hidden on Print) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 print:hidden">
                <div className="bg-[#E6F8E8] border border-[#6A994E]/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#204E2B]">
                    <Info className="w-5 h-5 text-[#386641] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-bold text-[#101F15]">Petunjuk Cetak Presisi (A4 - Pas 8 Kartu / Halaman):</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[#204E2B]">
                            <li>Gunakan kertas ukuran <strong>A4</strong> dengan orientasi <strong>Portrait</strong>.</li>
                            <li>Pada jendela cetak browser, atur <strong>Margins: Minimum atau Default</strong>.</li>
                            <li>Pastikan opsi <strong>"Background Graphics" (Grafik Latar Belakang)</strong> dicentang agar warna kartu dan aksen hijau tercetak jelas.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Printable Cards Pages */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 print:p-0 print:m-0 print:space-y-0 print:max-w-none">
                {voters.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#E1F2E2] max-w-md mx-auto print:hidden">
                        <Vote className="w-12 h-12 text-[#727970]/40 mx-auto mb-3" />
                        <h3 className="font-bold text-[#101F15] text-base mb-1">Tidak Ada Data Pemilih</h3>
                        <p className="text-xs text-[#727970]">
                            Tidak ada data pemilih yang sesuai dengan filter saat ini untuk dicetak.
                        </p>
                    </div>
                ) : (
                    pages.map((pageVoters, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E1F2E2] shadow-sm mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none page-sheet"
                            style={{
                                width: '100%',
                                maxWidth: '210mm',
                                boxSizing: 'border-box',
                            }}
                        >
                            {/* 2 Columns x 4 Rows Grid for 8 Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 print:grid-cols-2 print:gap-2">
                                {pageVoters.map((voter) => (
                                    <VoterCard key={voter.id} voter={voter} setting={setting} />
                                ))}
                            </div>

                            {/* Page Indicator Footer (Hidden on print) */}
                            <div className="mt-4 pt-2 border-t border-[#E1F2E2] text-right text-[11px] text-[#727970] print:hidden">
                                Halaman {pageIndex + 1} dari {pages.length} ({pageVoters.length} Kartu)
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

// Single Authentic Voter Card Component
function VoterCard({ voter, setting }) {
    const codeSeed = (voter.nisn + voter.token).toUpperCase();
    
    return (
        <div className="bg-white border-2 border-dashed border-[#386641]/35 rounded-xl p-2.5 print:p-2 flex flex-col justify-between relative overflow-hidden h-[63mm] print:h-[61mm] print:border-[#386641]/50 shadow-xs hover:border-[#386641] transition">
            
            {/* Corner Scissors Cut Indicator */}
            <div className="absolute top-1 right-1 flex items-center gap-0.5 text-[7.5px] font-bold text-[#727970]/60 print:opacity-60 pointer-events-none select-none">
                <Scissors className="w-2.5 h-2.5 transform -rotate-45" />
                <span>POTONG</span>
            </div>

            {/* Card Header (Official Badge Band) */}
            <div className="bg-[#386641] text-white p-2 print:py-1 print:px-2 rounded-lg flex items-center gap-2 shadow-xs">
                {setting.logo_path ? (
                    <img 
                        src={setting.logo_path} 
                        alt="Logo Sekolah" 
                        className="w-6 h-6 object-contain rounded bg-white/10 p-0.5 shrink-0" 
                    />
                ) : (
                    <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center shrink-0">
                        <Vote className="w-3.5 h-3.5 text-white" />
                    </div>
                )}
                <div className="flex-1 min-w-0 leading-tight">
                    <span className="text-[7.5px] uppercase tracking-widest text-[#E6F8E8] font-extrabold block">
                        KARTU PEMILIH DPT &bull; PILKETOS
                    </span>
                    <h4 className="font-headline font-bold text-[9.5px] text-white truncate">
                        {setting.school_name || 'SMA TAMANSISWA'}
                    </h4>
                    <span className="text-[7.5px] text-[#E6F8E8]/90 block">
                        Tahun Ajaran {setting.academic_year || '2025/2026'}
                    </span>
                </div>
            </div>

            {/* Voter Info Details */}
            <div className="my-1 space-y-0.5">
                <div>
                    <span className="text-[7.5px] font-bold uppercase text-[#727970] tracking-wider block">
                        Nama Pemilih
                    </span>
                    <h3 className="font-headline font-extrabold text-xs text-[#101F15] truncate leading-tight">
                        {voter.name}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <div>
                        <span className="text-[7.5px] font-bold uppercase text-[#727970] tracking-wider block">
                            Kelas / Peran
                        </span>
                        <span className="text-[9.5px] font-bold text-[#204E2B] bg-[#E6F8E8] px-1.5 py-0.5 rounded border border-[#6A994E]/30 inline-block truncate max-w-full">
                            {voter.grade === 'GURU' || voter.grade === 'TENDIK' ? voter.class_room : `Kelas ${voter.class_room}`}
                        </span>
                    </div>
                    <div>
                        <span className="text-[7.5px] font-bold uppercase text-[#727970] tracking-wider block">
                            Kode Akses / NISN
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-[#101F15] bg-[#F4F7F4] px-1.5 py-0.5 rounded border border-[#E1F2E2] inline-block tracking-wide">
                            {voter.nisn}
                        </span>
                    </div>
                </div>
            </div>

            {/* Highlighted Token Box */}
            <div className="bg-[#E6F8E8] p-1 print:p-0.5 rounded-lg border border-[#386641]/30 text-center relative">
                <span className="text-[7.5px] font-extrabold text-[#204E2B] uppercase tracking-widest block">
                    TOKEN AKSES PEMILIHAN
                </span>
                <div className="bg-white py-0.5 px-1.5 rounded border border-[#386641]/20 my-0.5 shadow-inner">
                    <span className="font-mono font-black text-xs sm:text-sm text-[#101F15] tracking-[0.2em] inline-block">
                        {voter.token}
                    </span>
                </div>
                <span className="text-[7px] text-[#727970] block leading-none">
                    Rahasiakan Token ini hingga masuk Bilik Suara
                </span>
            </div>

            {/* Card Footer Verification Barcode */}
            <div className="flex items-center justify-between pt-0.5 border-t border-[#E1F2E2] text-[7.5px] text-[#727970]">
                {/* Real Code39 Barcode encoding voter.token */}
                <div className="flex items-center gap-1 shrink-0">
                    <TokenBarcodeSvg token={voter.token} />
                </div>

                <div className="text-right leading-tight">
                    <span className="font-bold text-[#204E2B] flex items-center justify-end gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>DPT TERVERIFIKASI</span>
                    </span>
                    <span className="text-[6.5px]">Barcode Token Akses</span>
                </div>
            </div>
        </div>
    );
}

// Code 39 SVG Barcode Generator for Token Akses
function TokenBarcodeSvg({ token }) {
    const CODE39 = {
        '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
        '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
        '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
        'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
        'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
        'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
        'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
        'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
        'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
        '*': '010010100'
    };

    const cleanToken = (token || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const code = '*' + cleanToken + '*';

    let currentX = 0;
    const bars = [];
    const narrowWidth = 1.1;
    const wideWidth = 2.6;

    for (let c = 0; c < code.length; c++) {
        const charPattern = CODE39[code[c]];
        if (!charPattern) continue;

        for (let i = 0; i < charPattern.length; i++) {
            const isWide = charPattern[i] === '1';
            const width = isWide ? wideWidth : narrowWidth;
            const isBar = i % 2 === 0;

            if (isBar) {
                bars.push(
                    <rect
                        key={`${c}-${i}`}
                        x={currentX}
                        y="0"
                        width={width}
                        height="18"
                        fill="#101F15"
                    />
                );
            }
            currentX += width;
        }
        currentX += narrowWidth;
    }

    return (
        <div className="flex items-center leading-none">
            <svg 
                viewBox={`0 0 ${currentX} 18`} 
                className="h-4.5 w-auto max-w-[125px]"
                preserveAspectRatio="none"
            >
                {bars}
            </svg>
        </div>
    );
}
