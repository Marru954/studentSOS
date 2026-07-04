-- Backport di una migration GIÀ applicata in produzione il 2026-06-15
-- (tracking history: version 20260615214056, revoke_execute_handle_new_user).
-- Il file mancava nel repo (drift di sola documentazione): questo lo allinea.
--
-- handle_new_user() è SECURITY DEFINER ed è il trigger di auth.users: non deve
-- essere chiamabile via API dai ruoli esposti. Revoca EXECUTE da anon,
-- authenticated e public; restano solo owner (postgres) e service_role.
--
-- Idempotente: un REVOKE ripetuto è un no-op.
-- Stato atteso dopo l'applicazione (ACL della funzione):
--   {postgres=X/postgres, service_role=X/postgres}

revoke execute on function public.handle_new_user() from anon, authenticated, public;
