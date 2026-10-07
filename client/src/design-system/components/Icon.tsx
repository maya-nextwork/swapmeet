import React from "react";

/**
 * Outlined icon family — 2px stroke, rounded, 24px grid.
 * Drawn with stroke="currentColor", so recolor with text color:
 *   <Icon name="local" className="text-[var(--primary)]" />
 */
export const icons = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </>
  ),
  sell: (
    <>
      <path d="M4 4h7l9 9-7 7-9-9z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  swap: (
    <>
      <path d="M7 8h11l-3-3" />
      <path d="M17 16H6l3 3" />
    </>
  ),
  bid: (
    <>
      <path d="M14 3l7 7-4 4-7-7z" />
      <path d="M9 10l-6 6 3 3 6-6" />
      <path d="M4 20h6" />
    </>
  ),
  messages: (
    <>
      <path d="M4 5h16v11H9l-4 4z" />
      <path d="M9 10h6M9 13h4" />
    </>
  ),
  local: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  live: (
    <>
      <rect x="3" y="7" width="13" height="12" rx="2" />
      <path d="M16 11l5-2v6l-5-2z" />
      <circle cx="9" cy="13" r="2" />
    </>
  ),
  saved: <path d="M6 4h12v16l-6-4-6 4z" />,
  verified: (
    <>
      <path d="M12 3l2.4 1.9 3-.4 1 2.9 2.6 1.6-1.4 2.7 1.4 2.7-2.6 1.6-1 2.9-3-.4L12 21l-2.4-1.9-3 .4-1-2.9L3 15.4l1.4-2.7L3 10l2.6-1.6 1-2.9 3 .4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  impact: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16V8" />
      <path d="M8.5 11.5L12 8l3.5 3.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {icons[name]}
    </svg>
  );
}
