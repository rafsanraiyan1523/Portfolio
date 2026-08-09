export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Split a string into words, keeping them safe for per-word animation. */
export function toWords(text: string) {
  return text.split(" ").filter(Boolean);
}
