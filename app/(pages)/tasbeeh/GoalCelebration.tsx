"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  shape: "star" | "circle" | "diamond" | "crescent";
  delay: number;
}

interface GoalCelebrationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const getCelebrationColors = () => {
  if (typeof window === "undefined") {
    return [
      "hsl(var(--celebration-1))",
      "hsl(var(--celebration-2))",
      "hsl(var(--celebration-3))",
      "hsl(var(--celebration-4))",
      "hsl(var(--celebration-5))",
      "hsl(var(--celebration-6))",
      "hsl(var(--celebration-7))",
    ];
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const values = [1, 2, 3, 4, 5, 6, 7].map((i) =>
    rootStyles.getPropertyValue(`--celebration-${i}`).trim(),
  );

  return values.map((value) => `hsl(${value})`);
};

let celebrationColorsCache: string[] | null = null;

const getCachedCelebrationColors = () => {
  if (!celebrationColorsCache) {
    celebrationColorsCache = getCelebrationColors();
  }
  return celebrationColorsCache;
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(id: number): Particle {
  const colors = getCachedCelebrationColors();
  const edge = Math.floor(Math.random() * 4);
  let x = 0,
    y = 0;
  if (edge === 0) {
    x = randomBetween(0, 100);
    y = -5;
  } else if (edge === 1) {
    x = 105;
    y = randomBetween(0, 100);
  } else if (edge === 2) {
    x = randomBetween(0, 100);
    y = 105;
  } else {
    x = -5;
    y = randomBetween(0, 100);
  }

  const cx = 50,
    cy = 50;
  const dx = cx - x + randomBetween(-20, 20);
  const dy = cy - y + randomBetween(-20, 20);
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = randomBetween(0.3, 0.9);

  return {
    id,
    x,
    y,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    size: randomBetween(6, 18),
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-3, 3),
    life: 0,
    maxLife: randomBetween(90, 160),
    shape: (["star", "circle", "diamond", "crescent"] as const)[
      Math.floor(Math.random() * 4)
    ],
    delay: randomBetween(0, 40),
  };
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
) {
  const spikes = 5;
  const inner = r * 0.4;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.lineTo(cx, cy - r);
  ctx.closePath();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.6, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r * 0.6, cy);
  ctx.closePath();
}

export default function GoalCelebration({
  show,
  message,
  onClose,
}: GoalCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const tickRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (show) {
      setVisible(true);
      setCanDismiss(false);
      setTimeout(() => setTextVisible(true), 300);
      setTimeout(() => setCanDismiss(true), 3000);
      particlesRef.current = Array.from({ length: 120 }, (_, i) =>
        createParticle(i),
      );
    } else {
      setTextVisible(false);
      setCanDismiss(false);
      setTimeout(() => setVisible(false), 600);
    }
  }, [show]);

  const handleClick = () => {
    if (canDismiss) onClose();
  };

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      tickRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (tickRef.current % 4 === 0 && particlesRef.current.length < 200) {
        particlesRef.current.push(createParticle(Date.now() + Math.random()));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.life < p.delay) {
          p.life++;
          return true;
        }
        p.life++;
        if (p.life > p.maxLife) return false;

        const progress = (p.life - p.delay) / (p.maxLife - p.delay);
        const alpha =
          progress < 0.2
            ? progress / 0.2
            : progress > 0.7
              ? 1 - (progress - 0.7) / 0.3
              : 1;

        const px = (p.x / 100) * canvas.width + p.vx * (p.life - p.delay) * 2;
        const py =
          (p.y / 100) * canvas.height +
          p.vy * (p.life - p.delay) * 2 +
          0.05 * (p.life - p.delay) ** 1.5;

        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.translate(px, py);
        ctx.rotate(((p.rotation + p.rotationSpeed * p.life) * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.shape === "star") {
          drawStar(ctx, 0, 0, p.size / 2);
          ctx.fill();
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "diamond") {
          drawDiamond(ctx, 0, 0, p.size / 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(p.size * 0.2, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }

        ctx.restore();
        return true;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      <div
        className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-500 ${
          textVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="absolute -inset-12 rounded-full bg-primary/10 blur-2xl animate-pulse" />

        <div
          className="relative px-10 py-8 rounded-2xl text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--card) / 0.24) 0%, hsl(var(--card) / 0.12) 100%)",
            boxShadow:
              "0 0 60px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(var(--foreground) / 0.2)",
            border: "1px solid hsl(var(--border) / 0.4)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex justify-center gap-2 mb-3">
            {["✦", "★", "✦"].map((s, i) => (
              <span
                key={i}
                className="text-accent text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {s}
              </span>
            ))}
          </div>

          <p className="text-3xl md:text-4xl font-bold leading-snug ">
            {message}
          </p>

          <div className="flex justify-center gap-2 mt-3">
            {["✦", "★", "✦"].map((s, i) => (
              <span
                key={i}
                className="text-primary text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.15 + 0.3}s` }}
              >
                {s}
              </span>
            ))}
          </div>

          <p
            className="mt-4 text-muted-foreground text-sm transition-opacity duration-500"
            style={{ opacity: canDismiss ? 1 : 0 }}
          >
            {language === "ar"
              ? "اضغط في أي مكان للمتابعة"
              : "tap anywhere to continue"}
          </p>
        </div>
      </div>
    </div>
  );
}
