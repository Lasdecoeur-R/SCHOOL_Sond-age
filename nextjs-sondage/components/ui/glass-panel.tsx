import type { HTMLAttributes } from "react";

type GlassPanelProps = {
  /** Effet survol type maquette tableau de bord */
  hoverable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function GlassPanel({ className = "", children, hoverable = false, ...props }: GlassPanelProps) {
  return (
    <div
      className={`glass-panel rounded-xl shadow-sm ${hoverable ? "glass-panel-hoverable" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
