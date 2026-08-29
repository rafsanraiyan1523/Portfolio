import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Real product screenshot, rendered at its own natural aspect ratio.
 *
 * Deliberately not `fill` + `object-cover` — that crops whichever edge
 * doesn't match the box, which loses real interface content. Sizing the box
 * to the image's actual dimensions instead means the full screenshot is
 * always visible, uncropped, whatever its shape.
 */
export default function ProjectScreenshot({
  src,
  alt,
  size,
  className,
}: {
  src: string;
  alt: string;
  size: readonly [width: number, height: number];
  className?: string;
}) {
  const [width, height] = size;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-ink/10 bg-paper-2",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="h-auto w-full"
      />
    </div>
  );
}
