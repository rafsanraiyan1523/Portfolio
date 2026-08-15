/**
 * Fixed corner registration marks plus faint column guides — the
 * technical/blueprint framing device common to architecture-minded
 * portfolio sites. `mix-blend-difference` (the same trick the custom cursor
 * uses) means the marks read correctly against every section regardless of
 * light or dark background, with no per-section theming needed.
 *
 * The guides reuse the real `container-x` utility class (rather than
 * duplicating its padding math) on a dedicated, isolated element — this
 * stays fixed to the viewport, so it never needs to track scroll, and never
 * touches the shared utility itself, which several sections rely on as a
 * non-positioning wrapper for their own absolutely-positioned decoration.
 */
export default function ViewportFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-difference"
    >
      <div className="container-x relative h-full">
        <div className="absolute inset-y-0 left-[1.25rem] w-px bg-white/[0.07] md:left-[2.5rem] xl:left-16" />
        <div className="absolute inset-y-0 right-[1.25rem] w-px bg-white/[0.07] md:right-[2.5rem] xl:right-16" />
      </div>

      <Corner arm="right-down" className="left-4 top-4 md:left-6 md:top-6" />
      <Corner arm="left-down" className="right-4 top-4 md:right-6 md:top-6" />
      <Corner arm="right-up" className="bottom-4 left-4 md:bottom-6 md:left-6" />
      <Corner arm="left-up" className="bottom-4 right-4 md:bottom-6 md:right-6" />
    </div>
  );
}

const PATHS: Record<string, string> = {
  "right-down": "M0 0H8M0 0V8",
  "left-down": "M10 0H2M10 0V8",
  "right-up": "M0 10H8M0 10V2",
  "left-up": "M10 10H2M10 10V2",
};

function Corner({ arm, className }: { arm: keyof typeof PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      className={`absolute size-2.5 text-white/45 md:size-3 ${className}`}
    >
      <path d={PATHS[arm]} stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
