/**
 * Map an Italian university email to its ateneo preset — pure, no I/O.
 *
 * Two jobs:
 *  1. `isUniversityEmail` gates the magic-link flow to real Italian academic
 *     domains (institutional mail only, no Gmail/Outlook).
 *  2. `detectAteneo` resolves the domain to a built-in preset id when we have
 *     one, so onboarding can skip the "which university" step. Unknown-but-valid
 *     academic domains return null → the user picks the ateneo manually.
 *
 * Domains are matched on the host AND its parent suffix, so both
 * `@studenti.uniroma2.it` and a future `@foo.uniroma2.it` resolve correctly.
 */

/** Institutional domain → preset id (only ateneos we ship a preset for). */
const DOMAIN_TO_PRESET: Record<string, string> = {
  // Tor Vergata (the one fully-wired live preset)
  "uniroma2.it": "uniroma2-informatica-triennale",
  "students.uniroma2.eu": "uniroma2-informatica-triennale",
  "studenti.uniroma2.it": "uniroma2-informatica-triennale",
  // Sapienza
  "uniroma1.it": "uniroma1-sapienza",
  "studenti.uniroma1.it": "uniroma1-sapienza",
  // Bologna
  "unibo.it": "unibo",
  "studio.unibo.it": "unibo",
  // Politecnico di Milano
  "polimi.it": "polimi",
  "mail.polimi.it": "polimi",
  // Politecnico di Torino
  "polito.it": "polito",
  "studenti.polito.it": "polito",
  // Padova
  "unipd.it": "unipd",
  "studenti.unipd.it": "unipd",
  // Siena
  "unisi.it": "unisi",
  "student.unisi.it": "unisi",
  // Firenze
  "unifi.it": "unifi",
  "stud.unifi.it": "unifi",
  // Pisa
  "unipi.it": "unipi",
  "studenti.unipi.it": "unipi",
  // Napoli Federico II
  "unina.it": "unina-federico2",
  "studenti.unina.it": "unina-federico2",
  // Statale Milano
  "unimi.it": "unimi-statale",
  "studenti.unimi.it": "unimi-statale",
  // Torino
  "unito.it": "unito",
  "edu.unito.it": "unito",
  // Trento
  "unitn.it": "unitn",
  "studenti.unitn.it": "unitn",
  // Ca' Foscari Venezia
  "unive.it": "unive-cafoscari",
  "stud.unive.it": "unive-cafoscari",
  // Bocconi
  "unibocconi.it": "unibocconi",
  "studbocconi.it": "unibocconi",
  // Pavia
  "unipv.it": "unipv",
  "universitadipavia.it": "unipv",
  // Genova
  "unige.it": "unige",
  "studenti.unige.it": "unige",
  "edu.unige.it": "unige",
};

/** Valid Italian academic domains WITHOUT a preset yet — login allowed, the
 *  ateneo is then chosen manually. Keeps coverage well past 30 universities. */
const EXTRA_ACADEMIC_DOMAINS = new Set<string>([
  "polraba.it",
  "uniroma3.it",
  "studenti.uniroma3.it",
  "univaq.it",
  "student.univaq.it",
  "unich.it",
  "unite.it",
  "univpm.it",
  "studenti.univpm.it",
  "unica.it",
  "uniss.it",
  "unicampania.it",
  "studenti.unicampania.it",
  "unisannio.it",
  "unisa.it",
  "studenti.unisa.it",
  "unibas.it",
  "unical.it",
  "studenti.unical.it",
  "unirc.it",
  "unime.it",
  "studenti.unime.it",
  "unipa.it",
  "community.unipa.it",
  "unict.it",
  "studium.unict.it",
  "unifg.it",
  "unisalento.it",
  "studenti.unisalento.it",
  "uniba.it",
  "studenti.uniba.it",
  "poliba.it",
  "studenti.poliba.it",
  "units.it",
  "studenti.units.it",
  "uniud.it",
  "spes.uniud.it",
  "univr.it",
  "studenti.univr.it",
  "unimore.it",
  "studenti.unimore.it",
  "unipr.it",
  "studenti.unipr.it",
  "unife.it",
  "edu.unife.it",
  "unisi.it",
  "unibg.it",
  "studenti.unibg.it",
  "uninsubria.it",
  "studenti.uninsubria.it",
  "unimib.it",
  "campus.unimib.it",
  "unipg.it",
  "studenti.unipg.it",
  "unicam.it",
  "unimc.it",
  "unitus.it",
  "studenti.unitus.it",
  "uniss.it",
  "santannapisa.it",
  "sns.it",
  "imtlucca.it",
  "iuav.it",
  "stud.iuav.it",
  "luiss.it",
  "studenti.luiss.it",
  "unicatt.it",
  "iulm.it",
  "studenti.iulm.it",
  "humanitasuniversity.it",
  "unisg.it",
]);

function host(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const h = email.slice(at + 1).trim().toLowerCase();
  return h.includes(".") ? h : null;
}

/** Every progressively-shorter suffix of a host, e.g.
 *  a.b.uniroma2.it → ["a.b.uniroma2.it","b.uniroma2.it","uniroma2.it","it"]. */
function suffixes(h: string): string[] {
  const parts = h.split(".");
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) out.push(parts.slice(i).join("."));
  return out;
}

/** True for a syntactically valid institutional Italian academic address. */
export function isUniversityEmail(email: string): boolean {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;
  const h = host(email);
  if (!h) return false;
  return suffixes(h).some(
    (s) => s in DOMAIN_TO_PRESET || EXTRA_ACADEMIC_DOMAINS.has(s),
  );
}

/** Preset id for the email's ateneo, or null when we have no preset for it. */
export function detectAteneo(email: string): string | null {
  const h = host(email);
  if (!h) return null;
  for (const s of suffixes(h)) {
    if (s in DOMAIN_TO_PRESET) return DOMAIN_TO_PRESET[s];
  }
  return null;
}
