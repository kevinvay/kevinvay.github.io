"use client";

import { useState } from "react";

const lightImage = "/figma-assets/cases/greater-bay-air/block-06-01.png";
const darkImage = "/figma-assets/cases/greater-bay-air/block-06-dark.png";

export function AirlineDarkMode() {
  const [dark, setDark] = useState(false);

  return (
    <figure className={`airline-dark-mode${dark ? " is-dark" : ""}`}>
      <img src={dark ? darkImage : lightImage} alt={dark ? "大湾区航空应用夜间模式界面" : "大湾区航空应用浅色模式界面"} />
      <figcaption className="airline-dark-mode-copy">
        <div className="airline-dark-mode-title">
          <span>释放（</span>
          <button
            aria-checked={dark}
            aria-label="切换大湾区航空应用夜间模式"
            className="airline-dark-mode-switch"
            onClick={() => setDark((value) => !value)}
            role="switch"
            type="button"
          ><span /></button>
          <span>）夜间模式</span>
        </div>
        <p>适合那些夜猫子时刻或当您想为您的旅行计划增添一些神秘感时。</p>
      </figcaption>
    </figure>
  );
}
