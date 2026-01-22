"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
    id: string;
    folder: string;
    prefix: string;
    frameCount: number;
    title?: string;
    secondary?: string;
    subtitle?: string;
}

interface FilmControllerProps {
    scenes: Scene[];
}

const FilmController: React.FC<FilmControllerProps> = ({ scenes }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Track loaded scenes to avoid double loading
    const loadedScenes = useRef<Set<string>>(new Set());
    const imagesCache = useRef<{ [key: string]: HTMLImageElement[] }>({});

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const state = {
            globalFrame: 0,
            currentSceneIndex: 0,
            sceneFrame: 0
        };

        const render = () => {
            const scene = scenes[state.currentSceneIndex];
            const sceneImages = imagesCache.current[scene.id];

            if (!sceneImages || !sceneImages[state.sceneFrame] || !sceneImages[state.sceneFrame].complete) return;

            const img = sceneImages[state.sceneFrame];
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            const canvasWidth = canvas.width / dpr;
            const canvasHeight = canvas.height / dpr;
            const canvasRatio = canvasWidth / canvasHeight;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            }

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const setCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.scale(dpr, dpr);
            render();
        };

        const loadSceneImages = async (index: number) => {
            const scene = scenes[index];
            if (!scene || loadedScenes.current.has(scene.id)) return;

            loadedScenes.current.add(scene.id);
            const imgs: HTMLImageElement[] = [];

            const promises = Array.from({ length: scene.frameCount }).map((_, i) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.src = `/frames/${scene.folder}/${scene.prefix}${String(i + 1).padStart(4, '0')}.webp`;
                    imgs[i] = img;
                });
            });

            imagesCache.current[scene.id] = imgs;
            await Promise.all(promises);
            if (index === state.currentSceneIndex) render();
        };

        // Master Timeline
        const master = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${scenes.length * 200}%`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Logic to determine active scene and load ahead
                    const progress = self.progress;
                    const totalScenes = scenes.length;
                    const rawIndex = progress * totalScenes;
                    const sceneIndex = Math.min(Math.floor(rawIndex), totalScenes - 1);
                    const sceneProgress = (rawIndex % 1);

                    state.currentSceneIndex = sceneIndex;
                    state.sceneFrame = Math.floor(sceneProgress * (scenes[sceneIndex].frameCount - 1));

                    // Load current and next
                    loadSceneImages(sceneIndex);
                    if (sceneIndex < totalScenes - 1) loadSceneImages(sceneIndex + 1);

                    render();
                }
            }
        });

        // Set up text overlays in the same timeline
        scenes.forEach((scene, i) => {
            const segment = 1 / scenes.length;
            const start = i * segment;

            const textEl = textRefs.current[scene.id];
            if (textEl) {
                // Ensure first scene text is visible at start
                const fadeInStart = i === 0 ? 0 : start + (segment * 0.1);

                master.fromTo(textEl,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: segment * 0.2,
                        ease: "none"
                    },
                    fadeInStart
                ).to(textEl,
                    {
                        opacity: 0,
                        duration: segment * 0.2,
                        ease: "none"
                    },
                    start + (segment * 0.8)
                );
            }
        });

        // Initial Load
        loadSceneImages(0).then(() => {
            setCanvasSize();
            render();
        });

        window.addEventListener('resize', setCanvasSize);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [scenes]);

    return (
        <div ref={containerRef} className="film-viewport">
            <div className="canvas-stage">
                <canvas ref={canvasRef} />
            </div>

            <div className="film-content-layer">
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        ref={el => { textRefs.current[scene.id] = el }}
                        className="content-overlay"
                        style={{ opacity: 0 }}
                    >
                        <div className="text-container">
                            {scene.title && <h2 className="title">{scene.title}</h2>}
                            {scene.secondary && <p className="secondary">{scene.secondary}</p>}
                            {scene.subtitle && <p className="subtitle">{scene.subtitle}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilmController;
