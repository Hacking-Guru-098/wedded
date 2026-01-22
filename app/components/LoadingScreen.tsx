"use client";

import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
            <div className="mb-8 text-center">
                <h1 className="text-4xl text-gold mb-2 font-serif italic">The Wedding of</h1>
                <h2 className="text-2xl text-white tracking-[0.3em] font-light">MANISHA & SHUBHAM</h2>
            </div>
            <div className="w-64 h-[2px] bg-zinc-800 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-gold transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="mt-4 text-xs text-zinc-500 uppercase tracking-widest">Entering the Story...</p>

            <style jsx>{`
                .text-gold { color: #d4af37; }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
