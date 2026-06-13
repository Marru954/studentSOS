"use client";

import {
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  NotebookPen,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wordmark } from "@/components/Wordmark";
import { cn } from "@/lib/cn";
import { useScrolled } from "@/lib/hooks/useScrolled";

const LINKS = [
  { href: "/cruscotto", label: "Cruscotto", icon: LayoutDashboard },
  { href: "/orario", label: "Orario", icon: CalendarDays },
  { href: "/appelli", label: "Appelli", icon: CalendarClock },
  { href: "/libretto", label: "Libretto", icon: GraduationCap },
  { href: "/note", label: "Note", icon: NotebookPen },
  { href: "/focus", label: "Focus", icon: Timer },
];

/** Floating top bar. Frosts with a translucent backdrop-blur once the page is
 *  scrolled. The active page is marked by the filled accent pill AND
 *  aria-current — never by colour alone. */
export function AppNav() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Principale"
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto rounded-full border border-line px-3 py-2",
          "transition-[background-color,box-shadow,backdrop-filter] duration-200",
          scrolled
            ? "bg-night-800/70 shadow-soft backdrop-blur-lg"
            : "glass shadow-soft",
        )}
      >
        <Link
          href="/"
          className="mr-2 flex items-center pl-1 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
        >
          <Wordmark />
        </Link>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "nav-link relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary-gradient text-white shadow-accent"
                  : "text-ink-mute hover:bg-night-700 hover:text-ink",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          );
        })}
        <div className="ml-auto pl-1">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
