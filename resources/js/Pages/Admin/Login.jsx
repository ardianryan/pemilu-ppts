import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, User, ShieldCheck, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.login.attempt'));
    };

    return (
        <div className="min-h-screen bg-[#F4F7F4] flex flex-col justify-center items-center p-4 font-body text-[#101F15] selection:bg-[#386641]/20">
            <Head title="Login Administrator - Pilketos" />

            <div className="w-full max-w-md space-y-6">
                {/* Back Link */}
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#386641] hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Bilik Suara Siswa</span>
                </Link>

                {/* Login Card */}
                <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-md border border-[#E1F2E2] space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo" 
                            className="w-14 h-14 object-contain drop-shadow-sm mb-1"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <h1 className="font-headline font-extrabold text-2xl text-[#204E2B] tracking-tight">
                            Portal Petugas KPU PPTS
                        </h1>
                        <p className="text-xs text-[#727970] max-w-xs">
                            Masuk dengan akun panitia atau administrator untuk mengelola data pemilihan.
                        </p>
                    </div>

                    {errors.login && (
                        <div className="p-3.5 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/20 text-[#93000A] text-xs font-medium flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-[#BA1A1A] shrink-0" />
                            <span>{errors.login}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                Username atau Email
                            </label>
                            <div className="relative flex items-center">
                                <User className="w-4 h-4 text-[#727970] absolute left-3.5" />
                                <input
                                    type="text"
                                    placeholder="admin / panitia"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] focus:ring-3 focus:ring-[#A7C957]/20 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                                Kata Sandi
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="w-4 h-4 text-[#727970] absolute left-3.5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] focus:ring-3 focus:ring-[#A7C957]/20 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-[#414941]">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[#E1F2E2] text-[#386641] focus:ring-[#386641]"
                                />
                                <span>Ingat sesi saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white font-headline font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                        >
                            {processing ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Masuk ke Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center text-xs text-[#727970]">
                    Kredensial bawaan awal: <strong>admin</strong> / <strong>admin123</strong>
                </div>
            </div>
        </div>
    );
}
