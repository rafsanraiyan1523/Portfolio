import Image from "next/image";

import { cn } from "@/lib/utils";

/** Real product screenshot, framed to match ProjectVisual's card treatment. */
export default function ProjectScreenshot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-ink/10 bg-paper-2",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover object-top"
      />
    </div>
  );
}
