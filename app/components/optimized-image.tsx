import type { ImgHTMLAttributes } from "react";
import imageManifest from "../optimized-images.json";

type ManifestEntry = {
  width: number;
  height: number;
  variants: Array<{ src: string; width: number }>;
};

const manifest = imageManifest as Record<string, ManifestEntry>;

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function OptimizedImage({
  src,
  loading,
  decoding = "async",
  sizes,
  ...props
}: OptimizedImageProps) {
  const entry = manifest[src];
  const variants = entry?.variants ?? [];
  const srcSet = variants.length > 1
    ? variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ")
    : undefined;

  return (
    <img
      {...props}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? "100vw") : sizes}
      loading={loading ?? "lazy"}
      decoding={decoding}
    />
  );
}
