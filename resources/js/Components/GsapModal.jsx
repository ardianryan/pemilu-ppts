import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapModal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
    const backdropRef = useRef(null);
    const contentRef = useRef(null);
    const isAnimating = useRef(false);

    useEffect(() => {
        if (isOpen && backdropRef.current && contentRef.current) {
            isAnimating.current = true;
            gsap.killTweensOf([backdropRef.current, contentRef.current]);

            // Set initial state
            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.set(contentRef.current, { opacity: 0, scale: 0.92, y: 24 });

            // Animate In
            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating.current = false;
                },
            });

            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
            }).to(
                contentRef.current,
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'back.out(1.2)',
                },
                '-=0.2'
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        if (isAnimating.current || !backdropRef.current || !contentRef.current) {
            onClose();
            return;
        }

        isAnimating.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false;
                onClose();
            },
        });

        tl.to(contentRef.current, {
            opacity: 0,
            scale: 0.95,
            y: 16,
            duration: 0.25,
            ease: 'power2.in',
        }).to(
            backdropRef.current,
            {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
            },
            '-=0.15'
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={handleClose}
                className="fixed inset-0 bg-[#101F15]/65 backdrop-blur-sm"
            ></div>

            {/* Modal Dialog Box */}
            <div
                ref={contentRef}
                className={`relative bg-white rounded-3xl ${maxWidth} w-full shadow-2xl border border-[#E1F2E2] z-10 overflow-hidden`}
            >
                {typeof children === 'function' ? children({ requestClose: handleClose }) : children}
            </div>
        </div>
    );
}
