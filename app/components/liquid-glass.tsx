"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LiquidGlassConfig = {
  enabled: boolean;
  glassThickness: number;
  bezelWidth: number;
  ior: number;
  scaleRatio: number;
  dispersionStrength: number;
  blur: number;
  tintOpacity: number;
};

export const DEFAULT_LIQUID_GLASS_CONFIG: LiquidGlassConfig = {
  enabled: true,
  glassThickness: 40,
  bezelWidth: 36,
  ior: 1.7,
  scaleRatio: 1.4,
  dispersionStrength: 4,
  blur: 3,
  tintOpacity: 0.2,
};

function surfaceFn(x: number) {
  return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
}

function makeRefractionProfile(glassThickness: number, bezelWidth: number, ior: number, samples = 128) {
  const profile = new Float64Array(samples);
  const eta = 1 / ior;

  for (let index = 0; index < samples; index += 1) {
    const x = index / samples;
    const y = surfaceFn(x);
    const delta = x < 1 ? 0.0001 : -0.0001;
    const derivative = (surfaceFn(x + delta) - y) / delta;
    const magnitude = Math.hypot(derivative, 1);
    const normalX = -derivative / magnitude;
    const normalY = -1 / magnitude;
    const dot = normalY;
    const k = 1 - eta * eta * (1 - dot * dot);

    if (k < 0) continue;
    const factor = eta * dot + Math.sqrt(k);
    const refractedX = -factor * normalX;
    const refractedY = eta - factor * normalY;
    profile[index] = refractedX * ((y * bezelWidth + glassThickness) / refractedY);
  }

  return profile;
}

function makeDisplacementMap(width: number, height: number, config: LiquidGlassConfig) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return { map: "", maxDisplacement: 1 };

  const pixels = context.createImageData(width, height);
  const data = pixels.data;
  data.fill(0);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = 128;
    data[index + 1] = 128;
    data[index + 3] = 255;
  }

  const radius = Math.min(width, height) / 2;
  const bezel = Math.min(config.bezelWidth, radius - 1);
  const profile = makeRefractionProfile(config.glassThickness, bezel, config.ior);
  const maxDisplacement = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const outerRadiusSquared = (radius + 1) ** 2;
  const radiusSquared = radius ** 2;
  const innerRadiusSquared = Math.max(radius - bezel, 0) ** 2;
  const straightWidth = width - radius * 2;
  const straightHeight = height - radius * 2;

  for (let pixelY = 0; pixelY < height; pixelY += 1) {
    for (let pixelX = 0; pixelX < width; pixelX += 1) {
      const x = pixelX < radius
        ? pixelX - radius
        : pixelX >= width - radius ? pixelX - radius - straightWidth : 0;
      const y = pixelY < radius
        ? pixelY - radius
        : pixelY >= height - radius ? pixelY - radius - straightHeight : 0;
      const distanceSquared = x * x + y * y;
      if (distanceSquared > outerRadiusSquared || distanceSquared < innerRadiusSquared) continue;

      const distance = Math.sqrt(distanceSquared);
      if (!distance) continue;
      const fromEdge = radius - distance;
      const opacity = distanceSquared < radiusSquared
        ? 1
        : 1 - (distance - radius) / ((radius + 1) - radius);
      if (opacity <= 0) continue;

      const profileIndex = Math.min(Math.floor((fromEdge / bezel) * profile.length), profile.length - 1);
      const displacement = profile[Math.max(0, profileIndex)] || 0;
      const normalizedX = (-(x / distance) * displacement) / maxDisplacement;
      const normalizedY = (-(y / distance) * displacement) / maxDisplacement;
      const index = (pixelY * width + pixelX) * 4;
      data[index] = Math.max(0, Math.min(255, Math.round(128 + normalizedX * 127 * opacity)));
      data[index + 1] = Math.max(0, Math.min(255, Math.round(128 + normalizedY * 127 * opacity)));
    }
  }

  context.putImageData(pixels, 0, 0);
  return { map: canvas.toDataURL("image/png"), maxDisplacement };
}

export function LiquidGlass({ config }: { config: LiquidGlassConfig }) {
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const baseFilterId = `liquid-glass-${useId().replace(/:/g, "")}`;
  const configKey = `${config.glassThickness}-${config.bezelWidth}-${config.ior}`;
  const [filter, setFilter] = useState<{ width: number; height: number; map: string; maxDisplacement: number; configKey: string } | null>(null);
  const filterId = filter
    ? `${baseFilterId}-${filter.configKey}-${config.scaleRatio}-${config.dispersionStrength}-${config.blur}`.replace(/[^a-zA-Z0-9_-]/g, "_")
    : baseFilterId;

  useEffect(() => {
    setPortalHost(document.documentElement);
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let frame = 0;
    const rebuild = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = surface.getBoundingClientRect();
        // SVG filter coordinates use the element's untransformed layout box.
        // getBoundingClientRect() includes the mobile shell transform and the
        // sub-400px page zoom, which shifts the displacement map out of place.
        const width = Math.max(1, Math.round(surface.offsetWidth || bounds.width));
        const height = Math.max(1, Math.round(surface.offsetHeight || bounds.height));
        setFilter((current) => current?.width === width && current.height === height && current.configKey === configKey
          ? current
          : { width, height, configKey, ...makeDisplacementMap(width, height, config) });
      });
    };

    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(surface);
    window.addEventListener("resize", rebuild);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", rebuild);
    };
  }, [config.glassThickness, config.bezelWidth, config.ior]);

  return (
    <>
      {portalHost ? createPortal(
        <svg className="liquid-glass-definitions" width="0" height="0" aria-hidden="true">
          <defs>
            {filter ? (
              <filter
                key={filterId}
                id={filterId}
                x="0"
                y="0"
                width={filter.width}
                height={filter.height}
                filterUnits="userSpaceOnUse"
                primitiveUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation={config.blur} result="softened" />
                <feImage
                  href={filter.map}
                  x="0"
                  y="0"
                  width={filter.width}
                  height={filter.height}
                  result="displacement"
                />
                <feDisplacementMap
                  in="softened"
                  in2="displacement"
                  scale={filter.maxDisplacement * config.scaleRatio + config.dispersionStrength}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="redDisplaced"
                />
                <feColorMatrix
                  in="redDisplaced"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="redChannel"
                />
                <feDisplacementMap
                  in="softened"
                  in2="displacement"
                  scale={filter.maxDisplacement * config.scaleRatio}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="greenDisplaced"
                />
                <feColorMatrix
                  in="greenDisplaced"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="greenChannel"
                />
                <feDisplacementMap
                  in="softened"
                  in2="displacement"
                  scale={Math.max(0, filter.maxDisplacement * config.scaleRatio - config.dispersionStrength)}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="blueDisplaced"
                />
                <feColorMatrix
                  in="blueDisplaced"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blueChannel"
                />
                <feBlend in="redChannel" in2="greenChannel" mode="screen" result="redGreen" />
                <feBlend in="redGreen" in2="blueChannel" mode="screen" />
              </filter>
            ) : null}
          </defs>
        </svg>,
        portalHost,
      ) : null}
      <span
        ref={surfaceRef}
        className="liquid-glass-surface"
        style={filter && config.enabled ? {
          WebkitBackdropFilter: `url(#${filterId})`,
          backdropFilter: `url(#${filterId})`,
        } : undefined}
        aria-hidden="true"
      />
    </>
  );
}

const controls: Array<{
  key: Exclude<keyof LiquidGlassConfig, "enabled">;
  label: string;
  min: number;
  max: number;
  step: number;
  digits: number;
}> = [
  { key: "glassThickness", label: "玻璃厚度", min: 0, max: 80, step: 1, digits: 0 },
  { key: "bezelWidth", label: "折射边缘", min: 4, max: 36, step: 1, digits: 0 },
  { key: "ior", label: "折射率", min: 1, max: 2.2, step: 0.01, digits: 2 },
  { key: "scaleRatio", label: "折射强度", min: 0, max: 2.5, step: 0.05, digits: 2 },
  { key: "dispersionStrength", label: "色散强度", min: 0, max: 4, step: 0.1, digits: 1 },
  { key: "blur", label: "背景模糊", min: 0, max: 4, step: 0.1, digits: 1 },
  { key: "tintOpacity", label: "玻璃底色", min: 0, max: 0.5, step: 0.01, digits: 2 },
];

export function LiquidGlassControls({
  config,
  onChange,
  onReset,
  onRebuild,
}: {
  config: LiquidGlassConfig;
  onChange: (config: LiquidGlassConfig) => void;
  onReset: () => void;
  onRebuild: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`glass-controls${collapsed ? " is-collapsed" : ""}`} aria-label="液态玻璃参数">
      <button
        className="glass-controls-header"
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        aria-expanded={!collapsed}
      >
        <span><i aria-hidden="true" />液态玻璃实验台</span>
        <b aria-hidden="true">{collapsed ? "+" : "−"}</b>
      </button>
      {!collapsed ? (
        <div className="glass-controls-body">
          <label className="glass-enabled">
            <span>启用折射</span>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(event) => onChange({ ...config, enabled: event.currentTarget.checked })}
            />
          </label>
          {controls.map((control) => (
            <label className="glass-control" key={control.key}>
              <span>{control.label}<output>{config[control.key].toFixed(control.digits)}</output></span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={config[control.key]}
                onInput={(event) => onChange({ ...config, [control.key]: Number(event.currentTarget.value) })}
              />
            </label>
          ))}
          <div className="glass-control-actions">
            <button className="glass-rebuild-button" type="button" onClick={onRebuild}>重建折射层</button>
            <button type="button" onClick={() => onChange({ ...DEFAULT_LIQUID_GLASS_CONFIG, scaleRatio: 1.7, tintOpacity: 0.16 })}>强折射</button>
            <button type="button" onClick={onReset}>恢复默认</button>
          </div>
          <p>先让文字、图片或黑白交界经过导航，再点“重建折射层”观察是否瞬间恢复。</p>
        </div>
      ) : null}
    </aside>
  );
}
