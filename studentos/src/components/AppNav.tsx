"use client";

import {
  Bell,
  BookOpen,
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
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
import { isAlertActive } from "@/lib/domain/alerts";
import { computeUrgencies } from "@/lib/domain/urgency";
import { passedCourseKeys } from "@/lib/domain/examStatus";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useScrolled } from "@/lib/hooks/useScrolled";
import { useAlerts } from "@/lib/state/alerts";
import { useLibretto } from "@/lib/state/manual";
import { useSearchPalette } from "@/lib/state/searchPalette";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";

// Sette voci principali. Impostazioni vive nel cluster in alto a destra (icona
// ingranaggio), l'Assistente è una bubble flottante: nessuno dei due è una voce
// di barra. La landing (/) è pubblica, non una sezione dell'app.
const LINKS = [
  { href: "/panoramica", label: "Panoramica", short: "Crusc.", icon: LayoutDashboard },
  { href: "/orario", label: "Orario", short: "Orario", icon: CalendarDays },
  { href: "/insegnamenti", label: "Insegnamenti", short: "Materie", icon: BookOpen },
  { href: "/appelli", label: "Appelli", short: "Esami", icon: CalendarClock },
  { href: "/libretto", label: "Libretto", short: "Voti", icon: GraduationCap },
  { href: "/note", label: "Note", short: "Note", icon: NotebookPen },
  { href: "/focus", label: "Focus", short: "Focus", icon: Timer },
];

/** Floating top bar (sm+) plus a fixed bottom tab bar on mobile. The active page
 *  is marked by the filled accent pill AND aria-current — never by colour alone.
 *  A red dot flags the Panoramica when there are critical urgencies. */
export function AppNav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const openSearch = useSearchPalette((s) => s.openPalette);

  // critical-urgency count drives the dashboard alert dot; recomputed from the
  // synced caches on each clock tick. Skipped until hydrated/first client tick.
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const hydrated = useSynced((s) => s.hydrated);
  const librettoItems = useLibretto((s) => s.items);
  const passedCourses = useMemo(
    () => passedCourseKeys(librettoItems),
    [librettoItems],
  );
  const now = useNowMinute();
  const criticalCount = useMemo(() => {
    if (!hydrated || now === null) return 0;
    return computeUrgencies(classEvents, examCalls, now, { passedCourses }).filter(
      (u) => u.severity === "critical",
    ).length;
  }, [hydrated, now, classEvents, examCalls, passedCourses]);

  // Primo avvio: nessun dato proprio ancora. Gli avvisi critici al primo accesso
  // vengono tutti dagli appelli del corso intero (non sono i suoi); mostrare il
  // badge spaventa senza motivo. "Dati tuoi" = almeno un voto nel libretto OPPURE
  // un orario personalizzato (corsi selezionati). Nota: `classEvents` non basta —
  // dopo un sync live contiene SEMPRE l'intero orario del corso, quindi sarebbe
  // sempre pieno; serve il segnale di personalizzazione (`pinnedCourses`).
  const pinnedCourses = useSettings((s) => s.pinnedCourses);
  const hasOwnData = librettoItems.length > 0 || pinnedCourses.length > 0;

  // Avvisi attivi (non letti, non scaduti) per il badge sulla campanella.
  // Sottoscrive l'array `alerts` e ricalcola il conteggio attivo a ogni minuto
  // (`now` da useNowMinute, SSR-safe) invece di chiamare `new Date()` in render.
  const alerts = useAlerts((s) => s.alerts);
  const alertCount = useMemo(() => {
    if (now === null) return 0;
    return alerts.filter((a) => isAlertActive(a, now)).length;
  }, [alerts, now]);

  // Durante l'onboarding la navbar è nascosta: lo step wizard è autocontenuto
  // e la presenza di link alle sezioni app disorienterebbe chi non è ancora
  // configurato.
  if (pathname.startsWith("/onboarding")) {
    return null;
  }

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
          <Link href="/onboarding" className="btn btn-primary px-4 py-1.5 text-xs">
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
          {/* Salvagente: cap segmentato all'estremità sinistra della barra. */}
          <span className="buoy-cap ml-1" aria-hidden="true" />
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
              const alert =
              href === "/panoramica" && criticalCount > 0 && hasOwnData;
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
            {/* Campanella avvisi: porta agli /appelli (la pagina con più avvisi
                contestuali). Il badge numerico compare solo se ci sono avvisi
                attivi; oltre 9 mostra "9+". */}
            <Link
              href="/appelli"
              aria-label={`Avvisi: ${alertCount} non letti`}
              title="Avvisi"
              className="relative flex size-8 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-night-700 hover:text-ink"
            >
              <Bell aria-hidden="true" className="size-4" />
              {alertCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[0.6rem] font-semibold leading-none text-white"
                >
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </Link>
            <AccountButton />
            <Link
              href="/impostazioni"
              aria-label="Impostazioni"
              aria-current={
                pathname.startsWith("/impostazioni") ? "page" : undefined
              }
              title="Impostazioni"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                pathname.startsWith("/impostazioni")
                  ? "bg-primary-gradient text-white shadow-accent"
                  : "text-ink-mute hover:bg-night-700 hover:text-ink",
              )}
            >
              <Settings aria-hidden="true" className="size-4" />
            </Link>
            <ThemeToggle />
            {/* Salvagente: cap segmentato all'estremità destra della barra. */}
            <span className="buoy-cap" aria-hidden="true" />
          </div>
        </nav>
      </header>

      {/* Mobile bottom tab bar — replaces the inline link overflow under sm. */}
      <nav
        aria-label="Navigazione"
        className="no-print fixed bottom-0 left-0 right-0 z-40 flex gap-0.5 border-t border-line bg-night-800/90 px-0.5 py-2 backdrop-blur-md xl:hidden"
      >
        {LINKS.map(({ href, short, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const alert = href === "/panoramica" && criticalCount > 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] px-0.5 text-[0.66rem] font-medium transition-colors",
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
              <span className="max-w-full truncate">{short}</span>
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
