import type { InputHTMLAttributes } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  icon: string;
  placeholder: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "placeholder" | "className">;

export function FormField({
  id,
  name,
  label,
  icon,
  placeholder,
  type = "text",
  required,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-medium tracking-wide text-on-surface-variant"
      >
        <MaterialIcon name={icon} className="text-[18px]" />
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="glass-input rounded-lg px-4 py-2 text-base text-on-surface placeholder:text-outline-variant focus:border-white focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        {...inputProps}
      />
    </div>
  );
}
