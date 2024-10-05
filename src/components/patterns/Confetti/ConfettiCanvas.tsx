"use client"
import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useConfetti } from '@/contexts/ConfettiContext';

const ConfettiCanvas: React.FC = () => {
    const { showConfetti } = useConfetti();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isConfettiRunning, setIsConfettiRunning] = useState(false);

    useEffect(() => {
        if (showConfetti && !isConfettiRunning) {
            setIsConfettiRunning(true);
            const canvas = canvasRef.current;
            if (canvas) {
                // Set canvas dimensions before initializing confetti
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Disable web workers to prevent OffscreenCanvas usage
                const myConfetti = confetti.create(canvas, {
                    resize: true,
                    useWorker: false, // Changed from true to false
                });

                const particleCount = 100;
                const spread = 360;
                const scalar = 1.5;
                const gravity = 0.6;
                const startVelocity = 30;

                const interval = setInterval(() => {
                    const randomOrigin = { x: Math.random(), y: Math.random() };
                    myConfetti({
                        particleCount,
                        spread,
                        origin: randomOrigin,
                        disableForReducedMotion: true,
                        scalar,
                        gravity,
                        startVelocity,
                    });
                }, 200);

                // Stop the confetti after a certain time
                setTimeout(() => {
                    clearInterval(interval);
                    setIsConfettiRunning(false);
                }, 2000);
            }
        }
    }, [showConfetti, isConfettiRunning]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                zIndex: 10000,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};

export default ConfettiCanvas;