import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, RotateCcw, RotateCw, Check, X, Crop } from 'lucide-react';

async function createImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const croppedUrl = URL.createObjectURL(blob);
                resolve({ blob, croppedUrl });
            }
        }, 'image/jpeg', 0.92);
    });
}

export default function ImageCropperModal({ imageSrc, onClose, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(4 / 3); // Default 4:3 ratio for Paslon
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };

    const onZoomChange = (newZoom) => {
        setZoom(newZoom);
    };

    const onCropCompleteCallback = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSaveCrop = async () => {
        if (!croppedAreaPixels || !imageSrc) return;
        try {
            setIsProcessing(true);
            const { blob, croppedUrl } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            onCropComplete(blob, croppedUrl);
        } catch (e) {
            console.error('Error cropping image:', e);
            alert('Gagal memotong gambar. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#101F15]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E1F2E2] flex flex-col space-y-5 animate-scale-up">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E1F2E2]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#E6F8E8] text-[#386641] flex items-center justify-center">
                            <Crop className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-base text-[#101F15]">
                                Potong & Sesuaikan Foto Paslon
                            </h3>
                            <p className="text-xs text-[#727970]">
                                Geser, perbesar, dan putar gambar agar pas pada kartu bilik suara
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-[#727970] hover:bg-[#F4F7F4] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative w-full h-72 sm:h-80 bg-[#101F15] rounded-2xl overflow-hidden shadow-inner">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteCallback}
                    />
                </div>

                {/* Aspect Ratio Presets */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#101F15] uppercase tracking-wider block">
                        Rasio Ukuran Foto
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: '4 : 3 (Rekomendasi Paslon)', value: 4 / 3 },
                            { label: '16 : 9 (Lansekap Lebar)', value: 16 / 9 },
                            { label: '1 : 1 (Persegi Presisi)', value: 1 / 1 },
                        ].map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setAspect(item.value)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center text-center ${
                                    aspect === item.value
                                        ? 'bg-[#386641] text-white shadow-xs'
                                        : 'bg-[#F4F7F4] text-[#414941] hover:bg-[#E1F2E2]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls Bar: Zoom & Rotation */}
                <div className="bg-[#F4F7F4] p-3.5 rounded-2xl border border-[#E1F2E2] space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#101F15] font-semibold">
                        <span className="flex items-center gap-1.5">
                            <ZoomIn className="w-4 h-4 text-[#386641]" />
                            <span>Perbesar / Zoom:</span>
                        </span>
                        <span className="font-mono">{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-[#386641] cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-[#727970] font-medium">Putar Posisi Foto:</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setRotation((r) => (r - 90) % 360)}
                                className="px-3 py-1.5 rounded-xl bg-white border border-[#E1F2E2] hover:bg-[#E6F8E8] text-[#204E2B] text-xs font-bold flex items-center gap-1 transition shadow-xs"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>-90°</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRotation((r) => (r + 90) % 360)}
                                className="px-3 py-1.5 rounded-xl bg-white border border-[#E1F2E2] hover:bg-[#E6F8E8] text-[#204E2B] text-xs font-bold flex items-center gap-1 transition shadow-xs"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>+90°</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-xl bg-[#F4F7F4] hover:bg-[#E1F2E2] text-[#414941] text-xs font-semibold transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveCrop}
                        disabled={isProcessing}
                        className="px-6 py-2.5 rounded-xl bg-[#386641] hover:bg-[#204E2B] text-white text-xs font-headline font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                        {isProcessing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Memotong Foto...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Gunakan Hasil Potongan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
