"use client";

import { useLayoutEffect } from "react";

const VIEWPORT_CONTENT = "width=device-width, initial-scale=1, viewport-fit=cover";

export function MobileViewport() {
  useLayoutEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) return;
    if (meta.content !== VIEWPORT_CONTENT) meta.content = VIEWPORT_CONTENT;
  }, []);

  return null;
}
