import assert from "node:assert/strict";
import test from "node:test";
import { parallaxOffset, revealDelay, swipeStep } from "../app/components/parallax-math.js";

test("parallax offset scales and stays within its depth limit", () => {
  assert.equal(parallaxOffset(200, 0.05, 20), 10);
  assert.equal(parallaxOffset(1000, 0.05, 20), 20);
  assert.equal(parallaxOffset(-1000, 0.05, 20), -20);
  assert.equal(parallaxOffset(200, 0.05, 20, 0.5), 5);
});

test("reveal delay staggers nearby elements without growing forever", () => {
  assert.equal(revealDelay(0), 0);
  assert.equal(revealDelay(3), 255);
  assert.equal(revealDelay(20), 425);
});

test("mobile experience swipe changes one stop and preserves vertical scrolling", () => {
  assert.equal(swipeStep(2, -80, 12, 6), 3);
  assert.equal(swipeStep(2, 80, 12, 6), 1);
  assert.equal(swipeStep(2, -30, 4, 6), 2);
  assert.equal(swipeStep(2, -80, 100, 6), 2);
  assert.equal(swipeStep(0, 80, 0, 6), 0);
  assert.equal(swipeStep(5, -80, 0, 6), 5);
});
