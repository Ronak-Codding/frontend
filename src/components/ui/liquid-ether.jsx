import React, { useRef, useEffect } from "react";

export function LiquidEther({
  colors = ["#4F7CFF", "#8B8CFF", "#C7D2FF"],
  autoDemo = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let t = 0;

    function animate() {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2 + Math.sin(t + i) * 200,
          canvas.height / 2 + Math.cos(t + i) * 200,
          300,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, [colors]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
