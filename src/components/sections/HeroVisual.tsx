'use client';

import React, { useRef, useEffect } from 'react';

export const HeroVisual: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Pointer coordinates with smooth easing
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetMouseX = clientX - rect.left;
      targetMouseY = clientY - rect.top;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let time = 0;

    // Multi-strand silver ribbons
    const strands = [
      { amplitude: 45, frequency: 0.0018, speed: 0.012, color: 'rgba(255, 255, 255, 0.85)', width: 2.5, yOffset: 0 },
      { amplitude: 65, frequency: 0.0015, speed: 0.009, color: 'rgba(198, 201, 206, 0.7)', width: 2.0, yOffset: -25 },
      { amplitude: 55, frequency: 0.0022, speed: 0.015, color: 'rgba(141, 168, 255, 0.75)', width: 1.8, yOffset: 30 },
      { amplitude: 80, frequency: 0.0012, speed: 0.007, color: 'rgba(133, 139, 148, 0.4)', width: 1.2, yOffset: 50 },
      { amplitude: 35, frequency: 0.0026, speed: 0.018, color: 'rgba(255, 255, 255, 0.3)', width: 1.0, yOffset: -50 }
    ];

    // Floating precision energy nodes
    const nodes = Array.from({ length: 24 }).map(() => ({
      xRatio: Math.random(),
      strandIndex: Math.floor(Math.random() * strands.length),
      radius: Math.random() * 2 + 1.5,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2
    }));

    const render = () => {
      time += 1;
      // Smooth pointer easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const pointerInfluenceY = (mouseY - height / 2) * 0.25;
      const pointerInfluenceX = (mouseX - width / 2) * 0.15;

      // Draw Strands
      strands.forEach((strand, sIdx) => {
        ctx.beginPath();
        const startY = height * 0.5 + strand.yOffset + pointerInfluenceY;

        ctx.moveTo(0, startY);

        const segments = 40;
        const step = width / segments;

        const points: { x: number; y: number }[] = [];

        for (let i = 0; i <= segments; i++) {
          const x = i * step;
          // Wave equation
          const wave1 = Math.sin(x * strand.frequency + time * strand.speed + sIdx) * strand.amplitude;
          const wave2 = Math.cos(x * (strand.frequency * 1.5) - time * (strand.speed * 0.8)) * (strand.amplitude * 0.4);
          // Distance from mouse for localized flex
          const distToMouse = Math.abs(x - mouseX);
          const flexFactor = Math.max(0, 1 - distToMouse / (width * 0.4)) * 30;
          const flex = Math.sin(time * 0.04 + sIdx) * flexFactor;

          const y = startY + wave1 + wave2 + flex;
          points.push({ x, y });
        }

        // Smooth bezier interpolation
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineWidth = strand.width;
        ctx.strokeStyle = strand.color;
        ctx.stroke();

        // Render nodes attached to this strand
        nodes
          .filter((n) => n.strandIndex === sIdx)
          .forEach((node) => {
            const index = Math.floor(node.xRatio * (points.length - 1));
            const p = points[index];
            if (!p) return;

            const alpha = 0.5 + Math.sin(time * node.pulseSpeed + node.phase) * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = sIdx === 2 ? `rgba(141, 168, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();

            // Subtle outer glow
            if (alpha > 0.7) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, node.radius * 2.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(141, 168, 255, ${alpha * 0.2})`;
              ctx.fill();
            }
          });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
};
