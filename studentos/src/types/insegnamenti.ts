export type TipoInsegnamento = "obbligatorio" | "scelta" | "altro";

export interface Insegnamento {
  id: string;
  ateneo_id: string;
  corso_id: string;
  nome: string;
  codice?: string;
  settore?: string;
  cfu: number;
  semestre?: number | string;
  docente?: string;
  propedeuticita?: string[];
  anno?: string;
  tipo: TipoInsegnamento;
  inserito_manualmente: boolean;
  superata?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ManifestoInsegnamenti {
  id: string;
  ateneo_id: string;
  corso_id: string;
  url_sorgente?: string;
  anno_accademico: string;
  last_sync?: string;
}
