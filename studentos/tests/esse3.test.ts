import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEsse3Libretto } from "@/lib/esse3/parse";

// Fixture verosimile di righe libretto Esse3 (e3rest libretto-service-v2).
const RIGHE = [
  {
    adDes: "BASI DI DATI",
    peso: 9,
    statoDes: "Superata",
    esito: { voto: 30, lodeFlg: 1, modValCod: "V", dataApp: "2024-06-18" },
  },
  {
    adDes: "LINGUA INGLESE B2",
    peso: 3,
    statoDes: "Superata",
    esito: { modValCod: "G", tipoGiudizioDes: "IDONEO", dataApp: "20/09/2024" },
  },
  {
    adDes: "ANALISI MATEMATICA 1",
    peso: 12,
    statoDes: "Superata",
    esito: { voto: 25, lodeFlg: 0, modValCod: "V", dataApp: "2023-06-20T10:00:00" },
  },
  // non superata → esclusa
  { adDes: "FISICA GENERALE", peso: 9, statoDes: "Frequentata", esito: null },
  // senza esito → esclusa
  { adDes: "RIGA SENZA ESITO", peso: 6 },
];

test("Esse3: estrae solo gli esami superati, voti/lode/idoneità corretti", () => {
  const entries = parseEsse3Libretto(RIGHE);
  assert.equal(entries.length, 3);

  const bd = entries.find((e) => e.courseName === "BASI DI DATI");
  assert.deepEqual(bd?.grade, { kind: "numeric", value: 30, laude: true });
  assert.equal(bd?.cfu, 9);
  assert.equal(bd?.date, "2024-06-18");
  assert.equal(bd?.source, "delphi");

  const ing = entries.find((e) => e.courseName === "LINGUA INGLESE B2");
  assert.deepEqual(ing?.grade, { kind: "pass" });
  assert.equal(ing?.date, "2024-09-20"); // dd/mm/yyyy → ISO

  const an = entries.find((e) => e.courseName === "ANALISI MATEMATICA 1");
  assert.deepEqual(an?.grade, { kind: "numeric", value: 25, laude: false });
  assert.equal(an?.date, "2023-06-20"); // orario rimosso
});

test("Esse3: input vuoto o non-array → nessuna riga", () => {
  assert.deepEqual(parseEsse3Libretto([]), []);
  assert.deepEqual(parseEsse3Libretto(null), []);
  assert.deepEqual(parseEsse3Libretto({ foo: "bar" }), []);
});

test("Esse3: gli id sono stabili tra due parse", () => {
  const a = parseEsse3Libretto(RIGHE).map((e) => e.id);
  const b = parseEsse3Libretto(RIGHE).map((e) => e.id);
  assert.deepEqual(a, b);
});
