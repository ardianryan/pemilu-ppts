import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function GsapModal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
    const backdropRef = useRef(null);
    const contentRef = useRef(null);
    const [isMounted, setIsMounted] = useState(isOpen);
    const cachedChildrenRef = useRef(children);

    if (isOpen) {
        cachedChildrenRef.current = children;
    }

    // Handle open/close animation lifecycle
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        } else if (isMounted) {
            if (backdropRef.current && contentRef.current) {
                gsap.killTweensOf([backdropRef.current, contentRef.current]);
                const tl = gsap.timeline({
                    onComplete: () => {
                        setIsMounted(false);
                    },
                });

                tl.to(contentRef.current, {
                    opacity: 0,
                    scale: 0.94,
                    y: 16,
                    duration: 0.28,
                    ease: 'power2.inOut',
                }).to(
                    backdropRef.current,
                    {
                        opacity: 0,
                        duration: 0.28,
                        ease: 'power2.inOut',
                    },
                    '<'
                );
            } else {
                setIsMounted(false);
            }
        }
    }, [isOpen]);

    // Handle entrance animation when mounted
    useEffect(() => {
        if (isMounted && isOpen && backdropRef.current && contentRef.current) {
            gsap.killTweensOf([backdropRef.current, contentRef.current]);

            // Disable background scrolling while modal is open
            document.body.style.overflow = 'hidden';

            gsap.fromTo(
                backdropRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.35, ease: 'power2.out' }
            );

            gsap.fromTo(
                contentRef.current,
                { opacity: 0, scale: 0.92, y: 24 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMounted, isOpen]);

    // Keyboard support for ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isMounted) return null;

    const activeChildren = isOpen ? children : cachedChildrenRef.current;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className="fixed inset-0 bg-[#101F15]/65 backdrop-blur-sm cursor-pointer"
            ></div>

            {/* Modal Dialog Box */}
            <div
                ref={contentRef}
                className={`relative bg-white rounded-3xl ${maxWidth} w-full shadow-2xl border border-[#E1F2E2] z-10 overflow-hidden`}
            >
                {typeof activeChildren === 'function' ? activeChildren({ requestClose: onClose }) : activeChildren}
            </div>
        </div>
    );
}
