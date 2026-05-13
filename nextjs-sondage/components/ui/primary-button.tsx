import type { ButtonHTMLAttributes } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type PrimaryButtonProps = {
  iconRight?: string;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  children,
  iconRight,
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 rounded-lg bg-primary py-4 text-2xl font-semibold text-on-primary shadow-lg transition-all duration-200 hover:bg-on-primary-fixed-variant active:scale-[0.98] ${className}`.trim()}
      {...props}
    >
      {children}
      {iconRight ? <MaterialIcon name={iconRight} /> : null}
    </button>
  );
}
