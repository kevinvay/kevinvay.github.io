type TextIconName = "folder" | "puzzle" | "ribbon" | "wave";

type TextIconProps = {
  className?: string;
  label?: string;
  name: TextIconName;
};

export function TextIcon({ className, label, name }: TextIconProps) {
  return (
    <i
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={["text-icon", `text-icon-${name}`, className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
    >
      <img alt="" aria-hidden="true" height="190" src={`/figma-assets/emoji/${name}.png`} width="190" />
    </i>
  );
}
