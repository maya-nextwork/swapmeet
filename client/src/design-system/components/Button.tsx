import React from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = top action, secondary = alternate path, tertiary = low priority, destructive = delete/error only. @default "primary" */
  variant?: ButtonVariant;
}

const base =
  "inline-flex items-center gap-2 [font-family:var(--font-sans)] font-bold text-base leading-none " +
  "cursor-pointer rounded-[var(--radius-md)] px-5 py-3 transition-[filter] hover:brightness-105 " +
  "focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--teal)] text-[var(--on-primary)]",
  secondary: "bg-[var(--accent)] text-[var(--on-accent)]",
  tertiary:
    "bg-transparent text-[var(--text)] border-[2.5px] border-solid border-[var(--line-strong)] px-[17.5px] py-[9.5px]",
  destructive: "bg-[var(--danger)] text-[var(--on-danger)]",
};

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
