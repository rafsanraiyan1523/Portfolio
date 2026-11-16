import { Fragment, type ReactNode } from "react";

const HYPHENATED = /(\S*[A-Za-z0-9]-[A-Za-z0-9]\S*)/g;

/**
 * Browsers happily break lines after a hyphen, which splits words like
 * "e-commerce" or "role-based" across two lines ("e-" / "commerce"). This
 * wraps every hyphenated word in a no-wrap span so it always moves as a unit,
 * while ordinary spaces stay free to break.
 */
export function keepHyphens(text: string): ReactNode {
  const parts = text.split(HYPHENATED);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
