import React, { useRef } from "react";
import "./SpotlightContactCard.css";

const SpotlightContactCard = ({ icon, title, children, color }) => {
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
      className="spotlight-contact-card"
      style={{ "--spotlight-color": color }}
    >
      <div className="scc-icon">
        <i className={icon}></i>
      </div>

      <h3>{title}</h3>
      <div className="scc-content">{children}</div>
    </div>
  );
};

export default SpotlightContactCard;
