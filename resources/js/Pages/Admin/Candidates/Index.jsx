import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImageCropperModal from '@/Components/ImageCropperModal';
import GsapModal from '@/Components/GsapModal';
import { 
    Users, 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Check, 
    User, 
    Upload, 
    Sparkles, 
    Eye,
    CheckCircle2,
    Crop
} from 'lucide-react';

export default function CandidatesIndex({ candidates }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState(null);
    const [croppedPreview, setCroppedPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        candidate_number: '',
        chairman_name: '',
        vice_chairman_name: '',
        tagline: '',
        vision: '',
        mission: ['', '', ''],
        color_accent: '#386641',
        photo: null,
    });

    const openAddModal = () => {
        setEditingCandidate(null);
        setCroppedPreview(null);
        reset();
        setData({
            candidate_number: candidates.length + 1,
            chairman_name: '',
            vice_chairman_name: '',
            tagline: '',
            vision: '',
            mission: ['', '', ''],
            color_accent: '#386641',
            photo: null,
        });
        setModalOpen(true);
    };

    const openEditModal = (cand) => {
        setEditingCandidate(cand);
        setCroppedPreview(null);
        let parsedMission = cand.mission;
        if (typeof parsedMission === 'string') {
            try {
                parsedMission = JSON.parse(parsedMission);
            } catch (e) {
                parsedMission = [];
            }
        }
        if (!Array.isArray(parsedMission) || parsedMission.length === 0) {
            parsedMission = ['', ''];
        }
        setData({
            candidate_number: cand.candidate_number,
            chairman_name: cand.chairman_name,
            vice_chairman_name: cand.vice_chairman_name,
            tagline: cand.tagline || '',
            vision: cand.vision || '',
            mission: parsedMission,
            color_accent: cand.color_accent || '#386641',
            photo: null,
        });
        setModalOpen(true);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setRawImageSrc(reader.result);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (blob, croppedUrl) => {
        const croppedFile = new File([blob], 'paslon_cropped.jpg', { type: 'image/jpeg' });
        setData('photo', croppedFile);
        setCroppedPreview(croppedUrl);
        setCropModalOpen(false);
    };

    const handleMissionChange = (index, value) => {
        const current = Array.isArray(data.mission) ? [...data.mission] : [];
        current[index] = value;
        setData('mission', current);
    };

    const addMissionRow = () => {
        const current = Array.isArray(data.mission) ? [...data.mission] : [];
        setData('mission', [...current, '']);
    };

    const removeMissionRow = (index) => {
        const current = Array.isArray(data.mission) ? [...data.mission] : [];
        if (current.length <= 1) return;
        setData('mission', current.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCandidate) {
            post(route('admin.candidates.update', editingCandidate.id), {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post(route('admin.candidates.store'), {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (cand) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Paslon 0${cand.candidate_number} (${cand.chairman_name} & ${cand.vice_chairman_name})?`)) {
            router.delete(route('admin.candidates.destroy', cand.id));
        }
    };

    return (
        <AdminLayout title="Manajemen Pasangan Calon (Kandidat)">
            <Head title="Data Paslon - Admin Pemilu PPTS" />

            <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E1F2E2] shadow-xs">
                    <div>
                        <h2 className="font-headline font-bold text-lg text-[#101F15]">
                            Daftar Pasangan Calon Ketua & Wakil Ketua PPTS
                        </h2>
                        <span className="text-xs text-[#727970]">
                            Total {candidates.length} Paslon terdaftar pada pemilihan ini
                        </span>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="px-4 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Paslon Baru</span>
                    </button>
                </div>

                {/* Candidate Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((cand) => (
                        <div
                            key={cand.id}
                            className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E1F2E2] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6A994E] transition"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-10 h-10 rounded-2xl bg-[#E6F8E8] text-[#204E2B] font-headline font-extrabold text-xl flex items-center justify-center shadow-xs">
                                            0{cand.candidate_number}
                                        </span>
                                        <div>
                                            <span className="text-[10px] font-bold text-[#727970] uppercase">
                                                Nomor Urut
                                            </span>
                                            <h3 className="font-headline font-bold text-sm text-[#101F15]">
                                                Kandidat 0{cand.candidate_number}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-bold text-[#386641] bg-[#E6F8E8] px-2.5 py-1 rounded-full">
                                            {cand.vote_count} Suara
                                        </span>
                                    </div>
                                </div>

                                {/* Photo / Placeholder */}
                                <div className="w-full h-44 rounded-2xl bg-[#F4F7F4] border border-[#E1F2E2] overflow-hidden flex items-center justify-center relative">
                                    {cand.photo_path ? (
                                        <img
                                            src={cand.photo_path}
                                            alt={cand.chairman_name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-[#727970]">
                                            <User className="w-12 h-12 text-[#727970]/40" />
                                            <span className="text-xs mt-1">Belum ada foto</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stacked Candidate Names List */}
                                <div className="bg-[#F4F7F4] p-3 rounded-2xl border border-[#E1F2E2] space-y-2">
                                    <div>
                                        <span className="text-[10px] font-bold text-[#386641] uppercase tracking-wider block">
                                            Calon Ketua
                                        </span>
                                        <h4 className="font-headline font-bold text-sm text-[#101F15] leading-snug break-words">
                                            {cand.chairman_name}
                                        </h4>
                                    </div>
                                    <div className="border-t border-[#E1F2E2] pt-1.5">
                                        <span className="text-[10px] font-bold text-[#386641] uppercase tracking-wider block">
                                            Calon Wakil Ketua
                                        </span>
                                        <h4 className="font-headline font-bold text-sm text-[#101F15] leading-snug break-words">
                                            {cand.vice_chairman_name}
                                        </h4>
                                    </div>
                                </div>
                                {cand.tagline && (
                                    <p className="text-xs italic text-[#386641] font-semibold px-1">
                                        "{cand.tagline}"
                                    </p>
                                )}

                                {/* Vision & Mission Snippet */}
                                <div className="text-xs text-[#414941] bg-[#F4F7F4] p-3 rounded-2xl border border-[#E1F2E2] space-y-1">
                                    <strong className="text-[#101F15] block">Visi:</strong>
                                    <p className="line-clamp-2 leading-relaxed">
                                        {cand.vision}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-3 border-t border-[#E1F2E2]">
                                <button
                                    onClick={() => openEditModal(cand)}
                                    className="flex-1 py-2 px-3 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-[#414941] text-xs font-bold transition flex items-center justify-center gap-1.5"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Ubah Data</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(cand)}
                                    className="p-2 rounded-xl text-[#BA1A1A] hover:bg-[#FFDAD6] transition"
                                    title="Hapus Paslon"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Add / Edit Candidate with GSAP */}
                <GsapModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    maxWidth="max-w-xl"
                >
                    {({ requestClose }) => (
                        <div className="p-6 sm:p-7 max-h-[90vh] flex flex-col justify-between">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                                <h3 className="font-headline font-bold text-lg text-[#101F15]">
                                    {editingCandidate ? `Ubah Data Paslon 0${editingCandidate.candidate_number}` : 'Tambah Pasangan Calon Baru'}
                                </h3>
                                <button
                                    onClick={requestClose}
                                    className="p-1 rounded-lg text-[#727970] hover:bg-[#F4F7F4]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 py-4 pr-1">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                            No. Urut
                                        </label>
                                        <input
                                            type="number"
                                            value={data.candidate_number}
                                            onChange={(e) => setData('candidate_number', e.target.value)}
                                            className="w-full h-10 px-3 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                            Tagline Aspirasi
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Sinergi & Kreasi Berkelanjutan"
                                            value={data.tagline}
                                            onChange={(e) => setData('tagline', e.target.value)}
                                            className="w-full h-10 px-3 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                            Nama Calon Ketua
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nama lengkap ketua"
                                            value={data.chairman_name}
                                            onChange={(e) => setData('chairman_name', e.target.value)}
                                            className="w-full h-10 px-3 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                            Nama Calon Wakil Ketua
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nama lengkap wakil ketua"
                                            value={data.vice_chairman_name}
                                            onChange={(e) => setData('vice_chairman_name', e.target.value)}
                                            className="w-full h-10 px-3 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                        Foto Pasangan Calon (Dengan UI Cropper Presisi)
                                    </label>
                                    <div className="bg-[#F4F7F4] p-3.5 rounded-2xl border border-[#E1F2E2] space-y-3">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            {(croppedPreview || editingCandidate?.photo_path) && (
                                                <div className="w-24 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-[#E1F2E2] relative">
                                                    <img 
                                                        src={croppedPreview || editingCandidate?.photo_path} 
                                                        alt="Preview Hasil Crop" 
                                                        className="w-full h-full object-cover object-top" 
                                                    />
                                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                                                        Preview
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-1.5 w-full">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="w-full text-xs text-[#727970] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E6F8E8] file:text-[#204E2B] hover:file:bg-[#D5E7D7] cursor-pointer"
                                                />
                                                <p className="text-[11px] text-[#727970] leading-tight">
                                                    Pilih foto dari komputer untuk membuka alat pemotong (*Interactive Cropper*). Rasio default disesuaikan otomatis (4:3 Paslon).
                                                </p>
                                            </div>
                                        </div>

                                        {rawImageSrc && !croppedPreview && (
                                            <button
                                                type="button"
                                                onClick={() => setCropModalOpen(true)}
                                                className="w-full py-2 px-3 rounded-xl bg-[#E6F8E8] hover:bg-[#D5E7D7] text-[#2D6A4F] text-xs font-bold transition flex items-center justify-center gap-1.5"
                                            >
                                                <Crop className="w-4 h-4" />
                                                <span>Buka Alat Potong / Crop Ulang</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block mb-1">
                                        Visi
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Uraikan visi paslon..."
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        className="w-full p-3 bg-[#F4F7F4] text-sm text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                        required
                                    ></textarea>
                                </div>

                                {/* Dynamic Mission Array */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider">
                                            Poin-Poin Misi Kerja
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addMissionRow}
                                            className="text-xs font-bold text-[#386641] hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Tambah Poin</span>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {(Array.isArray(data.mission) ? data.mission : []).map((item, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-[#727970] w-5">
                                                    {index + 1}.
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={`Butir misi ${index + 1}`}
                                                    value={item}
                                                    onChange={(e) => handleMissionChange(index, e.target.value)}
                                                    className="flex-1 h-9 px-3 bg-[#F4F7F4] text-xs text-[#101F15] rounded-xl border border-[#E1F2E2] focus:bg-white focus:border-[#386641] outline-none"
                                                    required
                                                />
                                                {(Array.isArray(data.mission) ? data.mission.length : 0) > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMissionRow(index)}
                                                        className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] rounded-lg"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Actions */}
                                <div className="pt-4 border-t border-[#E1F2E2] flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={requestClose}
                                        className="px-4 py-2.5 rounded-xl bg-[#F4F7F4] text-xs font-semibold text-[#414941] hover:bg-[#E1F2E2]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Paslon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </GsapModal>
                {/* Modal Interactive Cropper */}
                {cropModalOpen && rawImageSrc && (
                    <ImageCropperModal
                        imageSrc={rawImageSrc}
                        onClose={() => setCropModalOpen(false)}
                        onCropComplete={handleCropComplete}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
