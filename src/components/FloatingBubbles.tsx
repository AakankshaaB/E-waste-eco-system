import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

const FloatingBubbles = ({ count = 18, hueRange = [90, 150] as [number, number] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    bubblesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas.parentElement?.offsetWidth || 800),
      y: Math.random() * (canvas.parentElement?.offsetHeight || 800),
      size: Math.random() * 60 + 20,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * (hueRange[1] - hueRange[0]) + hueRange[0],
    }));

    const animate = () => {
      const w = canvas.parentElement?.offsetWidth || 0;
      const h = canvas.parentElement?.offsetHeight || 0;
      ctx.clearRect(0, 0, w, h);
      bubblesRef.current.forEach((b) => {
        b.x += b.speedX;
        b.y += b.speedY;
        if (b.x < -b.size) b.x = w + b.size;
        if (b.x > w + b.size) b.x = -b.size;
        if (b.y < -b.size) b.y = h + b.size;
        if (b.y > h + b.size) b.y = -b.size;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
        grad.addColorStop(0, `hsla(${b.hue}, 70%, 60%, ${b.opacity})`);
        grad.addColorStop(1, `hsla(${b.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count, hueRange]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default FloatingBubbles;
