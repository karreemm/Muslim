"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "../../../context/general/LanguageContext";

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
  shape: "star" | "circle" | "diamond" | "crescent" | "sparkle";
  delay: number;
  opacity: number;
}

interface GoalCelebrationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const celebrationColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
  "hsl(var(--info))",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(id: number, centerX: number, centerY: number): Particle {
  const angle = randomBetween(0, Math.PI * 2);
  const velocity = randomBetween(2, 8);
  const colors = celebrationColors;
  
  return {
    id,
    x: centerX,
    y: centerY,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity - randomBetween(2, 5), // Upward bias
    size: randomBetween(4, 16),
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-8, 8),
    life: 0,
    maxLife: randomBetween(120, 200),
    shape: (["star", "circle", "diamond", "sparkle"] as const)[Math.floor(Math.random() * 4)],
    delay: randomBetween(0, 20),
    opacity: 1,
  };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points: number = 5) {
  const inner = r * 0.4;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / points;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  for (let i = 0; i < points; i++) {
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.lineTo(cx, cy - r);
  ctx.closePath();
}

function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const spikes = 4;
  const inner = r * 0.2;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.closePath();
}

export default function GoalCelebration({ show, message, onClose }: GoalCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);
  const { language } = useLanguage();
  const animationRef = useRef<boolean>(false);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    particlesRef.current = Array.from({ length: 150 }, (_, i) => 
      createParticle(i, centerX, centerY)
    );
  }, []);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setCanDismiss(false);
      setTextVisible(false);
      
      const timer1 = setTimeout(() => setTextVisible(true), 200);
      const timer2 = setTimeout(() => setCanDismiss(true), 2500);
      
      initParticles();
      animationRef.current = true;
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setTextVisible(false);
      setCanDismiss(false);
      const timer = setTimeout(() => {
        setVisible(false);
        animationRef.current = false;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [show, initParticles]);

  useEffect(() => {
    if (!visible) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length > 0) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        particlesRef.current.forEach(p => {
          if (p.life === 0) {
            p.x = centerX;
            p.y = centerY;
          }
        });
      }
    };
    
    resize();
    window.addEventListener("resize", resize);

    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!animationRef.current) return;
      
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (particlesRef.current.length < 200 && Math.random() > 0.9) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          particlesRef.current.push(createParticle(Date.now(), centerX, centerY));
        }

        particlesRef.current = particlesRef.current.filter((p) => {
          if (p.life < p.delay) {
            p.life++;
            return true;
          }
          
          p.life++;
          if (p.life > p.maxLife) return false;

          const age = (p.life - p.delay) / (p.maxLife - p.delay);
          p.vy += 0.15; 
          p.vx *= 0.99; 
          p.vy *= 0.99;
          
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          let alpha = 1;
          if (age < 0.1) alpha = age / 0.1;
          else if (age > 0.6) alpha = 1 - (age - 0.6) / 0.4;
          
          p.opacity = alpha;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;

          if (p.shape === "star") {
            drawStar(ctx, 0, 0, p.size / 2, 5);
            ctx.fill();
          } else if (p.shape === "sparkle") {
            drawSparkle(ctx, 0, 0, p.size / 2);
            ctx.fill();
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "diamond") {
            ctx.beginPath();
            ctx.moveTo(0, -p.size / 2);
            ctx.lineTo(p.size / 2, 0);
            ctx.lineTo(0, p.size / 2);
            ctx.lineTo(-p.size / 2, 0);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
          return true;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  const handleClick = () => {
    if (canDismiss) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-500 ${
          textVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <div className="absolute -inset-20 rounded-full bg-primary/20 blur-3xl animate-pulse" />

        <div
          className="relative px-12 py-10 rounded-3xl text-center max-w-md mx-4"
          style={{
            background: "linear-gradient(135deg, hsl(var(--card) / 0.4) 0%, hsl(var(--card) / 0.2) 100%)",
            boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.25), inset 0 1px 0 hsl(var(--foreground) / 0.1)",
            border: "1px solid hsl(var(--border) / 0.5)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex justify-center gap-3 mb-4">
            {["✨", "🎉", "✨"].map((emoji, i) => (
              <span
                key={i}
                className="text-3xl animate-bounce"
                style={{ 
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "1s"
                }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {message}
          </h2>

          <div className="flex justify-center gap-3 mt-4">
            {["⭐", "🌟", "⭐"].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ 
                  animationDelay: `${i * 150 + 300}ms`,
                  animationDuration: "1s"
                }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div
            className={`mt-6 transition-all duration-500 ${canDismiss ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <p className="text-sm text-muted-foreground font-medium">
              {language === "ar"
                ? "اضغط في أي مكان للمتابعة"
                : "Tap anywhere to continue"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}