import React, { useRef, useEffect } from 'react';

interface LetterGlitchProps {
    glitchColors: string[];
    glitchSpeed: number;
    centerVignette: boolean;
    outerVignette: boolean;
    smooth: boolean;
    theme?: string;
}

const LetterGlitch: React.FC<LetterGlitchProps> = ({
    glitchColors,
    glitchSpeed,
    centerVignette,
    outerVignette,
    smooth,
    theme = 'dark',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const letters = useRef<
        {
            char: string;
            color: string;
            targetColor: string;
            colorProgress: number;
            glitchFactor: number;
            originalChar: string;
        }[]
    >([]);
    const grid = useRef({ columns: 0, rows: 0 });
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const lastGlitchTime = useRef(Date.now());

    const fontSize = 16;
    const charWidth = 10;
    const charHeight = 20;

    const lettersAndSymbols = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/',
        '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9',
    ];

    const getRandomChar = () => {
        return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
    };

    const getRandomColor = () => {
        return glitchColors[Math.floor(Math.random() * glitchColors.length)];
    };

    const hexToRgb = (hex: string) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    const interpolateColor = (
        start: { r: number; g: number; b: number },
        end: { r: number; g: number; b: number },
        factor: number
    ) => {
        const result = {
            r: Math.round(start.r + (end.r - start.r) * factor),
            g: Math.round(start.g + (end.g - start.g) * factor),
            b: Math.round(start.b + (end.b - start.b) * factor),
        };
        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        context.current = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            grid.current.columns = Math.ceil(canvas.width / charWidth);
            grid.current.rows = Math.ceil(canvas.height / charHeight);
            letters.current = Array(grid.current.columns * grid.current.rows)
                .fill(null)
                .map(() => {
                    const color = getRandomColor();
                    return {
                        char: getRandomChar(),
                        color: color,
                        targetColor: color,
                        colorProgress: 1,
                        glitchFactor: 0,
                        originalChar: getRandomChar(),
                    };
                });
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const animate = () => {
            if (!context.current || !canvas) return;
            const ctx = context.current;

            // Clear canvas but do NOT fill with background color to allow transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const deltaTime = now - lastGlitchTime.current;

            letters.current.forEach((letter, index) => {
                const col = index % grid.current.columns;
                const row = Math.floor(index / grid.current.columns);
                const x = col * charWidth;
                const y = row * charHeight;

                if (smooth) {
                    if (letter.glitchFactor > 0) {
                        letter.glitchFactor -= 0.05;
                        if (letter.glitchFactor < 0) letter.glitchFactor = 0;
                    }

                    if (letter.colorProgress < 1) {
                        letter.colorProgress += 0.05;
                        if (letter.colorProgress > 1) letter.colorProgress = 1;

                        const startRgb = hexToRgb(letter.color);
                        const endRgb = hexToRgb(letter.targetColor);
                        if (startRgb && endRgb) {
                            letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
                        }
                    }
                } else {
                    letter.glitchFactor = 0;
                }

                if (deltaTime > glitchSpeed && Math.random() < 0.01) {
                    letter.char = getRandomChar();
                    letter.targetColor = getRandomColor();
                    if (!smooth) letter.color = letter.targetColor;
                    else letter.colorProgress = 0;

                    letter.glitchFactor = 1;
                }

                ctx.fillStyle = letter.color;
                ctx.font = `${fontSize}px monospace`;
                ctx.fillText(letter.char, x, y);
            });

            if (deltaTime > glitchSpeed) {
                lastGlitchTime.current = now;
            }

            if (outerVignette) {
                const outerVignetteGradient = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    canvas.width / 2,
                    canvas.height / 2,
                    Math.max(canvas.width, canvas.height) / 1.5
                );
                outerVignetteGradient.addColorStop(0, 'rgba(0,0,0,0)');

                // Theme-aware vignette color
                const vignetteColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
                outerVignetteGradient.addColorStop(1, vignetteColor);

                ctx.fillStyle = outerVignetteGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (centerVignette) {
                const centerVignetteGradient = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    canvas.width / 2,
                    canvas.height / 2,
                    Math.max(canvas.width, canvas.height) / 4
                );

                // Theme-aware vignette color
                const vignetteColor = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';

                centerVignetteGradient.addColorStop(0, vignetteColor);
                centerVignetteGradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = centerVignetteGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [glitchColors, glitchSpeed, centerVignette, outerVignette, smooth, theme]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default LetterGlitch;
