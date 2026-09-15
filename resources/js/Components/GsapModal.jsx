import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapModal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
    const backdropRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen && backdropRef.current && contentRef.current) {
            try {
                gsap.killTweensOf([backdropRef.current, contentRef.current]);

                // Initial animation state
                gsap.fromTo(
                    backdropRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.25, ease: 'power2.out' }
                );

                gsap.fromTo(
                    contentRef.current,
                    { opacity: 0, scale: 0.94, y: 16 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
                );
            } catch (err) {
                // Fail-safe: ensure elements are fully visible if GSAP errors
                if (backdropRef.current) backdropRef.current.style.opacity = '1';
                if (contentRef.current) {
                    contentRef.current.style.opacity = '1';
                    contentRef.current.style.transform = 'none';
                }
            }
        }
    }, [isOpen]);

    const handleClose = () => {
        if (!backdropRef.current || !contentRef.current) {
            onClose();
            return;
        }

        try {
            const tl = gsap.timeline({
                onComplete: () => {
                    onClose();
                },
            });

            tl.to(contentRef.current, {
                opacity: 0,
                scale: 0.96,
                y: 12,
                duration: 0.2,
                ease: 'power2.in',
            }).to(
                backdropRef.current,
                {
                    opacity: 0,
                    duration: 0.15,
                    ease: 'power2.in',
                },
                '-=0.1'
            );
        } catch (err) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={handleClose}
                className="fixed inset-0 bg-[#101F15]/65 backdrop-blur-sm opacity-100 transition-opacity"
            ></div>

            {/* Modal Dialog Box */}
            <div
                ref={contentRef}
                className={`relative bg-white rounded-3xl ${maxWidth} w-full shadow-2xl border border-[#E1F2E2] z-10 overflow-hidden opacity-100 transition-all`}
            >
                {typeof children === 'function' ? children({ requestClose: handleClose }) : children}
            </div>
        </div>
    );
}
