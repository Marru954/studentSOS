import type { Metadata } from "next";
import Link from "next/link";
import {
  Cookie,
  HardDrive,
  Mail,
  RefreshCw,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Panel } from "@/components/primitives/Panel";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Come StudentOS tratta i tuoi dati: cosa resta sul dispositivo, cosa esce dal browser, quando e verso chi.",
};

/** Bump when the data flows below change. */
const UPDATED = "26 settembre 2026";
const CONTACT = "support@studentos.app";

const link = "text-signal-text underline underline-offset-2 hover:text-ink";
const body = "flex flex-col gap-3 text-sm leading-relaxed text-ink-mute";
const list = "flex list-disc flex-col gap-1.5 pl-5";

function Contact() {
  return (
    <a href={`mailto:${CONTACT}?subject=Privacy%20StudentOS`} className={link}>
      {CONTACT}
    </a>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
      {children}
      <span className="sr-only"> (si apre in una nuova scheda)</span>
    </a>
  );
}

/** Informativa privacy. Every claim below mirrors a data flow in the code:
 *  keep it in sync when a feature starts sending something new off-device. */
export default function PrivacyPage() {
  return (
    <main id="contenuto" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <header className="reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Privacy</h1>
        <p className="muted mt-1.5">
          StudentOS nasce local-first: senza account i tuoi dati restano su questo
          dispositivo. Qui trovi, senza giri di parole, cosa esce dal browser,
          quando e verso chi.
        </p>
        <p className="faint mt-2 text-xs">Ultimo aggiornamento: {UPDATED}</p>
      </header>

      <div className="mt-6 flex flex-col gap-5">
        <Panel title="In breve" icon={<ShieldCheck />}>
          <ul className={`${body} ${list}`}>
            <li>
              Senza account, libretto, note, attività, sessioni di studio e
              impostazioni restano nel tuo browser. Noi non li vediamo.
            </li>
            <li>
              Nessun tracciamento: niente analytics, niente pubblicità, niente
              cookie di profilazione.
            </li>
            <li>
              Alcune funzioni comunicano con un server, e solo quando le usi: la
              sincronizzazione di orari e appelli, l&rsquo;account facoltativo,
              l&rsquo;Assistente e l&rsquo;import PDF con l&rsquo;AI. Qui sotto
              trovi cosa inviano.
            </li>
            <li>Non vendiamo né cediamo i tuoi dati a nessuno.</li>
          </ul>
        </Panel>

        <Panel title="Sul tuo dispositivo" icon={<HardDrive />}>
          <div className={body}>
            <p>
              I dati che inserisci e la copia locale di orari, appelli e avvisi
              sono salvati nel database del browser (IndexedDB). Alcune preferenze
              (tema, tour già visto, promemoria già mostrati) stanno nel
              localStorage, e il service worker tiene in cache le pagine
              dell&rsquo;app per farla funzionare offline.
            </p>
            <p>
              L&rsquo;import del libretto da PDF Delphi legge il file interamente
              nel browser: il file non lascia il dispositivo.
            </p>
            <p>
              Puoi esportare tutto in JSON o cancellarlo da{" "}
              <Link href="/impostazioni" className={link}>
                Impostazioni → Privacy e dati
              </Link>
              , oppure cancellando i dati del sito dal browser.
            </p>
          </div>
        </Panel>

        <Panel title="Orari e appelli sincronizzati" icon={<RefreshCw />}>
          <div className={body}>
            <p>
              Se il tuo corso è «sync live», l&rsquo;app chiede al nostro server di
              scaricare orari e appelli pubblici dal portale del tuo ateneo. La
              richiesta contiene solo i codici di ateneo, corso e anno e
              l&rsquo;intervallo di date. È il nostro server a contattare il
              portale, quindi l&rsquo;ateneo non vede il tuo indirizzo IP.
            </p>
            <p>
              Le risposte vengono salvate solo sul tuo dispositivo: sul server non
              resta nulla. Lo stesso vale per la ricerca automatica degli
              insegnamenti del tuo corso.
            </p>
          </div>
        </Panel>

        <Panel title="Account (facoltativo)" icon={<UserRound />}>
          <div className={body}>
            <p>
              Puoi creare un account con l&rsquo;email universitaria per avere un
              backup e ritrovare i dati su altri dispositivi. In quel caso su
              Supabase, con server nell&rsquo;Unione Europea (Francoforte),
              vengono salvati:
            </p>
            <ul className={list}>
              <li>
                email e password (la password è gestita da Supabase Auth e non la
                vediamo in chiaro); l&rsquo;email serve solo per l&rsquo;accesso, la
                conferma dell&rsquo;account e il recupero della password;
              </li>
              <li>il profilo: ateneo, corso, anno e piano di studi;</li>
              <li>una copia di libretto, note, attività e sessioni di studio.</li>
            </ul>
            <p>
              Ogni riga è protetta da regole di accesso a livello di database (Row
              Level Security): nessun altro utente può leggerla. Per mantenere
              attiva la sessione si usano cookie tecnici.
            </p>
            <p>
              Dall&rsquo;app non puoi ancora eliminare l&rsquo;account: per
              cancellarlo, insieme ai dati in cloud, scrivi a <Contact />.
            </p>
          </div>
        </Panel>

        <Panel title="Assistente e import PDF con l’AI" icon={<Sparkles />}>
          <div className={body}>
            <p>
              L&rsquo;Assistente e il pulsante «Importa PDF» di Orario e Appelli
              usano un modello di intelligenza artificiale fornito da Groq (Stati
              Uniti). Solo quando li usi, inviano al nostro server, che li
              inoltra a Groq:
            </p>
            <ul className={list}>
              <li>
                <span className="text-ink">Assistente</span>: i messaggi della
                conversazione e un riepilogo del tuo contesto (ateneo, corso,
                anno, prossimi esami, lezioni di oggi, media ponderata, CFU e
                minuti di studio della settimana);
              </li>
              <li>
                <span className="text-ink">Importa PDF</span>: il testo estratto
                dal PDF, fino a 16.000 caratteri. Il file resta sul dispositivo.
              </li>
            </ul>
            <p>
              StudentOS non salva queste richieste: la conversazione vive solo
              nella pagina e sparisce quando la ricarichi o la chiudi. Groq le
              tratta secondo la{" "}
              <External href="https://groq.com/privacy-policy">
                sua informativa
              </External>
              . Non scrivere nell&rsquo;Assistente dati sensibili, per esempio
              sulla salute.
            </p>
          </div>
        </Panel>

        <Panel title="Cookie e dati tecnici" icon={<Cookie />}>
          <div className={body}>
            <ul className={list}>
              <li>Nessun cookie di profilazione o di analisi.</li>
              <li>
                <code className="text-ink">srl_…</code>: cookie tecnico che limita
                gli abusi sulle funzioni che chiamano il server
                (sincronizzazione, Assistente, import PDF). Contiene solo un
                contatore firmato e dura circa un minuto.
              </li>
              <li>Cookie di sessione di Supabase: solo se accedi con l&rsquo;account.</li>
            </ul>
            <p>
              Per difendersi dagli abusi, il nostro server usa il tuo indirizzo
              IP solo in memoria, per contare le richieste dell&rsquo;ultimo
              minuto: non finisce in nessun database né nei nostri log. Il fornitore di hosting, Vercel, registra
              come ogni server i dati tecnici delle richieste (indirizzo IP,
              orario, pagina richiesta) per sicurezza e funzionamento. I nostri
              log non contengono mai il testo dei tuoi messaggi né i tuoi dati di
              studio.
            </p>
            <p>
              I font sono serviti dal nostro dominio: il browser non contatta
              Google Fonts.
            </p>
          </div>
        </Panel>

        <Panel title="Fornitori" icon={<Server />}>
          <div className={body}>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Fornitori che trattano dati per conto di StudentOS
              </caption>
              <thead>
                <tr className="border-b border-line text-ink">
                  <th scope="col" className="py-2 pr-3 font-semibold">Fornitore</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Per cosa</th>
                  <th scope="col" className="py-2 font-semibold">Dove</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pr-3 font-medium text-ink">
                    <External href="https://vercel.com/legal/privacy-policy">Vercel</External>
                  </th>
                  <td className="py-2 pr-3">hosting del sito e del server</td>
                  <td className="py-2">società statunitense</td>
                </tr>
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pr-3 font-medium text-ink">
                    <External href="https://supabase.com/privacy">Supabase</External>
                  </th>
                  <td className="py-2 pr-3">account facoltativo e backup</td>
                  <td className="py-2">server nell&rsquo;UE (Francoforte)</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2 pr-3 font-medium text-ink">
                    <External href="https://groq.com/privacy-policy">Groq</External>
                  </th>
                  <td className="py-2 pr-3">Assistente e import PDF con l&rsquo;AI</td>
                  <td className="py-2">Stati Uniti</td>
                </tr>
              </tbody>
            </table>
            <p>
              Per i trasferimenti verso gli Stati Uniti valgono le garanzie
              previste dal GDPR (artt. 44 e seguenti) indicate nei termini di
              ciascun fornitore.
            </p>
          </div>
        </Panel>

        <Panel title="Basi giuridiche e conservazione" icon={<Scale />}>
          <div className={body}>
            <p>
              Trattiamo i dati solo per farti usare le funzioni che scegli (art.
              6.1.b GDPR) e per proteggere il servizio dagli abusi (legittimo
              interesse, art. 6.1.f GDPR).
            </p>
            <ul className={list}>
              <li>Dati sul dispositivo: finché non li cancelli.</li>
              <li>Account e dati in cloud: finché non chiedi di cancellarli.</li>
              <li>Richieste all&rsquo;AI: StudentOS non le conserva.</li>
              <li>Cookie tecnico di limite: circa un minuto.</li>
              <li>Log dell&rsquo;hosting: secondo i tempi di Vercel.</li>
            </ul>
          </div>
        </Panel>

        <Panel title="I tuoi diritti e i contatti" icon={<Mail />}>
          <div className={body}>
            <p>
              Puoi chiedere accesso, rettifica, cancellazione, limitazione e
              portabilità dei tuoi dati, e opporti al trattamento, scrivendo a{" "}
              <Contact />. I dati locali puoi esportarli in autonomia, in JSON,
              dalle Impostazioni.
            </p>
            <p>
              Hai anche diritto di reclamo al{" "}
              <External href="https://www.garanteprivacy.it">
                Garante per la protezione dei dati personali
              </External>
              .
            </p>
            <p>
              StudentOS è un progetto indipendente: per qualsiasi domanda sulla
              privacy scrivi a <Contact />.
            </p>
          </div>
        </Panel>
      </div>
    </main>
  );
}
