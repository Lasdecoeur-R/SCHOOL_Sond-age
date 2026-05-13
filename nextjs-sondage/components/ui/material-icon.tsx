import type { HTMLAttributes } from "react";

type MaterialIconProps = {
  /** Nom du glyphe Material Symbols (ex. person, mail) */
  name: string;
  /** Icône remplie (Material Symbols FILL=1) */
  filled?: boolean;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

export function MaterialIcon({
  name,
  className = "",
  filled = false,
  style,
  ...props
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      aria-hidden
      style={{
        ...(filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined),
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
