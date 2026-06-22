import assert from "node:assert/strict";
import { test } from "node:test";
import {
  discoverManifesto,
  discoverManifestoUrl,
  isManifestoHtml,
  slugify,
} from "@/lib/insegnamenti/discovery";

// --- slugify: corso -> slug per le corsoUrls ------------------------------

test("slugify normalizza spazi e diacritici", () => {
  assert.equal(slugify("Ingegneria Informatica"), "ingegneria-informatica");
});

test("slugify rimuove gli accenti", () => {
  assert.equal(slugify("Matemàtica Applicàta"), "matematica-applicata");
});

test("slugify taglia i trattini agli estremi e collassa i separatori", () => {
  assert.equal(slugify("  --Fisica & Co.--  "), "fisica-co");
});

// --- isManifestoHtml: validazione pagina (no DOMParser) -------------------

test("isManifestoHtml: tabella + token CFU -> true", () => {
  assert.equal(
    isManifestoHtml("<html><table><tr><td>CFU</td></tr></table></html>"),
    true,
  );
});

test("isManifestoHtml: tabella senza CFU/crediti -> false", () => {
  assert.equal(isManifestoHtml("<table><tr><td>Nome</td></tr></table>"), false);
});

test("isManifestoHtml: token CFU ma nessuna tabella -> false", () => {
  assert.equal(isManifestoHtml("<p>Totale 180 CFU</p>"), false);
});

test("isManifestoHtml: stringa vuota -> false", () => {
  assert.equal(isManifestoHtml(""), false);
});

test("isManifestoHtml: 'crediti' come token alternativo a CFU", () => {
  assert.equal(
    isManifestoHtml("<table><tr><td>crediti formativi</td></tr></table>"),
    true,
  );
});

// --- SSRF: un ateneo sconosciuto non viene mai contattato ------------------

test("discoverManifesto: ateneo fuori allowlist -> null senza alcun fetch", async () => {
  // Nessun host curato corrisponde -> resolveAteneo undefined -> return null
  // PRIMA di qualunque rete. Se questo facesse rete il test fallirebbe/penderebbe.
  assert.equal(await discoverManifesto("ateneo-inesistente-xyz"), null);
});

test("discoverManifestoUrl: ateneo sconosciuto -> null", async () => {
  assert.equal(await discoverManifestoUrl("totalmente-ignoto"), null);
});
