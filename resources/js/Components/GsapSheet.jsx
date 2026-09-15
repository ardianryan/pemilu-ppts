import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapSheet({ isOpen, onClose, children, position = 'bottom' }) {
    const sheetRef = useRef(null);
    const backdropRef = useRef(null);
    const isAnimating = useRef(false);

    useEffect(() => {
        if (isOpen && sheetRef.current) {
            isAnimating.current = true;
            gsap.killTweensOf([sheetRef.current, backdropRef.current]);

            if (position === 'bottom') {
                gsap.set(sheetRef.current, { y: '100%', opacity: 0 });
                gsap.to(sheetRef.current, {
                    y: '0%',
                    opacity: 1,
                    duration: 0.45,
                    ease: 'power3.out',
                    onComplete: () => {
                        isAnimating.current = false;
                    },
                });
            } else if (position === 'left') {
                gsap.set(sheetRef.current, { x: '-100%' });
                if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 0 });

                const tl = gsap.timeline({
                    onComplete: () => {
                        isAnimating.current = false;
                    },
                });

                if (backdropRef.current) {
                    tl.to(backdropRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
                }
                tl.to(sheetRef.current, { x: '0%', duration: 0.35, ease: 'power3.out' }, '-=0.15');
            }
        }
    }, [isOpen, position]);

    const handleClose = () => {
        if (isAnimating.current || !sheetRef.current) {
            onClose();
            return;
        }

        isAnimating.current = true;

        if (position === 'bottom') {
            gsap.to(sheetRef.current, {
                y: '100%',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    isAnimating.current = false;
                    onClose();
                },
            });
        } else if (position === 'left') {
            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating.current = false;
                    onClose();
                },
            });

            tl.to(sheetRef.current, { x: '-100%', duration: 0.3, ease: 'power2.in' });
            if (backdropRef.current) {
                tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15');
            }
        }
    };

    if (!isOpen) return null;

    if (position === 'bottom') {
        return (
            <div
                ref={sheetRef}
                className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-[#E1F2E2] p-4 shadow-2xl z-40"
            >
                {typeof children === 'function' ? children({ requestClose: handleClose }) : children}
            </div>
        );
    }

    if (position === 'left') {
        return (
            <div className="fixed inset-0 z-50 md:hidden">
                <div
                    ref={backdropRef}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                ></div>
                <div
                    ref={sheetRef}
                    className="fixed top-0 bottom-0 left-0 z-50 w-72 h-screen bg-white border-r border-[#E1F2E2] flex flex-col justify-between overflow-y-auto"
                >
                    {typeof children === 'function' ? children({ requestClose: handleClose }) : children}
                </div>
            </div>
        );
    }

    return null;
}
