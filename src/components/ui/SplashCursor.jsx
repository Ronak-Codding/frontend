import { useEffect } from "react";

const SplashCursor = () => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 1;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w, h;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const splashes = [];

    window.addEventListener("mousemove", (e) => {
      splashes.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        a: 1,
      });
    });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      splashes.forEach((s, i) => {
        s.r += 1.5;
        s.a -= 0.02;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120,140,255,${s.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (s.a <= 0) splashes.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return null;
};

export default SplashCursor;
