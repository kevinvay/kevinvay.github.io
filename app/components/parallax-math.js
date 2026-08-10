export function parallaxOffset(distance, speed, limit, multiplier = 1) {
  return Math.max(-limit, Math.min(limit, distance * speed * multiplier));
}

export function revealDelay(index, step = 85, cap = 5) {
  return Math.min(Math.max(index, 0), cap) * step;
}
