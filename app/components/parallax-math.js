export function parallaxOffset(distance, speed, limit, multiplier = 1) {
  return Math.max(-limit, Math.min(limit, distance * speed * multiplier));
}

/* Approaches the depth limit instead of stopping against it. */
export function parallaxOffsetSoft(distance, speed, limit, multiplier = 1) {
  if (!limit) return 0;
  const raw = distance * speed * multiplier;
  return raw / (1 + Math.abs(raw) / limit);
}

export function isMotionStudyPath(pathname) {
  return pathname === "/motion" || pathname === "/motion/";
}

export function revealDelay(index, step = 85, cap = 5) {
  return Math.min(Math.max(index, 0), cap) * step;
}

export function swipeStep(current, deltaX, deltaY, count, threshold = 44) {
  if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) return current;
  return deltaX < 0 ? Math.min(count - 1, current + 1) : Math.max(0, current - 1);
}
