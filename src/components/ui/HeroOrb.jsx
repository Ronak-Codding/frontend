import { useEffect, useRef } from "react";

const HeroOrb = ({ containerRef }) => {
  const canvasRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef?.current) return;

    const hero = containerRef.current;
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;

    canvas.style.position = "absolute";
    canvas.style.inset = 0;
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 1;

    hero.style.position = "relative";
    hero.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    hero.addEventListener("mousemove", onMove);

    let t = 0;

    const animate = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth inertia
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      // Floating center orb
      const cx = canvas.width * 0.65 + Math.sin(t) * 20;
      const cy = canvas.height * 0.45 + Math.cos(t * 1.2) * 20;

      // Distance reaction
      const dx = smooth.current.x - cx;
      const dy = smooth.current.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 250);

      const radius = 120 + influence * 40;

      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        radius
      );

      gradient.addColorStop(0, `rgba(120,160,255,${0.35 + influence * 0.3})`);
      gradient.addColorStop(0.6, `rgba(155,120,255,0.25)`);
      gradient.addColorStop(1, "rgba(155,120,255,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      hero.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      hero.removeChild(canvas);
    };
  }, [containerRef]);

  return null;
};

export default HeroOrb;
