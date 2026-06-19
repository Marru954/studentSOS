import type { Insegnamento } from "@/types/insegnamenti";

const ATENEO = "uniroma2";
const CORSO = "informatica-l31";

function ins(
  id: string,
  nome: string,
  cfu: number,
  anno: string,
  semestre: number,
  settore: string,
  docente: string,
  tipo: Insegnamento["tipo"],
  propedeuticita: string[],
  superata: boolean,
): Insegnamento {
  return {
    id,
    ateneo_id: ATENEO,
    corso_id: CORSO,
    nome,
    cfu,
    anno,
    semestre,
    settore,
    docente,
    tipo,
    propedeuticita: propedeuticita.length ? propedeuticita : undefined,
    superata,
    inserito_manualmente: false,
    created_at: "2025-09-01T00:00:00.000Z",
    updated_at: "2025-09-01T00:00:00.000Z",
  };
}

export const MOCK_INSEGNAMENTI: Insegnamento[] = [
  // ── I Anno ──────────────────────────────────────────────────────────────
  ins("fi1",  "Fondamenti di Informatica I",  9, "1", 1, "INF/01", "Prof. Claudio Cicconi",     "obbligatorio", [],               true),
  ins("am1",  "Analisi Matematica I",          9, "1", 1, "MAT/05", "Prof. Marco Ferrara",       "obbligatorio", [],               true),
  ins("alg",  "Algebra",                       6, "1", 2, "MAT/02", "Prof.ssa Laura Mancini",    "obbligatorio", [],               true),
  ins("fi2",  "Fondamenti di Informatica II",  9, "1", 2, "INF/01", "Prof. Claudio Cicconi",     "obbligatorio", ["fi1"],          true),
  ins("fis1", "Fisica I",                      6, "1", 2, "FIS/01", "Prof. Andrea Russo",        "obbligatorio", ["am1"],          false),

  // ── II Anno ─────────────────────────────────────────────────────────────
  ins("asd",  "Algoritmi e Strutture Dati",    9, "2", 1, "INF/01", "Prof. Emanuele Viterbo",    "obbligatorio", ["fi2"],          true),
  ins("am2",  "Analisi Matematica II",         6, "2", 1, "MAT/05", "Prof. Marco Ferrara",       "obbligatorio", ["am1"],          false),
  ins("bd1",  "Basi di Dati I",                9, "2", 2, "INF/01", "Prof.ssa Sara Conti",       "obbligatorio", ["fi2"],          false),
  ins("reti", "Reti di Calcolatori",           6, "2", 2, "ING-INF/05", "Prof. Luca Palestini",  "obbligatorio", ["fi2"],          false),
  ins("so",   "Sistemi Operativi",             9, "2", 2, "INF/01", "Prof. Flavio De Paoli",     "obbligatorio", ["fi2"],          false),

  // ── III Anno ────────────────────────────────────────────────────────────
  ins("ing",  "Ingegneria del Software",       9, "3", 1, "INF/01", "Prof.ssa Elena Baralis",    "obbligatorio", ["asd", "bd1"],   false),
  ins("ia",   "Intelligenza Artificiale",      6, "3", 1, "INF/01", "Prof. Roberto Basili",      "obbligatorio", ["asd"],          false),
  ins("lc",   "Linguaggi e Compilatori",       9, "3", 2, "INF/01", "Prof. Maurizio Lenzerini",  "obbligatorio", ["asd", "so"],    false),
  ins("sec",  "Sicurezza Informatica",         6, "3", 2, "ING-INF/05", "Prof. Roberto De Prisco","obbligatorio", ["reti"],        false),
  ins("sc1",  "A Scelta – Visione Artificiale",6, "3", 1, "INF/01", "Prof.ssa Federica Gasparini","scelta",      [],               false),
  ins("sc2",  "A Scelta – Bioinformatica",     6, "3", 2, "INF/01", "Prof. Paolo Romano",        "scelta",       [],               false),
];
