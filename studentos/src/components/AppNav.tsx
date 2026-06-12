"use client";

import {
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Cruscotto", icon: LayoutDashboard },
  { href: "/orario", label: "Orario", icon: CalendarDays },
  { href: "/appelli", label: "Appelli", icon: CalendarClock },
  { href: "/libretto", label: "Libretto", icon: GraduationCap },
  { href: "/note", label: "Note", icon: NotebookPen },
  { href: "/focus", label: "Focus", icon: Timer },
];

/** Floating glass top bar. The active page is marked by the filled pill
 *  AND aria-current — never by color alone. */
export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Principale"
        className="glass mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto rounded-full border border-line px-3 py-2 shadow-soft"
      >
        <span className="mr-2 flex items-center gap-1.5 pl-1 text-sm font-semibold text-ink">
          <Sparkles aria-hidden="true" className="size-4 text-signal" />
          StudentOS
        </span>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                active
                  ? "bg-primary-gradient text-white"
                  : "text-ink-mute hover:bg-night-700 hover:text-ink",
              )}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
