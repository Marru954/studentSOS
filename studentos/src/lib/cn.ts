/** Tiny class joiner — we don't need clsx's object syntax. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
