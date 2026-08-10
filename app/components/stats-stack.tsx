"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  ["10", "Years of work"],
  ["60+", "Projects of all sizes"],
  ["8", "Proficient in tools"],
  ["4", "On my experience list"],
  ["1", "Usability design system"],
  ["3", "Skills of design direction"],
];

export function StatsStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || expanded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setExpanded(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <section
      ref={sectionRef}
      className={`stats-stack${expanded ? " is-expanded" : ""}`}
      aria-label="Experience statistics"
    >
      {stats.map(([value, label], index) => (
        <article className={`stat stat-${index + 1}`} key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}
