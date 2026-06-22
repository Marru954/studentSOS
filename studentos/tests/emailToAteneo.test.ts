import assert from "node:assert/strict";
import { test } from "node:test";
import { isUniversityEmail, detectAteneo } from "@/lib/domain/emailToAteneo";

// ── isUniversityEmail: happy path ───────────────────────────────────────────

test("email istituzionale Tor Vergata è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("mario.rossi@uniroma2.it"), true);
});

test("email istituzionale Sapienza è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("studente@uniroma1.it"), true);
});

test("email istituzionale Bologna è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("a.bianchi@unibo.it"), true);
});

test("email istituzionale Politecnico di Milano è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("test@polimi.it"), true);
});

test("email con sottodominio studio Bologna è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("utente@studio.unibo.it"), true);
});

test("email con sottodominio studenti Padova è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("studente@studenti.unipd.it"), true);
});

test("email con sottodominio studenti Politecnico di Torino è riconosciuta", () => {
  assert.equal(isUniversityEmail("pippo@studenti.polito.it"), true);
});

test("email con sottodominio mail Politecnico di Milano è riconosciuta", () => {
  assert.equal(isUniversityEmail("user@mail.polimi.it"), true);
});

test("email con sottodominio stud Firenze è riconosciuta come universitaria", () => {
  assert.equal(isUniversityEmail("x@stud.unifi.it"), true);
});

test("email nel dominio extra-accademico senza preset (uniroma3) è valida", () => {
  assert.equal(isUniversityEmail("tizio@uniroma3.it"), true);
});

test("email nel dominio extra-accademico con sottodominio (luiss) è valida", () => {
  assert.equal(isUniversityEmail("caio@studenti.luiss.it"), true);
});

// ── isUniversityEmail: email non universitarie ──────────────────────────────

test("email Gmail non è universitaria", () => {
  assert.equal(isUniversityEmail("mario.rossi@gmail.com"), false);
});

test("email Outlook non è universitaria", () => {
  assert.equal(isUniversityEmail("mario@outlook.com"), false);
});

test("email dominio .edu (americano) non è universitaria italiana", () => {
  assert.equal(isUniversityEmail("student@harvard.edu"), false);
});

test("email dominio sconosciuto con .it non è universitaria", () => {
  assert.equal(isUniversityEmail("user@dominiocasuale.it"), false);
});

// ── isUniversityEmail: input malformati ─────────────────────────────────────

test("stringa senza @ ritorna false", () => {
  assert.equal(isUniversityEmail("nonunemail"), false);
});

test("stringa vuota ritorna false", () => {
  assert.equal(isUniversityEmail(""), false);
});

test("@ senza dominio ritorna false", () => {
  assert.equal(isUniversityEmail("user@"), false);
});

test("dominio senza punto ritorna false", () => {
  assert.equal(isUniversityEmail("user@uniroma2"), false);
});

test("doppia @ ritorna false", () => {
  assert.equal(isUniversityEmail("a@b@uniroma2.it"), false);
});

// ── detectAteneo: happy path ─────────────────────────────────────────────────

test("email Tor Vergata restituisce il preset corretto", () => {
  assert.equal(detectAteneo("mario@uniroma2.it"), "uniroma2-informatica-triennale");
});

test("email studenti Tor Vergata restituisce lo stesso preset", () => {
  assert.equal(detectAteneo("m.rossi@studenti.uniroma2.it"), "uniroma2-informatica-triennale");
});

test("email students.uniroma2.eu restituisce il preset Tor Vergata", () => {
  assert.equal(detectAteneo("x@students.uniroma2.eu"), "uniroma2-informatica-triennale");
});

test("email Sapienza restituisce il preset corretto", () => {
  assert.equal(detectAteneo("utente@uniroma1.it"), "uniroma1-sapienza");
});

test("email studenti Sapienza restituisce il preset corretto", () => {
  assert.equal(detectAteneo("utente@studenti.uniroma1.it"), "uniroma1-sapienza");
});

test("email Bologna restituisce preset unibo", () => {
  assert.equal(detectAteneo("a@unibo.it"), "unibo");
});

test("email studio Bologna restituisce preset unibo", () => {
  assert.equal(detectAteneo("b@studio.unibo.it"), "unibo");
});

test("email Padova restituisce preset unipd", () => {
  assert.equal(detectAteneo("c@unipd.it"), "unipd");
});

test("email studenti Padova restituisce preset unipd", () => {
  assert.equal(detectAteneo("d@studenti.unipd.it"), "unipd");
});

test("email Firenze restituisce preset unifi-informatica", () => {
  assert.equal(detectAteneo("e@unifi.it"), "unifi-informatica");
});

test("email stud.unifi.it restituisce preset unifi-informatica", () => {
  assert.equal(detectAteneo("f@stud.unifi.it"), "unifi-informatica");
});

test("email Napoli Federico II restituisce preset unina-informatica", () => {
  assert.equal(detectAteneo("g@unina.it"), "unina-informatica");
});

test("email Ca' Foscari Venezia restituisce preset unive-informatica", () => {
  assert.equal(detectAteneo("h@unive.it"), "unive-informatica");
});

test("email Bari restituisce preset uniba-giurisprudenza", () => {
  assert.equal(detectAteneo("i@uniba.it"), "uniba-giurisprudenza");
});

test("email studenti Bari restituisce preset uniba-giurisprudenza", () => {
  assert.equal(detectAteneo("j@studenti.uniba.it"), "uniba-giurisprudenza");
});

// ── detectAteneo: domini validi senza preset ────────────────────────────────

test("email dominio extra-accademico senza preset restituisce null", () => {
  assert.equal(detectAteneo("tizio@uniroma3.it"), null);
});

test("email LUISS (solo in extra, nessun preset) restituisce null", () => {
  assert.equal(detectAteneo("utente@luiss.it"), null);
});

// ── detectAteneo: input non universitari e malformati ───────────────────────

test("email Gmail restituisce null", () => {
  assert.equal(detectAteneo("mario@gmail.com"), null);
});

test("stringa senza @ restituisce null", () => {
  assert.equal(detectAteneo("nonunemail"), null);
});

test("stringa vuota restituisce null", () => {
  assert.equal(detectAteneo(""), null);
});

test("dominio senza punto restituisce null", () => {
  assert.equal(detectAteneo("user@uniroma2"), null);
});

test("@ senza dominio restituisce null", () => {
  assert.equal(detectAteneo("user@"), null);
});
