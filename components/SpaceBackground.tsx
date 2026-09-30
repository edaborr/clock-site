"use client";

import { useEffect, useRef } from "react";

interface Star {
  baseX: number;
  baseY: number;
  z: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    let stars: Star[] = [];
    const rebuildStars = () => {
      const count = Math.floor((width * height) / 3200);
      stars = Array.from({ length: count }, () => ({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
      }));
    };
    rebuildStars();

    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      const y = Math.random() * height * 0.5;
      shootingStars.push({
        x: fromLeft ? -50 : width + 50,
        y,
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 5),
        vy: 2 + Math.random() * 2,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    };

    let targetX = width / 2;
    let targetY = height / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    const handleResize = () => {
      resizeCanvas();
      rebuildStars();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      const dx = (currentX - width / 2) / width;
      const dy = (currentY - height / 2) / height;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width / 2 + dx * 60,
        height / 2 + dy * 60,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, "#101534");
      gradient.addColorStop(0.55, "#080a1e");
      gradient.addColorStop(1, "#05060f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        const parallax = star.z * 50;
        const px = star.baseX - dx * parallax;
        const py = star.baseY - dy * parallax;
        const radius = star.z * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${0.35 + star.z * 0.55})`;
        ctx.shadowColor = "rgba(140, 160, 255, 0.8)";
        ctx.shadowBlur = star.z * 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (Math.random() < 0.006) spawnShootingStar();

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;

        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0 || s.x < -100 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - s.vx * 6;
        const tailY = s.y - s.vy * 6;
        const trail = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        trail.addColorStop(0, `rgba(220, 230, 255, ${alpha})`);
        trail.addColorStop(1, "rgba(220, 230, 255, 0)");
        ctx.strokeStyle = trail;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 220);
      glow.addColorStop(0, "rgba(124, 159, 255, 0.10)");
      glow.addColorStop(1, "rgba(124, 159, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}