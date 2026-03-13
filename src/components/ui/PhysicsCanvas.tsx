import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  type: 'atom' | 'dot' | 'cross';
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitCenterX: number;
  orbitCenterY: number;
  useOrbit: boolean;
}

export default function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let time = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const gold = 'rgba(201, 168, 76,';
    const blue = 'rgba(74, 158, 255,';

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 18000);
      for (let i = 0; i < count; i++) {
        const useOrbit = Math.random() > 0.5;
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        particles.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          type: ['atom', 'dot', 'cross'][Math.floor(Math.random() * 3)] as Particle['type'],
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
          orbitRadius: Math.random() * 40 + 15,
          orbitCenterX: cx,
          orbitCenterY: cy,
          useOrbit,
        });
      }
    };

    const drawAtom = (x: number, y: number, r: number, opacity: number, color: string) => {
      // Nucleus
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `${color} ${opacity})`;
      ctx.fill();

      // Orbit rings
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y, r * 5, r * 2, (i * Math.PI) / 3, 0, Math.PI * 2);
        ctx.strokeStyle = `${color} ${opacity * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Electron
      const angle = time * 0.02 * (i => i)(0) + x;
      const ex = x + Math.cos(angle) * r * 5;
      const ey = y + Math.sin(angle) * r * 2;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `${color} ${opacity * 0.8})`;
      ctx.fill();
    };

    const drawWave = (y: number, amplitude: number, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= width; x += 2) {
        const waveY = y + Math.sin((x / width) * Math.PI * 6 + time * 0.015) * amplitude;
        ctx.lineTo(x, waveY);
      }
      ctx.strokeStyle = `${gold} ${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawGrid = () => {
      const spacing = 60;
      ctx.strokeStyle = `${gold} 0.04)`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawCross = (x: number, y: number, size: number, opacity: number) => {
      ctx.strokeStyle = `${gold} ${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time++;

      drawGrid();

      // Sine waves
      drawWave(height * 0.3, 18, 0.07);
      drawWave(height * 0.7, 12, 0.05);

      // Particles
      particles.forEach((p, idx) => {
        if (p.useOrbit) {
          p.orbitAngle += p.orbitSpeed;
          p.x = p.orbitCenterX + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = p.orbitCenterY + Math.sin(p.orbitAngle) * p.orbitRadius * 0.5;
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        const color = idx % 3 === 0 ? blue : gold;

        if (p.type === 'atom') {
          drawAtom(p.x, p.y, p.radius + 1, p.opacity, color);
        } else if (p.type === 'cross') {
          drawCross(p.x, p.y, p.radius * 3, p.opacity * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${color} ${p.opacity})`;
          ctx.fill();
        }
      });

      // Connect nearby dots
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${gold} ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
