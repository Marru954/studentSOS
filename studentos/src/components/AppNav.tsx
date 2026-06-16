"use client";

import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  NotebookPen,
  Search,
  Settings,
  Timer,
} from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountButton } from "@/components/auth/AccountButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wordmark } from "@/components/Wordmark";
import { cn } from "@/lib/cn";
import { computeUrgencies } from "@/lib/domain/urgency";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useScrolled } from "@/lib/hooks/useScrolled";
import { useSearchPalette } from "@/lib/state/searchPalette";
import { useSynced } from "@/lib/state/synced";

const LINKS = [
  { href: "/cruscotto", label: "Cruscotto", short: "Crusc.", icon: LayoutDashboard },
  { href: "/orario", label: "Orario", short: "Orario", icon: CalendarDays },
  { href: "/appelli", label: "Appelli", short: "Esami", icon: CalendarClock },
  { href: "/calendario", label: "Calendario", short: "Cal.", icon: CalendarRange },
  { href: "/libretto", label: "Libretto", short: "Voti", icon: GraduationCap },
  { href: "/note", label: "Note", short: "Note", icon: NotebookPen },
  { href: "/focus", label: "Focus", short: "Focus", icon: Timer },
  { href: "/assistente", label: "Assistente", short: "AI", icon: MessageSquare },
  { href: "/impostazioni", label: "Impostazioni", short: "Impost.", icon: Settings },
];

/** Floating top bar (sm+) plus a fixed bottom tab bar on mobile. The active page
 *  is marked by the filled accent pill AND aria-current — never by colour alone.
 *  A red dot flags the Cruscotto when there are critical urgencies. */
export function AppNav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const openSearch = useSearchPalette((s) => s.openPalette);

  // critical-urgency count drives the dashboard alert dot; recomputed from the
  // synced caches on each clock tick. Skipped until hydrated/first client tick.
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const hydrated = useSynced((s) => s.hydrated);
  const now = useNowMinute();
  const criticalCount = useMemo(() => {
    if (!hydrated || now === null) return 0;
    return computeUrgencies(classEvents, examCalls, now).filter(
      (u) => u.severity === "critical",
    ).length;
  }, [hydrated, now, classEvents, examCalls]);

  // Sulla landing pubblica il visitatore non deve avere vie di fuga: niente
  // navbar app a 9 voci, solo logo + "Accedi" + il CTA principale. La navbar
  // piena resta su tutte le altre route.
  if (pathname === "/") {
    return (
      <header className="no-print sticky top-0 z-40 px-4 pt-4 sm:px-6">
        <nav
          aria-label="Principale"
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center gap-2 rounded-full border border-line px-3 py-2",
            "transition-[background-color,box-shadow,backdrop-filter] duration-200",
            scrolled
              ? "bg-night-800/70 shadow-soft backdrop-blur-lg"
              : "glass shadow-soft",
          )}
        >
          <Link
            href="/"
            className="mr-auto flex items-center pl-1 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
          >
            <Wordmark />
          </Link>
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
          >
            Accedi
          </Link>
          <Link href="/cruscotto" className="btn btn-primary px-4 py-1.5 text-xs">
            Inizia ora
          </Link>
          <ThemeToggle />
        </nav>
      </header>
    );
  }

  return (
    <>
      <header className="no-print sticky top-0 z-40 px-4 pt-4 sm:px-6">
        <nav
          aria-label="Principale"
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center gap-1 rounded-full border border-line px-3 py-2",
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
          {/* Inline links: wide screens only — below `xl` the 9 links plus the
              search/account/theme cluster overflow the pill, so tablet/laptop
              widths use the bottom tab bar instead. */}
          <div className="hidden items-center gap-1 xl:flex">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              const alert = href === "/cruscotto" && criticalCount > 0;
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
                  <span className="relative">
                    <Icon aria-hidden="true" className="size-4" />
                    {alert && (
                      <span
                        aria-hidden="true"
                        className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-danger"
                      />
                    )}
                  </span>
                  {label}
                  {alert && (
                    <span className="sr-only"> ({criticalCount} avvisi critici)</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2 pl-1">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Cerca (Cmd+K)"
              title="Cerca"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
            >
              <Search aria-hidden="true" className="size-4" />
            </button>
            <AccountButton />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Mobile bottom tab bar — replaces the inline link overflow under sm. */}
      <nav
        aria-label="Navigazione"
        className="no-print fixed bottom-0 left-0 right-0 z-40 flex justify-around gap-1 overflow-x-auto border-t border-line bg-night-800/90 px-1 py-2 backdrop-blur-md xl:hidden"
      >
        {LINKS.map(({ href, short, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const alert = href === "/cruscotto" && criticalCount > 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 flex-col items-center gap-0.5 px-2 text-[0.62rem] font-medium transition-colors",
                active ? "text-signal" : "text-ink-mute",
              )}
            >
              <span className="relative">
                <Icon aria-hidden="true" className="size-5" />
                {alert && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-danger"
                  />
                )}
              </span>
              {short}
              {alert && (
                <span className="sr-only"> ({criticalCount} avvisi critici)</span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
