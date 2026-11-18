"use client";

import { useLayoutEffect } from "react";

const VIEWPORT_CONTENT = "width=device-width, initial-scale=1, viewport-fit=cover";
const FALLBACK = "#0e0e0e";

function opaqueHex(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].replace("/", " ").split(/[\s,]+/).filter(Boolean);
  const channels = parts.slice(0, 3).map(Number);
  const alpha = parts.length > 3 ? Number(parts[3]) : 1;
  if (channels.some((channel) => Number.isNaN(channel)) || alpha < 0.85) return null;
  return `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
}

function colorBehind(x: number, y: number) {
  const hit = document.elementsFromPoint(x, Math.min(Math.max(y, 0), window.innerHeight - 1))
    .find((element) => element instanceof HTMLElement);
  let node = hit instanceof HTMLElement ? hit : null;
  while (node) {
    const color = opaqueHex(getComputedStyle(node).backgroundColor);
    if (color) return color;
    node = node.parentElement;
  }
  return FALLBACK;
}

export function MobileViewport() {
  useLayoutEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (viewport && viewport.content !== VIEWPORT_CONTENT) viewport.content = VIEWPORT_CONTENT;

    let theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!theme) {
      theme = document.createElement("meta");
      theme.name = "theme-color";
      document.head.appendChild(theme);
    }

    let frame = 0;
    const syncTheme = () => {
      frame = 0;
      const current = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ?? theme;
      const next = colorBehind(window.innerWidth / 2, 1);
      if (current.content !== next) current.content = next;
    };
    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncTheme);
    };

    syncTheme();
    document.addEventListener("scroll", requestSync, { capture: true, passive: true });
    window.addEventListener("resize", requestSync);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", requestSync, true);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  return null;
}
