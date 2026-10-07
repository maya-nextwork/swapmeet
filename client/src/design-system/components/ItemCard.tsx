import React from "react";
import { type BadgeColor, badgeColorClass } from "./Badge";

export interface ItemCardProps {
  /** Formatted price, e.g. "$38". Rendered in the display face. */
  price: React.ReactNode;
  title: React.ReactNode;
  /** e.g. "2.3 miles away". */
  distance?: React.ReactNode;
  /** Seller rating, e.g. 4.9. Rendered as "★ 4.9 seller". */
  rating?: number | string;
  /** Short condition/availability note, e.g. "Local pickup". */
  note?: React.ReactNode;
  /** Product photo URL. Omitted → a placeholder tile. */
  image?: string;
  /** Emoji shown in the photo tile when there is no `image`. */
  emoji?: string;
  /** One condition/trust badge, top-left on the photo. */
  badge?: { label: string; color?: BadgeColor };
  className?: string;
}

const badgeBase =
  "inline-flex items-center gap-2 [font-family:var(--font-sans)] font-bold text-[11.5px] " +
  "tracking-[0.05em] uppercase px-[11px] py-[5px] rounded-[var(--radius-pill)] border-[1.5px] border-solid border-black/10";

export function ItemCard({
  price,
  title,
  distance,
  rating,
  note,
  image,
  emoji,
  badge,
  className = "",
}: ItemCardProps) {
  return (
    <article
      className={
        "w-full max-w-[320px] overflow-hidden bg-[var(--surface)] " +
        "border-[2.5px] border-solid border-[var(--line)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] " +
        className
      }
    >
      <div className="relative flex h-40 items-center justify-center bg-[var(--panel)] [font-family:var(--font-sans)] text-xs text-[var(--text-soft)]">
        {badge ? (
          <span className={`absolute left-2.5 top-2.5 ${badgeBase} ${badgeColorClass[badge.color ?? "marigold"]}`}>
            {badge.label}
          </span>
        ) : null}
        {image ? (
          <img src={image} alt={typeof title === "string" ? title : ""} className="absolute inset-0 h-full w-full object-cover" />
        ) : emoji ? (
          <span className="text-[64px] leading-none" aria-hidden="true">{emoji}</span>
        ) : (
          <span>product photo</span>
        )}
      </div>
      <div className="px-[15px] pb-4 pt-[13px]">
        <div className="[font-family:var(--font-display)] text-2xl font-bold tracking-[-0.01em] text-[var(--text)]">
          {price}
        </div>
        <div className="mt-0.5 [font-family:var(--font-sans)] text-lg font-semibold leading-tight text-[var(--text)]">
          {title}
        </div>
        <div className="mt-1.5 flex flex-col gap-0.5 [font-family:var(--font-sans)] text-sm text-[var(--text-soft)]">
          {distance != null ? <span>{distance}</span> : null}
          {rating != null ? (
            <span>
              <span className="font-bold text-[var(--marigold)]">★ {rating}</span> seller
            </span>
          ) : null}
          {note != null ? <span>{note}</span> : null}
        </div>
      </div>
    </article>
  );
}
