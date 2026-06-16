/**
 * Restituisce l'URL solo se ha schema http/https, altrimenti `undefined`.
 * Neutralizza href ostili (`javascript:`, `data:`, `vbscript:`…) prima del render:
 * un link esterno arriva da dati sincronizzati di terze parti (es. avvisi WordPress)
 * e non è fidato. Usare sempre insieme a `rel="noopener noreferrer"`.
 */
export function safeHref(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url.trim()) ? url : undefined;
}
