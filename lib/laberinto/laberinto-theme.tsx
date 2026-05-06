import React from "react";

export const laberintoColors = {
  background: "#25683d",
  orange: "#f39019",
  blue: "#95d6f6",
  yellow: "#fde442",
  light_green: "#beda74",
} as const;

/**
 * Wraps the landing page and exposes the palette as CSS custom properties.
 *
 * Use in Tailwind with arbitrary-value syntax:
 *   bg-[var(--home-background)]
 *   text-[var(--home-orange)]
 *   border-[var(--home-blue)]
 *   bg-[var(--home-yellow)]
 *   bg-[var(--home-light-green)]
 */
export function LaberintoTheme({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          "--lb-background": laberintoColors.background,
          "--lb-orange": laberintoColors.orange,
          "--lb-blue": laberintoColors.blue,
          "--lb-yellow": laberintoColors.yellow,
          "--lb-light-green": laberintoColors.light_green,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
