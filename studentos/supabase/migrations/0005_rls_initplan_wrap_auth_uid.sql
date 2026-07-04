-- Backport di una migration GIÀ applicata in produzione il 2026-06-15
-- (tracking history: version 20260615214229, rls_initplan_wrap_auth_uid).
-- Il file mancava nel repo (drift di sola documentazione): questo lo allinea.
--
-- Riscrive le 5 policy owner nel pattern initplan-safe: auth.uid() valutato una
-- sola volta come (select auth.uid()) invece che una volta per riga. Il
-- comportamento di sicurezza è IDENTICO a 0001_init; cambia solo la performance
-- (chiude l'advisor 0003_auth_rls_initplan). Le definizioni qui sotto rispecchiano
-- ESATTAMENTE lo stato osservato in pg_policies (for all, ruolo public,
-- using = with_check).
--
-- Idempotente: DROP POLICY IF EXISTS + CREATE POLICY (in Postgres non esiste
-- CREATE OR REPLACE POLICY). Richiede solo che le tabelle e le policy di 0001
-- esistano già.

drop policy if exists "profiles owner" on public.profiles;
create policy "profiles owner" on public.profiles
  for all using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "libretto owner" on public.libretto_entries;
create policy "libretto owner" on public.libretto_entries
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "notes owner" on public.notes;
create policy "notes owner" on public.notes
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "tasks owner" on public.tasks;
create policy "tasks owner" on public.tasks
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "focus owner" on public.focus_sessions;
create policy "focus owner" on public.focus_sessions
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
