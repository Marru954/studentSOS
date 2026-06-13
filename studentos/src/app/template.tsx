/**
 * Per-navigation wrapper: App Router remounts a template on every route change,
 * so this gives every page a fade-in + slide-up entrance (and doubles as the
 * page-transition effect). prefers-reduced-motion neutralises it globally.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="anim-page flex flex-1 flex-col">{children}</div>;
}
