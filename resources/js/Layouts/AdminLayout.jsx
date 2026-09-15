import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    UserCheck, 
    Settings, 
    LogOut, 
    Vote, 
    Menu, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    ExternalLink,
    ShieldCheck
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash, school_name } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin logout dari dashboard admin?')) {
            router.post(route('admin.logout'));
        }
    };

    const navItems = [
        { label: 'Dashboard & Quick Count', href: route('admin.dashboard'), icon: LayoutDashboard, routeName: 'admin.dashboard' },
        { label: 'Data Pasangan Calon', href: route('admin.candidates.index'), icon: Users, routeName: 'admin.candidates.index' },
        { label: 'Data Pemilih (DPT)', href: route('admin.voters.index'), icon: UserCheck, routeName: 'admin.voters.index' },
        { label: 'Pengaturan Pemilihan', href: route('admin.settings.index'), icon: Settings, routeName: 'admin.settings.index' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F7F4] font-body text-[#101F15] relative">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-[#E1F2E2] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <img 
                        src="/images/logo2.png" 
                        alt="Logo" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="font-headline font-bold text-sm text-[#204E2B]">
                        Admin KPU PPTS
                    </span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl text-[#414941] hover:bg-[#F4F7F4]"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-screen bg-white border-r border-[#E1F2E2] flex flex-col justify-between transition-transform duration-300 overflow-y-auto ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                {/* Top: Logo & Title */}
                <div>
                    <div className="p-6 border-b border-[#E1F2E2] flex items-center gap-3">
                        <img 
                            src="/images/logo2.png" 
                            alt="Logo" 
                            className="w-10 h-10 object-contain drop-shadow-xs"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                            <h2 className="font-headline font-extrabold text-[#204E2B] text-base leading-tight">
                                KPU PPTS PANEL
                            </h2>
                            <span className="text-[11px] font-medium text-[#727970] block">
                                {school_name || 'SMA TAMANSISWA MOJOKERTO'}
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = route().current(item.routeName);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-headline font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#386641] text-white shadow-sm'
                                            : 'text-[#414941] hover:bg-[#F4F7F4] hover:text-[#204E2B]'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#727970]'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom: User Info & Actions */}
                <div className="p-4 border-t border-[#E1F2E2] space-y-3">
                    <a
                        href="/login"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#E6F8E8] text-[#2D6A4F] text-xs font-semibold hover:bg-[#D5E7D7] transition"
                    >
                        <span className="flex items-center gap-2">
                            <Vote className="w-4 h-4 text-[#386641]" />
                            <span>Buka Bilik Suara</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="p-3 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2] flex items-center justify-between">
                        <div className="overflow-hidden pr-2">
                            <span className="text-xs font-bold text-[#101F15] block truncate">
                                {auth?.admin?.name || 'Administrator'}
                            </span>
                            <span className="text-[10px] font-semibold text-[#386641] uppercase tracking-wider block">
                                {auth?.admin?.role || 'Panitia'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Logout Admin"
                            className="p-1.5 rounded-lg text-[#727970] hover:text-[#BA1A1A] hover:bg-[#FFDAD6] transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
                ></div>
            )}

            {/* Main Content Pane */}
            <div className="md:pl-72 min-h-screen flex flex-col min-w-0">
                {/* Desktop Top Header */}
                <header className="hidden md:flex items-center justify-between bg-white border-b border-[#E1F2E2] px-8 py-4">
                    <div>
                        <h1 className="font-headline font-bold text-xl text-[#101F15]">
                            {title || 'Dashboard Administrator'}
                        </h1>
                        <span className="text-xs text-[#727970]">
                            Panel Pengendali Pemilihan Ketua PPTS
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] bg-[#EAF4EE] px-3 py-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Sesi Aman KPU PPTS</span>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                <div className="px-4 sm:px-8 pt-4">
                    {flash?.success && (
                        <div className="p-4 mb-4 rounded-2xl bg-[#E6F8E8] border border-[#A7C957]/50 text-[#204E2B] text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-fade-in">
                            <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="p-4 mb-4 rounded-2xl bg-[#FFDAD6] border border-[#BA1A1A]/20 text-[#93000A] text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-[#BA1A1A] shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}
                </div>

                {/* Page View Body */}
                <main className="p-4 sm:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
