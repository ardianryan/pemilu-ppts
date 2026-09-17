import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GsapModal from '@/Components/GsapModal';
import { 
    Users, 
    UserCheck, 
    UserX, 
    Search, 
    Filter, 
    Upload, 
    Download, 
    Plus, 
    Trash2, 
    Edit2, 
    RotateCcw, 
    X, 
    CheckCircle2, 
    FileText,
    Printer 
} from 'lucide-react';

export default function VotersIndex({ voters, classes, filters, stats }) {
    const safeClasses = Array.isArray(classes) ? classes : (classes ? Object.values(classes) : []);
    const safeVotersData = Array.isArray(voters?.data) ? voters.data : [];
    const safeVotersLinks = Array.isArray(voters?.links) ? voters.links : [];

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedGrade, setSelectedGrade] = useState(filters.grade || '');
    const [selectedClass, setSelectedClass] = useState(filters.class_room || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [perPage, setPerPage] = useState(filters.per_page || '20');
    const [selectedIds, setSelectedIds] = useState([]);

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editingVoter, setEditingVoter] = useState(null);

    const voterForm = useForm({
        nisn: '',
        token: '',
        name: '',
        gender: 'L',
        grade: 'X',
        class_room: '',
    });

    const importForm = useForm({
        file: null,
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.voters.index'), {
            search: searchQuery,
            grade: selectedGrade,
            class_room: selectedClass,
            status: selectedStatus,
            per_page: perPage,
        }, { preserveState: true });
    };

    const handleFilterChange = (key, val) => {
        const newFilters = {
            search: searchQuery,
            grade: selectedGrade,
            class_room: selectedClass,
            status: selectedStatus,
            per_page: perPage,
            [key]: val,
        };

        if (key === 'grade') setSelectedGrade(val);
        if (key === 'class_room') setSelectedClass(val);
        if (key === 'status') setSelectedStatus(val);
        if (key === 'per_page') setPerPage(val);

        router.get(route('admin.voters.index'), newFilters, { preserveState: true });
    };

    const openAddModal = () => {
        setEditingVoter(null);
        voterForm.reset();
        voterForm.clearErrors();
        setAddModalOpen(true);
    };

    const openEditModal = (voter) => {
        setEditingVoter(voter);
        voterForm.setData({
            nisn: voter.nisn,
            token: voter.token,
            name: voter.name,
            gender: voter.gender || 'L',
            grade: voter.grade,
            class_room: voter.class_room,
        });
        voterForm.clearErrors();
        setAddModalOpen(true);
    };

    const handleVoterSubmit = (e) => {
        e.preventDefault();
        if (editingVoter) {
            voterForm.put(route('admin.voters.update', editingVoter.id), {
                onSuccess: () => setAddModalOpen(false),
            });
        } else {
            voterForm.post(route('admin.voters.store'), {
                onSuccess: () => setAddModalOpen(false),
            });
        }
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        importForm.post(route('admin.voters.import'), {
            onSuccess: () => {
                setImportModalOpen(false);
                importForm.reset();
            },
        });
    };

    const handleResetVote = (voter) => {
        if (confirm(`Reset status pemilih untuk ${voter.name}? Pemilih ini akan dapat memilih kembali.`)) {
            router.post(route('admin.voters.reset', voter.id));
        }
    };

    const handleDelete = (voter) => {
        if (confirm(`Hapus data pemilih ${voter.name} (${voter.nisn})?`)) {
            router.delete(route('admin.voters.destroy', voter.id));
        }
    };

    const handleDownloadTemplate = () => {
        const csvContent = "KODE_AKSES_NISN,NAMA_PEMILIH,KELAS_JABATAN,KATEGORI\n0061234501,Ahmad Rifai,X-1,X\n1985010101,Drs. Bambang Hariyanto,Guru Pamong,GURU\n1995030303,Sri Wahyuni,Staf TU,TENDIK";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Template_DPT_Pemilih.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout title="Daftar Pemilih Tetap (DPT) & Token Akses">
            <Head title="Manajemen DPT & Token - Admin Pemilu PPTS" />

            <div className="space-y-6">
                {/* Stats Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#E6F8E8] text-[#204E2B] flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-[#727970] uppercase">Total DPT Pemilih</span>
                            <span className="font-headline font-extrabold text-xl text-[#101F15] block">
                                {stats.total.toLocaleString('id-ID')} Pemilih
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#BAEE99]/50 text-[#3D6924] flex items-center justify-center">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-[#727970] uppercase">Sudah Mencoblos</span>
                            <span className="font-headline font-extrabold text-xl text-[#204E2B] block">
                                {stats.voted.toLocaleString('id-ID')} Pemilih
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center">
                            <UserX className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-[#727970] uppercase">Belum Memilih</span>
                            <span className="font-headline font-extrabold text-xl text-[#101F15] block">
                                {stats.not_voted.toLocaleString('id-ID')} Pemilih
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter and Action Bar */}
                <div className="bg-white rounded-3xl p-5 border border-[#E1F2E2] shadow-xs space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Search Box */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative flex items-center w-full">
                                <Search className="w-4 h-4 text-[#727970] absolute left-3.5" />
                                <input
                                    type="text"
                                    placeholder="Cari Nama, Kode Akses/NISN, atau Token..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-[#F4F7F4] text-xs text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 h-10 bg-[#386641] text-white rounded-xl text-xs font-bold hover:bg-[#204E2B] transition"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Top Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('admin.voters.print_cards', {
                                    search: searchQuery,
                                    grade: selectedGrade,
                                    class_room: selectedClass,
                                    status: selectedStatus,
                                })}
                                className="px-3.5 py-2.5 rounded-xl bg-[#6A994E] hover:bg-[#386641] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                                title="Cetak Kartu Pemilih (8 Kartu / Lembar A4)"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Cetak Kartu Pemilih</span>
                            </Link>

                            <button
                                onClick={openAddModal}
                                className="px-3.5 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Pemilih</span>
                            </button>

                            <button
                                onClick={() => setImportModalOpen(true)}
                                className="px-3.5 py-2.5 rounded-xl bg-[#E6F8E8] hover:bg-[#D5E7D7] text-[#204E2B] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-[#E1F2E2]"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Import Excel (.xlsx)</span>
                            </button>

                            <a
                                href={route('admin.voters.export')}
                                className="px-3.5 py-2.5 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-[#414941] text-xs font-bold transition flex items-center gap-1.5 border border-[#E1F2E2]"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export DPT (.xlsx)</span>
                            </a>
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#E1F2E2]">
                        <select
                            value={selectedGrade}
                            onChange={(e) => handleFilterChange('grade', e.target.value)}
                            className="h-9 px-3 bg-[#F4F7F4] text-xs text-[#101F15] rounded-xl border border-[#E1F2E2] outline-none"
                        >
                            <option value="">Semua Kategori Pemilih</option>
                            <option value="X">Kelas X</option>
                            <option value="XI">Kelas XI</option>
                            <option value="XII">Kelas XII</option>
                            <option value="GURU">Guru Pamong</option>
                            <option value="TENDIK">Tenaga Kependidikan (Tendik)</option>
                        </select>

                        <select
                            value={selectedClass}
                            onChange={(e) => handleFilterChange('class_room', e.target.value)}
                            className="h-9 px-3 bg-[#F4F7F4] text-xs text-[#101F15] rounded-xl border border-[#E1F2E2] outline-none"
                        >
                            <option value="">Semua Kelas / Jabatan</option>
                            {safeClasses.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="h-9 px-3 bg-[#F4F7F4] text-xs text-[#101F15] rounded-xl border border-[#E1F2E2] outline-none"
                        >
                            <option value="">Semua Status Hak Suara</option>
                            <option value="voted">Sudah Memilih</option>
                            <option value="not_voted">Belum Memilih</option>
                        </select>

                        <select
                            value={perPage}
                            onChange={(e) => handleFilterChange('per_page', e.target.value)}
                            className="h-9 px-3 bg-[#F4F7F4] text-xs font-semibold text-[#386641] rounded-xl border border-[#E1F2E2] outline-none"
                        >
                            <option value="10">Limit: 10 / Hal</option>
                            <option value="20">Limit: 20 / Hal</option>
                            <option value="50">Limit: 50 / Hal</option>
                            <option value="100">Limit: 100 / Hal</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedGrade('');
                                setSelectedClass('');
                                setSelectedStatus('');
                                setPerPage('20');
                                router.get(route('admin.voters.index'));
                            }}
                            className="h-9 px-3 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-xs text-[#727970] font-semibold transition col-span-2 sm:col-span-1"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Bulk Action Bar if Selected */}
                {selectedIds.length > 0 && (
                    <div className="bg-[#E6F8E8] border border-[#6A994E]/40 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#204E2B] shadow-xs">
                        <div className="flex items-center gap-2 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-[#386641]" />
                            <span>Terpilih {selectedIds.length} Pemilih dari halaman ini</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Link
                                href={route('admin.voters.print_cards', { ids: selectedIds.join(',') })}
                                className="px-4 py-2 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs w-full sm:w-auto"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Cetak Kartu Terpilih ({selectedIds.length})</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="px-3 py-2 text-[#727970] hover:text-[#101F15] font-semibold"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* Voters Data Table */}
                <div className="bg-white rounded-3xl border border-[#E1F2E2] shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F4F7F4] text-[#414941] font-headline font-bold uppercase tracking-wider border-b border-[#E1F2E2]">
                                <tr>
                                    <th className="px-4 py-3.5 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={safeVotersData.length > 0 && selectedIds.length === safeVotersData.length}
                                            onChange={() => {
                                                if (selectedIds.length === safeVotersData.length) {
                                                    setSelectedIds([]);
                                                } else {
                                                    setSelectedIds(safeVotersData.map(v => v.id));
                                                }
                                            }}
                                            className="rounded border-[#E1F2E2] text-[#386641] focus:ring-[#386641] cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-5 py-3.5">Kode Akses / NISN</th>
                                    <th className="px-5 py-3.5">Token Akses</th>
                                    <th className="px-5 py-3.5">Nama Pemilih</th>
                                    <th className="px-5 py-3.5">Kategori</th>
                                    <th className="px-5 py-3.5">Kelas / Jabatan</th>
                                    <th className="px-5 py-3.5">Status Suara</th>
                                    <th className="px-5 py-3.5">Waktu Rekam</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E1F2E2]">
                                {safeVotersData.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-12 text-[#727970]">
                                            Tidak ada data pemilih yang sesuai kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    safeVotersData.map((v) => (
                                        <tr key={v.id} className={`hover:bg-[#F4F7F4]/60 transition ${selectedIds.includes(v.id) ? 'bg-[#E6F8E8]/40' : ''}`}>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(v.id)}
                                                    onChange={() => {
                                                        if (selectedIds.includes(v.id)) {
                                                            setSelectedIds(selectedIds.filter(i => i !== v.id));
                                                        } else {
                                                            setSelectedIds([...selectedIds, v.id]);
                                                        }
                                                    }}
                                                    className="rounded border-[#E1F2E2] text-[#386641] focus:ring-[#386641] cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-5 py-3 font-mono font-semibold text-[#101F15]">
                                                {v.nisn}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="font-mono font-bold text-[#386641] bg-[#E6F8E8] px-2.5 py-1 rounded-md border border-[#E1F2E2] tracking-wider">
                                                    {v.token}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 font-bold text-[#101F15]">
                                                {v.name}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-[#414941]">
                                                {v.grade === 'GURU' ? 'Guru Pamong' : v.grade === 'TENDIK' ? 'Tendik' : `Kelas ${v.grade}`}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-0.5 rounded-md bg-[#F4F7F4] text-[#101F15] font-semibold text-[11px] border border-[#E1F2E2]">
                                                    {v.class_room}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {v.has_voted ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#BAEE99]/50 text-[#3D6924] font-bold text-[10px]">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>SUDAH MEMILIH</span>
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-[#FFDAD6] text-[#BA1A1A] font-bold text-[10px]">
                                                        BELUM
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-[#727970] text-[11px]">
                                                {v.voted_at ? new Date(v.voted_at).toLocaleString('id-ID') : '-'}
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                {v.has_voted && (
                                                    <button
                                                        onClick={() => handleResetVote(v)}
                                                        title="Reset hak suara pemilih"
                                                        className="p-1.5 text-[#386641] hover:bg-[#E6F8E8] rounded-lg transition"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(v)}
                                                    title="Ubah pemilih"
                                                    className="p-1.5 text-[#414941] hover:bg-[#E1F2E2] rounded-lg transition"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v)}
                                                    title="Hapus pemilih"
                                                    className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] rounded-lg transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {voters.total > 0 && (
                        <div className="p-4 border-t border-[#E1F2E2] flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-[#727970] font-medium">
                                Menampilkan <strong className="text-[#101F15]">{voters.from || 0}</strong> - <strong className="text-[#101F15]">{voters.to || 0}</strong> dari <strong className="text-[#101F15]">{voters.total.toLocaleString('id-ID')}</strong> Pemilih
                            </span>

                            {safeVotersLinks.length > 1 && (
                                <div className="flex flex-wrap items-center gap-1">
                                    {safeVotersLinks.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            preserveState
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 text-xs rounded-xl transition-all font-semibold ${
                                                link.active
                                                    ? 'bg-[#386641] text-white shadow-xs'
                                                    : link.url
                                                    ? 'bg-[#F4F7F4] text-[#101F15] hover:bg-[#E1F2E2]'
                                                    : 'text-[#727970] opacity-40 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Add / Edit Voter with GSAP */}
                <GsapModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    maxWidth="max-w-md"
                >
                    {({ requestClose }) => (
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                                <h3 className="font-headline font-bold text-base text-[#101F15]">
                                    {editingVoter ? 'Ubah Data Pemilih' : 'Tambah Pemilih Baru'}
                                </h3>
                                <button onClick={requestClose} className="p-1 text-[#727970]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleVoterSubmit} className="space-y-3.5">
                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                        Kode Akses / NISN
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={20}
                                        placeholder="Contoh: 0061234501"
                                        value={voterForm.data.nisn}
                                        onChange={(e) => voterForm.setData('nisn', e.target.value)}
                                        className={`w-full h-10 px-3 bg-[#F4F7F4] text-xs font-mono rounded-xl border ${voterForm.errors.nisn ? 'border-red-500 bg-red-50' : 'border-[#E1F2E2]'} focus:bg-white focus:border-[#386641] outline-none`}
                                        required
                                    />
                                    {voterForm.errors.nisn && (
                                        <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.nisn}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                        Token Akses (Alfanumerik)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={editingVoter ? "Token Pemilih" : "Kosongkan untuk buat otomatis"}
                                        value={voterForm.data.token}
                                        onChange={(e) => voterForm.setData('token', e.target.value.toUpperCase())}
                                        className={`w-full h-10 px-3 bg-[#F4F7F4] text-xs font-mono font-bold tracking-widest uppercase rounded-xl border ${voterForm.errors.token ? 'border-red-500 bg-red-50' : 'border-[#E1F2E2]'} focus:bg-white focus:border-[#386641] outline-none`}
                                    />
                                    {voterForm.errors.token ? (
                                        <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.token}</p>
                                    ) : (
                                        <p className="text-[11px] text-[#727970] mt-1">
                                            {editingVoter ? 'Token unik pemilih.' : 'Jika dikosongkan, sistem akan meng-generate token acak 6 karakter.'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                        Nama Lengkap Pemilih
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nama siswa, guru pamong, atau tendik"
                                        value={voterForm.data.name}
                                        onChange={(e) => voterForm.setData('name', e.target.value)}
                                        className={`w-full h-10 px-3 bg-[#F4F7F4] text-xs rounded-xl border ${voterForm.errors.name ? 'border-red-500 bg-red-50' : 'border-[#E1F2E2]'} focus:bg-white focus:border-[#386641] outline-none`}
                                        required
                                    />
                                    {voterForm.errors.name && (
                                        <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                            Gender
                                        </label>
                                        <select
                                            value={voterForm.data.gender}
                                            onChange={(e) => voterForm.setData('gender', e.target.value)}
                                            className="w-full h-10 px-2 bg-[#F4F7F4] text-xs rounded-xl border border-[#E1F2E2] outline-none"
                                        >
                                            <option value="L">Laki-laki (L)</option>
                                            <option value="P">Perempuan (P)</option>
                                        </select>
                                        {voterForm.errors.gender && (
                                            <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.gender}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                            Kategori
                                        </label>
                                        <select
                                            value={voterForm.data.grade}
                                            onChange={(e) => voterForm.setData('grade', e.target.value)}
                                            className="w-full h-10 px-2 bg-[#F4F7F4] text-xs rounded-xl border border-[#E1F2E2] outline-none"
                                        >
                                            <option value="X">Kelas X</option>
                                            <option value="XI">Kelas XI</option>
                                            <option value="XII">Kelas XII</option>
                                            <option value="GURU">Guru Pamong</option>
                                            <option value="TENDIK">Tendik</option>
                                        </select>
                                        {voterForm.errors.grade && (
                                            <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.grade}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                            Kelas/Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="X-1 / Pamong"
                                            value={voterForm.data.class_room}
                                            onChange={(e) => voterForm.setData('class_room', e.target.value)}
                                            className={`w-full h-10 px-2.5 bg-[#F4F7F4] text-xs rounded-xl border ${voterForm.errors.class_room ? 'border-red-500 bg-red-50' : 'border-[#E1F2E2]'} focus:bg-white focus:border-[#386641] outline-none`}
                                            required
                                        />
                                        {voterForm.errors.class_room && (
                                            <p className="text-red-500 text-[11px] font-medium mt-1">{voterForm.errors.class_room}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#E1F2E2] flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={requestClose}
                                        className="px-4 py-2 rounded-xl bg-[#F4F7F4] text-xs font-semibold text-[#414941]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={voterForm.processing}
                                        className="px-5 py-2 rounded-xl bg-[#386641] text-white text-xs font-bold hover:bg-[#204E2B] transition disabled:opacity-50"
                                    >
                                        {voterForm.processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </GsapModal>

                {/* Modal Import Excel / CSV with GSAP */}
                <GsapModal
                    isOpen={importModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    maxWidth="max-w-md"
                >
                    {({ requestClose }) => (
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                                <h3 className="font-headline font-bold text-base text-[#101F15]">
                                    Import Data Pemilih (Excel / CSV)
                                </h3>
                                <button onClick={requestClose} className="p-1 text-[#727970]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-[#E6F8E8] p-4 rounded-2xl border border-[#A7C957]/30 text-xs text-[#204E2B] space-y-2">
                                <span className="font-bold block">Format Kolom File Excel (.xlsx / .csv):</span>
                                <p className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-[#E1F2E2]">
                                    A: Kode Akses / NISN
                                    <br />
                                    B: Nama Pemilih
                                    <br />
                                    C: Kelas / Jabatan
                                    <br />
                                    D: Kategori (X / XI / XII / GURU / TENDIK)
                                </p>
                                <p className="text-[11px] text-[#2D6A4F] italic pt-0.5">
                                    *Token akan otomatis dibuatkan 6 karakter unik oleh sistem untuk setiap pemilih.
                                </p>
                                <div className="pt-1">
                                    <a
                                        href={route('admin.voters.template')}
                                        className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E1F2E2] text-[11px] font-bold text-[#386641] hover:bg-[#F4F7F4] transition inline-flex items-center gap-1.5 shadow-xs"
                                    >
                                        <Download className="w-3.5 h-3.5 text-[#386641]" />
                                        <span>Download Template Excel (.xlsx)</span>
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleImportSubmit} className="space-y-4 pt-1">
                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase block mb-1">
                                        Pilih File Excel (.xlsx, .xls, .csv)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv,.txt"
                                        onChange={(e) => importForm.setData('file', e.target.files[0])}
                                        className="w-full text-xs text-[#727970] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E6F8E8] file:text-[#204E2B] hover:file:bg-[#D5E7D7] cursor-pointer"
                                        required
                                    />
                                </div>

                                <div className="pt-3 border-t border-[#E1F2E2] flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={requestClose}
                                        className="px-4 py-2 rounded-xl bg-[#F4F7F4] text-xs font-semibold text-[#414941]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={importForm.processing || !importForm.data.file}
                                        className="px-5 py-2 rounded-xl bg-[#386641] text-white text-xs font-bold hover:bg-[#204E2B] transition"
                                    >
                                        {importForm.processing ? 'Mengunggah...' : 'Mulai Import Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </GsapModal>
            </div>
        </AdminLayout>
    );
}
