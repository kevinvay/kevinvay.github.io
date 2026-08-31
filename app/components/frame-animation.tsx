"use client";

import media from "../inner-media.json";
import { OptimizedImage } from "./optimized-image";

type MediaName = keyof typeof media;

export function FrameAnimation({ name }: { name: MediaName }) {
  const image = media[name];

  return (
    <span className={`inner-frame-media inner-frame-media-${name}`} aria-hidden="true">
      <span className="inner-frame-reveal">
        <OptimizedImage src={image.src} alt="" loading="eager" />
      </span>
    </span>
  );
}
