import { Plus } from "lucide-react";

/** FAQ statica della landing: accordion con <details> native (zero JS, già
 *  accessibili da tastiera). Risposte oneste e local-first — nessuna promessa
 *  di cloud/sync come default. */
const FAQ: { q: string; a: string }[] = [
  {
    q: "È gratis?",
    a: "Sì, è gratis. Niente abbonamenti, niente carta di credito.",
  },
  {
    q: "Dove finiscono i miei dati?",
    a: "Restano sul tuo dispositivo, in locale. Nessun account è obbligatorio: l'accesso opzionale serve solo a ritrovarli su più dispositivi, se lo vuoi.",
  },
  {
    q: "Funziona offline?",
    a: "Sì. I dati sono già sul dispositivo, quindi l'app funziona anche senza connessione.",
  },
  {
    q: "E se il mio ateneo non c'è o non è «sync live»?",
    a: "Puoi usarla lo stesso: inserisci orario ed esami a mano e hai comunque media, CFU e proiezione. E puoi segnalarci il tuo ateneo, così lo aggiungiamo.",
  },
  {
    q: "Devo registrarmi?",
    a: "No. L'account email è del tutto opzionale (serve solo per backup e multi-dispositivo) e non è mai richiesto per iniziare.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="wrap section scroll-mt-24">
      <p className="reveal eyebrow text-center">Domande frequenti</p>
      <h2 className="reveal display-md mx-auto mt-2.5 max-w-[20ch] text-center">
        Hai ancora <span className="grad-text">dubbi</span>?
      </h2>
      <ul className="mx-auto mt-8 flex max-w-[46rem] flex-col gap-3">
        {FAQ.map(({ q, a }) => (
          <li key={q} className="reveal">
            <details className="glass group rounded-lg">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <Plus
                  className="size-5 shrink-0 text-ink-mute transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-mute">
                {a}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
