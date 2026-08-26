"use client";

import { useEffect } from "react";

const imageSelector = "img.optimized-image";

function markImage(image: HTMLImageElement) {
  image.classList.remove("is-image-loading", "is-image-loaded", "is-image-error");
  image.classList.add(image.complete
    ? image.naturalWidth > 0 ? "is-image-loaded" : "is-image-error"
    : "is-image-loading");
}

function markImagesWithin(node: Node) {
  if (!(node instanceof Element)) return;
  if (node.matches(imageSelector)) markImage(node as HTMLImageElement);
  node.querySelectorAll<HTMLImageElement>(imageSelector).forEach(markImage);
}

export function MediaLoadController() {
  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>(imageSelector).forEach(markImage);

    const handleImageEvent = (event: Event) => {
      const image = event.target;
      if (image instanceof HTMLImageElement && image.matches(imageSelector)) markImage(image);
    };
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(markImagesWithin));
    });

    document.addEventListener("load", handleImageEvent, true);
    document.addEventListener("error", handleImageEvent, true);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("load", handleImageEvent, true);
      document.removeEventListener("error", handleImageEvent, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
