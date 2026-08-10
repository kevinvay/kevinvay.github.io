"use client";

import { useState, type CSSProperties } from "react";

const image = "/figma-assets/cases/greater-bay-air/comparison-default-1.5x.png";

export function AirlineComparison() {
  const [position, setPosition] = useState(50);

  return (
    <figure className="airline-comparison" style={{ "--split": `${position}%` } as CSSProperties}>
      <img src={image} alt="大湾区航空应用改版后界面" />
      <div className="airline-comparison-before" aria-hidden="true"><img src={image} alt="" /></div>
      <div className="airline-comparison-line" aria-hidden="true"><span>↔</span></div>
      <input
        aria-label="拖动查看大湾区航空应用改版前后对比"
        max="100"
        min="0"
        onInput={event => setPosition(Number(event.currentTarget.value))}
        type="range"
        value={position}
      />
      <span className="airline-comparison-hint">滑动这条线 ↔</span>
    </figure>
  );
}
