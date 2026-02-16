import React, { useRef } from "react";
import "./SpotlightCard.css";

const SpotlightServiceCard = ({
  icon,
  title,
  description,
  color = "rgba(61, 2, 133, 0.35)",
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="spotlight-service-card"
      style={{ "--spotlight-color": color }}
    >
      <div className="ssc-icon">
        <i className={icon}></i>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default SpotlightServiceCard;
