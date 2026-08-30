import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * A tiled dot grid, masked to fade out toward the edges so it reads as a
 * quiet paper texture rather than a hard-edged tile. Purely decorative —
 * sits behind a section's content via `-z-10` and `pointer-events-none`.
 */
export function DotPattern({
  width = 22,
  height = 22,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
}) {
  const id = useId();

  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
