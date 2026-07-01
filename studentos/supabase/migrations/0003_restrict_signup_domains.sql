-- StudentOS — gate email istituzionale lato server (Before User Created Auth Hook).
--
-- PERCHÉ: `isUniversityEmail` (src/lib/domain/emailToAteneo.ts) gira SOLO nel
-- client (wrapper signUpWithPassword / requestPasswordReset + UI). La anon key è
-- pubblica per design, quindi un attaccante può chiamare direttamente
-- `POST https://<project>.supabase.co/auth/v1/signup` con una qualunque
-- `@gmail.com`, bypassando del tutto il gate. Non rompe l'isolamento RLS (ogni
-- riga resta scoped a auth.uid()), ma viola l'invariante "solo inbox istituzionali"
-- e regala account illimitati validi per il Level-A auth gate del proxy AI
-- (aiGuard.ts → quota Groq). Questo hook sposta il controllo dove è davvero
-- vincolante: prima dell'inserimento in auth.users.
--
-- COSA FA: rifiuta la creazione dell'utente se il dominio dell'email non è (o non
-- è sotto) un dominio accademico dell'allowlist. Replica la logica esatta di
-- `isUniversityEmail`, incluso il SUFFIX-MATCHING: un host è ammesso se coincide
-- con una voce dell'allowlist OPPURE ne è un sottodominio a confine di etichetta
-- (es. `foo.uniroma2.it` è ammesso perché `uniroma2.it` è in lista). L'esempio
-- "Allow by Domain" dei docs Supabase fa solo match esatto — qui serve il suffix
-- match per coincidere col comportamento del client.
--
-- ⚠️ DRIFT: questo elenco è una COPIA della lista TypeScript
-- (DOMAIN_TO_PRESET keys ∪ EXTRA_ACADEMIC_DOMAINS in emailToAteneo.ts, 112 domini
-- al 2026-07-01). Postgres non può invocare il predicato JS, quindi le due liste
-- vanno tenute allineate a mano: se aggiungi/rimuovi un ateneo in emailToAteneo.ts,
-- aggiorna anche questa funzione (nuova migration). L'elenco è stato ESTRATTO
-- automaticamente dal sorgente TS, non riscritto a mano.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- ATTIVAZIONE MANUALE (NON è automatica — la fa l'utente, non questa migration):
--
--   1. Applica questa migration al progetto (SQL Editor o `supabase db push`).
--      Crea SOLO la funzione + i grant; di per sé non cambia il comportamento
--      dell'auth finché l'hook non è collegato al passo 2.
--   2. Dashboard Supabase → Authentication → Hooks (Auth Hooks) →
--      "Before User Created" → tipo "Postgres" → seleziona la funzione
--      `public.hook_restrict_signup_to_university_domains` → Enable.
--   3. Verifica: un signup con `@gmail.com` deve fallire con HTTP 403 e messaggio
--      "Registrazione consentita solo con un'email istituzionale…"; un signup con
--      un dominio accademico (es. `@studenti.uniroma2.it`) deve passare.
--
-- Questo file NON è stato applicato al progetto Supabase live in questa sessione:
-- è solo codice versionato, revisionabile come qualunque altro commit.
-- ─────────────────────────────────────────────────────────────────────────────

-- Funzione hook chiamata da GoTrue prima dell'inserimento in auth.users.
-- Contratto (docs Before User Created Hook): riceve un solo argomento jsonb
-- `event` con `event->'user'->>'email'`; ritorna `{}` per consentire, oppure
-- `{"error": {"http_code": …, "message": …}}` per bloccare il signup.
create or replace function public.hook_restrict_signup_to_university_domains(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  -- Allowlist accademica: COPIA di emailToAteneo.ts (vedi ⚠️ DRIFT in testa).
  v_allowed text[] := array[
    'campus.unimib.it', 'community.unipa.it', 'edu.unife.it', 'edu.unifi.it',
    'edu.unige.it', 'edu.unito.it', 'humanitasuniversity.it', 'imtlucca.it',
    'iuav.it', 'iulm.it', 'luiss.it', 'mail.polimi.it',
    'poliba.it', 'polimi.it', 'polito.it', 'polraba.it',
    'santannapisa.it', 'sns.it', 'spes.uniud.it', 'stud.iuav.it',
    'stud.unifi.it', 'stud.unive.it', 'studbocconi.it', 'student.unisi.it',
    'student.univaq.it', 'studenti.iulm.it', 'studenti.luiss.it', 'studenti.poliba.it',
    'studenti.polito.it', 'studenti.uniba.it', 'studenti.unibg.it', 'studenti.unica.it',
    'studenti.unical.it', 'studenti.unicampania.it', 'studenti.unige.it', 'studenti.unime.it',
    'studenti.unimi.it', 'studenti.unimore.it', 'studenti.unina.it', 'studenti.uninsubria.it',
    'studenti.unipd.it', 'studenti.unipg.it', 'studenti.unipi.it', 'studenti.unipr.it',
    'studenti.uniroma1.it', 'studenti.uniroma2.it', 'studenti.uniroma3.it', 'studenti.unisa.it',
    'studenti.unisalento.it', 'studenti.uniss.it', 'studenti.unistrasi.it', 'studenti.unitn.it',
    'studenti.units.it', 'studenti.unitus.it', 'studenti.uniupo.it', 'studenti.univpm.it',
    'studenti.univr.it', 'students.uniroma2.eu', 'studio.unibo.it', 'studium.unict.it',
    'uniba.it', 'unibas.it', 'unibg.it', 'unibo.it',
    'unibocconi.it', 'unica.it', 'unical.it', 'unicam.it',
    'unicampania.it', 'unicatt.it', 'unich.it', 'unict.it',
    'unife.it', 'unifg.it', 'unifi.it', 'unige.it',
    'unimc.it', 'unime.it', 'unimi.it', 'unimib.it',
    'unimore.it', 'unina.it', 'uninsubria.it', 'unipa.it',
    'unipd.it', 'unipg.it', 'unipi.it', 'unipr.it',
    'unipv.it', 'unirc.it', 'uniroma1.it', 'uniroma2.it',
    'uniroma3.it', 'unisa.it', 'unisalento.it', 'unisannio.it',
    'unisg.it', 'unisi.it', 'uniss.it', 'unistrasi.it',
    'unite.it', 'unitn.it', 'unito.it', 'units.it',
    'unitus.it', 'uniud.it', 'uniupo.it', 'univaq.it',
    'unive.it', 'universitadipavia.it', 'univpm.it', 'univr.it'
  ];
  v_email text;
  v_host  text;
  v_d     text;
  v_reject jsonb := jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Registrazione consentita solo con un''email istituzionale di un ateneo italiano.'
    )
  );
begin
  v_email := lower(coalesce(event->'user'->>'email', ''));
  v_host  := split_part(v_email, '@', 2);

  -- Fail-closed: email o dominio assente → blocca (come isUniversityEmail → false).
  if v_host = '' then
    return v_reject;
  end if;

  -- Suffix-matching a confine di etichetta: host == d oppure host termina con '.'||d.
  foreach v_d in array v_allowed loop
    if v_host = v_d or right(v_host, char_length(v_d) + 1) = '.' || v_d then
      return '{}'::jsonb;  -- dominio accademico → consenti
    end if;
  end loop;

  return v_reject;
end;
$$;

-- Permessi: solo l'auth server (supabase_auth_admin) può invocare l'hook; nessun
-- accesso da anon/authenticated/public (stesso pattern dei docs Supabase).
grant execute
  on function public.hook_restrict_signup_to_university_domains(jsonb)
  to supabase_auth_admin;

revoke execute
  on function public.hook_restrict_signup_to_university_domains(jsonb)
  from authenticated, anon, public;
