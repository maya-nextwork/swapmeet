import React from "react";

export type BadgeColor =
  | "marigold"
  | "leaf"
  | "tomato"
  | "teal"
  | "denim"
  | "raspberry";

export interface BadgeProps {
  /** Fill color role. @default "marigold" */
  color?: BadgeColor;
  /** Optional leading icon (e.g. <Icon name="local" />). */
  icon?: React.ReactNode;
  /** The label. Required — color never carries meaning alone. */
  children: React.ReactNode;
  className?: string;
}

const base =
  "inline-flex items-center gap-2 [font-family:var(--font-sans)] font-bold " +
  "text-[11.5px] tracking-[0.05em] uppercase px-[11px] py-[5px] " +
  "rounded-[var(--radius-pill)] border-[1.5px] border-solid border-black/10";

export const badgeColorClass: Record<BadgeColor, string> = {
  marigold: "bg-[var(--marigold)] text-[var(--on-accent)]",
  leaf: "bg-[var(--leaf)] text-[var(--on-secondary)]",
  tomato: "bg-[var(--tomato)] text-[var(--on-hot)]",
  teal: "bg-[var(--teal)] text-[var(--on-primary)]",
  denim: "bg-[var(--denim)] text-[var(--on-info)]",
  raspberry: "bg-[var(--raspberry)] text-[var(--on-play)]",
};

export function Badge({ color = "marigold", icon, children, className = "" }: BadgeProps) {
  return (
    <span className={`${base} ${badgeColorClass[color]} ${className}`}>
      {icon ? (
        <span className="inline-flex w-[15px] h-[15px] [&>svg]:w-[15px] [&>svg]:h-[15px]" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  );
}
