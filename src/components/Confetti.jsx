import React, { useEffect, useRef } from 'react';

export default function Confetti({ active, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle settings
    const colors = [
      'rgba(0, 240, 255, 0.8)',  // Cyan
      'rgba(143, 0, 255, 0.8)',  // Purple
      'rgba(255, 0, 127, 0.8)',  // Pink
      'rgba(0, 230, 118, 0.8)',  // Neon green
      'rgba(255, 214, 0, 0.8)',  // Yellow
    ];

    const particles = [];
    const particleCount = 100;

    // Initialize particles starting from middle-bottom or scattered
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 60 - 30),
        y: canvas.height * 0.75, // Launch from the bottom-middle area (where quest logs usually sit)
        radius: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 15,
        vy: -Math.random() * 18 - 8,
        gravity: 0.35,
        drag: 0.98,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shrink: 0.992
      });
    }

    let framesElapsed = 0;
    const maxFrames = 150; // Stop after ~2.5s

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      framesElapsed++;

      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.opacity <= 0.05 || p.radius <= 0.5) return;
        activeParticles++;

        // Update physics
        p.vx *= p.drag;
        p.vy = (p.vy + p.gravity) * p.drag;
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.opacity *= p.shrink;
        p.radius *= p.shrink;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Semi-transparent specularity (glass confetti look)
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        // Draw small diamond/square
        ctx.beginPath();
        ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.rect(-p.radius / 2, -p.radius / 2, p.radius, p.radius / 2);
        ctx.fill();

        ctx.restore();
      });

      if (framesElapsed < maxFrames && activeParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
