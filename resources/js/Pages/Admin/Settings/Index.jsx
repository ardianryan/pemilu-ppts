import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Settings, 
    ShieldAlert, 
    Save, 
    ToggleLeft, 
    ToggleRight, 
    School, 
    Calendar, 
    AlertTriangle, 
    RotateCcw,
    KeyRound
} from 'lucide-react';

export default function SettingsIndex({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        school_name: setting.school_name || 'SMA/SMK TAMANSISWA',
        academic_year: setting.academic_year || '2025/2026',
        title: setting.title || 'Pemilihan Ketua & Wakil Ketua PPTS',
        is_voting_active: setting.is_voting_active,
        show_quick_count_public: setting.show_quick_count_public,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [resetConfirmation, setResetConfirmation] = useState('');
    const [resetProcessing, setResetProcessing] = useState(false);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.settings.password'), {
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleResetAllVotes = (e) => {
        e.preventDefault();
        if (resetConfirmation !== 'RESET SEMUA SUARA') {
            alert('Teks konfirmasi tidak sesuai.');
            return;
        }

        if (confirm('APAKAH ANDA YAKIN? Seluruh perolehan suara paslon akan direset ke 0 dan semua siswa dapat mencoblos kembali.')) {
            setResetProcessing(true);
            router.post(route('admin.settings.reset_votes'), {
                confirmation: resetConfirmation,
            }, {
                onFinish: () => {
                    setResetProcessing(false);
                    setResetConfirmation('');
                },
            });
        }
    };

    return (
        <AdminLayout title="Pengaturan Sistem Pemilihan">
            <Head title="Pengaturan - Admin Pilketos" />

            <div className="max-w-4xl space-y-8">
                {/* Main Settings Form Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-xs space-y-6">
                    <div className="border-b border-[#E1F2E2] pb-4">
                        <h2 className="font-headline font-bold text-lg text-[#101F15] flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#386641]" />
                            <span>Identitas & Konfigurasi Pemilu</span>
                        </h2>
                        <p className="text-xs text-[#727970]">
                            Atur judul, nama instansi sekolah, serta kontrol operasional bilik suara
                        </p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                    Nama Sekolah / Instansi
                                </label>
                                <input
                                    type="text"
                                    value={data.school_name}
                                    onChange={(e) => setData('school_name', e.target.value)}
                                    className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                    Tahun Pelajaran
                                </label>
                                <input
                                    type="text"
                                    value={data.academic_year}
                                    onChange={(e) => setData('academic_year', e.target.value)}
                                    className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                Judul Agenda Pemilihan
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                required
                            />
                        </div>

                        {/* Toggles */}
                        <div className="pt-4 border-t border-[#E1F2E2] space-y-4">
                            {/* Toggle 1: Bilik Suara Aktif */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2]">
                                <div>
                                    <h4 className="font-headline font-bold text-sm text-[#101F15]">
                                        Bilik Suara Aktif (Izinkan Siswa Memilih)
                                    </h4>
                                    <p className="text-xs text-[#727970]">
                                        Jika dimatikan, siswa tidak akan dapat masuk atau mencoblos di bilik suara.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_voting_active', !data.is_voting_active)}
                                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        data.is_voting_active ? 'bg-[#386641]' : 'bg-[#C1C9BE]'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                            data.is_voting_active ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Toggle 2: Quick Count Publik */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2]">
                                <div>
                                    <h4 className="font-headline font-bold text-sm text-[#101F15]">
                                        Tampilkan Quick Count ke Siswa
                                    </h4>
                                    <p className="text-xs text-[#727970]">
                                        Mengizinkan grafik perolehan suara ditampilkan secara terbuka setelah pemilihan ditutup.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('show_quick_count_public', !data.show_quick_count_public)}
                                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        data.show_quick_count_public ? 'bg-[#386641]' : 'bg-[#C1C9BE]'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                            data.show_quick_count_public ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="pt-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Admin Password Change Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1F2E2] shadow-xs space-y-5">
                    <div className="border-b border-[#E1F2E2] pb-4">
                        <h2 className="font-headline font-bold text-lg text-[#101F15] flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-[#386641]" />
                            <span>Keamanan & Ganti Password Admin</span>
                        </h2>
                        <p className="text-xs text-[#727970]">
                            Perbarui kata sandi akun administrator untuk menjaga keamanan portal KPU PPTS
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-1.5 max-w-md">
                            <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                required
                            />
                            {passwordForm.errors.current_password && (
                                <span className="text-xs text-[#BA1A1A] font-semibold block">{passwordForm.errors.current_password}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <span className="text-xs text-[#BA1A1A] font-semibold block">{passwordForm.errors.password}</span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full h-11 px-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-start">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-6 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                                <KeyRound className="w-4 h-4" />
                                <span>{passwordForm.processing ? 'Memperbarui Password...' : 'Perbarui Password Admin'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone: Reset All Votes */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#BA1A1A]/30 shadow-xs space-y-4">
                    <div className="flex items-start gap-3 border-b border-[#FFDAD6] pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-base text-[#BA1A1A]">
                                Zona Berbahaya: Reset Seluruh Suara Masuk
                            </h3>
                            <p className="text-xs text-[#727970] leading-relaxed">
                                Tindakan ini akan <strong>menghapus seluruh perolehan suara paslon menjadi 0</strong> dan mengembalikan status semua siswa menjadi <strong>belum memilih</strong>. Gunakan fitur ini hanya sebelum pemilihan resmi dimulai untuk uji coba (*gladi bersih*).
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleResetAllVotes} className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#BA1A1A] block">
                                Ketik kalimat konfirmasi: <code className="bg-[#FFDAD6] px-2 py-0.5 rounded font-mono">RESET SEMUA SUARA</code>
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik persis: RESET SEMUA SUARA"
                                value={resetConfirmation}
                                onChange={(e) => setResetConfirmation(e.target.value)}
                                className="w-full h-11 px-4 bg-[#F4F7F4] text-xs font-mono text-[#BA1A1A] rounded-xl border border-[#BA1A1A]/30 focus:border-[#BA1A1A] outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={resetConfirmation !== 'RESET SEMUA SUARA' || resetProcessing}
                            className={`px-5 py-2.5 rounded-xl text-xs font-headline font-bold transition flex items-center gap-2 ${
                                resetConfirmation === 'RESET SEMUA SUARA' && !resetProcessing
                                    ? 'bg-[#BA1A1A] hover:bg-[#93000A] text-white shadow-md cursor-pointer'
                                    : 'bg-[#FFDAD6] text-[#BA1A1A]/50 cursor-not-allowed'
                            }`}
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>{resetProcessing ? 'Mereset Suara...' : 'Eksekusi Reset Seluruh Suara'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
