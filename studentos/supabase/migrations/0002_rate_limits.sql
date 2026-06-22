-- StudentOS — rate limiting distribuito (cross-istanza) per il proxy AI (Groq).
-- Apply via the Supabase SQL editor (or `supabase db push`).
--
-- Perché: i contatori di rate-limit del proxy AI erano in-memory per-istanza.
-- Su serverless ogni istanza ha la propria memoria, quindi il limite globale
-- (circuit-breaker al minuto + cap giornaliero a protezione della quota Groq)
-- NON era condiviso: con N istanze la quota effettiva diventava N×. Questa
-- tabella + funzione spostano il contatore in un singolo store condiviso, così
-- il limite è uno solo per tutte le istanze.
--
-- Sicurezza: la tabella è bloccata da RLS senza policy → nessun accesso diretto
-- da anon/authenticated. L'unico modo per toccarla è la funzione SECURITY
-- DEFINER `rate_limit_hit`, che incrementa atomicamente e applica la finestra.
-- La chiave del rate-limit è decisa dal SERVER (es. "ai:cb", "ai:daily"): non
-- contiene input del client, quindi non è falsificabile.

-- ── tabella contatori ────────────────────────────────────────────────────────
create table if not exists public.rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

-- RLS abilitata SENZA policy: deny-by-default. Solo la funzione security definer
-- qui sotto può leggere/scrivere la tabella.
alter table public.rate_limits enable row level security;

-- ── incremento atomico a finestra fissa ─────────────────────────────────────
-- Un solo statement (UPSERT) → race-free tra istanze concorrenti. La finestra
-- si azzera quando è scaduta (fixed-window che riparte dal primo colpo della
-- finestra corrente). Ritorna se la richiesta è consentita, il conteggio
-- corrente e i secondi di attesa al superamento.
create or replace function public.rate_limit_hit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table(allowed boolean, current_count integer, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count integer;
  v_window_start timestamptz;
begin
  insert into public.rate_limits as rl (key, window_start, count)
  values (p_key, v_now, 1)
  on conflict (key) do update
    set
      count = case
        when rl.window_start + make_interval(secs => p_window_seconds) <= v_now then 1
        else rl.count + 1
      end,
      window_start = case
        when rl.window_start + make_interval(secs => p_window_seconds) <= v_now then v_now
        else rl.window_start
      end
  returning rl.count, rl.window_start into v_count, v_window_start;

  if v_count > p_limit then
    return query select
      false,
      v_count,
      greatest(
        0,
        ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - v_now)))
      )::integer;
  else
    return query select true, v_count, 0;
  end if;
end;
$$;

-- Solo la funzione è invocabile dai ruoli client; la tabella resta inaccessibile.
revoke all on function public.rate_limit_hit(text, integer, integer) from public;
grant execute on function public.rate_limit_hit(text, integer, integer) to anon, authenticated;
