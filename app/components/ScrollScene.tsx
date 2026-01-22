"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSceneProps {
    folder: string;
    prefix: string;
    frameCount: number;
    title?: string;
    subtitle?: string;
    id: string;
}

const ScrollScene: React.FC<ScrollSceneProps> = ({ folder, prefix, frameCount, title, subtitle, id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const images: HTMLImageElement[] = [];
        const sequence = { frame: 0 };
        let isLoaded = false;

        const render = () => {
            const img = images[sequence.frame];
            if (!img || !img.complete) return;

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const setCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            render();
        };

        const setupScroll = () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            tl.to(sequence, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render
            });

            if (titleRef.current) {
                tl.to(titleRef.current, { opacity: 1, duration: 0.2 }, 0.2)
                    .to(titleRef.current, { opacity: 0, duration: 0.2 }, 0.8);
            }

            if (subtitleRef.current) {
                tl.to(subtitleRef.current, { opacity: 1, duration: 0.2 }, 0.3)
                    .to(subtitleRef.current, { opacity: 0, duration: 0.2 }, 0.7);
            }
        };

        const startLoading = () => {
            if (isLoaded) return;
            isLoaded = true;

            const currentFrame = (index: number) =>
                `/frames/${folder}/${prefix}${String(index + 1).padStart(4, '0')}.webp`;

            let loadedCount = 0;
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === 1) render();
                    if (loadedCount === frameCount) setupScroll();
                };
                img.src = currentFrame(i);
                images.push(img);
            }
        };

        const loadingTrigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom+=100%",
            onEnter: startLoading,
            once: true
        });

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            loadingTrigger.kill();
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === containerRef.current) st.kill();
            });
        };
    }, [folder, prefix, frameCount]);

    return (
        <div id={id} ref={containerRef} className="scene-container">
            <div className="canvas-wrapper">
                <canvas ref={canvasRef} />
            </div>
            {(title || subtitle) && (
                <div className="content-overlay">
                    <div className="text-container">
                        {title && <h2 ref={titleRef} className="title">{title}</h2>}
                        {subtitle && <p ref={subtitleRef} className="subtitle">{subtitle}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScrollScene;
