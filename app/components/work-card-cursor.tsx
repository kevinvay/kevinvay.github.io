"use client";

import { useEffect, useRef } from "react";

const COVER_SELECTOR = ".work-card, .directory-card";

export function WorkCardCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cursor = cursorRef.current;
    if (!cursor || !finePointer.matches) return;

    const move = (event: PointerEvent) => {
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const card = hit?.closest(COVER_SELECTOR);
      if (!card) {
        cursor.classList.remove("is-visible");
        return;
      }
      cursor.classList.add("is-visible");
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };
    const hide = () => cursor.classList.remove("is-visible");

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div className="work-card-cursor" ref={cursorRef} aria-hidden="true">
      <span>Watch</span>
      <span>Case</span>
    </div>
  );
}
