"use client";

/**
 * Pannello "Sincronizza con Delphi". La sincronizzazione SSO con Tor Vergata
 * non è ancora attiva: mostriamo il pulsante (disabilitato) con badge
 * "prossimamente". L'infrastruttura SSO/SAML (/api/saml/*, useDelphi) resta in
 * piedi per l'attivazione futura; per ora gli esami si inseriscono a mano.
 */
import { LogIn, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Panel } from "@/components/primitives/Panel";

export function DelphiConnect({ className }: { className?: string }) {
  return (
    <Panel
      title="Sincronizza con Delphi"
      icon={<ShieldCheck />}
      className={className}
      actions={<Badge tone="warn">prossimamente</Badge>}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ink-mute">
          La sincronizzazione automatica della carriera via SSO Tor Vergata
          sarà disponibile a breve. Per ora aggiungi gli esami manualmente dal
          modulo, oppure importali da un file CSV.
        </p>
        <Button variant="primary" disabled className="w-max" aria-disabled="true">
          <LogIn aria-hidden="true" className="size-4" />
          Accedi con SSO Tor Vergata
        </Button>
      </div>
    </Panel>
  );
}
