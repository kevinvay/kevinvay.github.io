"use client";

import media from "../inner-media.json";

type MediaName = keyof typeof media;

export function FrameAnimation({ name }: { name: MediaName }) {
  const animation = media[name];
  const image = animation.frames[1] ?? animation.frames[0];

  return (
    <span className={`inner-frame-media inner-frame-media-${name}`} aria-hidden="true">
      <span className="inner-frame-reveal">
        <img src={image.src} alt="" />
      </span>
    </span>
  );
}
