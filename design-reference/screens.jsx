/* App screens: Cruscotto, Orario, Appelli, Libretto, Note. window.Screens */
(function () {
  const { useState } = React;
  const I = window.Icons;
  const { Reveal, Ring, Sparkline, Stat, CountUp } = window.UI;

  /* ── shared bits ──────────────────────────────────────────────────────── */
  function Page({ title, sub, action, children }) {
    return React.createElement("main", { id: "contenuto", className: "wrap", style: { position: "relative", zIndex: 2, paddingTop: "1.5rem", paddingBottom: "4rem" } },
      React.createElement(Reveal, { className: "in", style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.6rem" } },
        React.createElement("div", null,
          React.createElement("h1", { style: { fontSize: "clamp(2rem, 5vw, 3rem)" } }, title),
          sub && React.createElement("p", { className: "muted", style: { marginTop: "0.4rem" } }, sub)),
        action),
      children);
  }
  const Card = ({ title, icon, children, style, className = "", action }) =>
    React.createElement(Reveal, { className: "glass " + className, style: { padding: "1.4rem", ...style } },
      (title || action) && React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.55rem" } },
          icon && React.createElement("span", { style: { color: "var(--signal-2)" } }, React.createElement(I[icon], { size: 18 })),
          title && React.createElement("h3", { style: { fontSize: "0.95rem", fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: 0 } }, title)),
        action),
      children);

  /* ── data ─────────────────────────────────────────────────────────────── */
  const LESSONS = [
    { name: "Analisi Matematica II", day: 0, start: 9, end: 11, room: "Aula 7", c: 0 },
    { name: "Architettura elaboratori", day: 0, start: 11, end: 13, room: "Aula 18", c: 1 },
    { name: "Basi di dati", day: 1, start: 9, end: 11, room: "Lab 2", c: 2 },
    { name: "Reti di calcolatori", day: 1, start: 14, end: 16, room: "Aula B", c: 3 },
    { name: "Sistemi operativi", day: 2, start: 9, end: 11, room: "Aula 12", c: 4 },
    { name: "Analisi Matematica II", day: 2, start: 11, end: 13, room: "Aula 7", c: 0 },
    { name: "Basi di dati", day: 3, start: 14, end: 17, room: "Lab 2", c: 2 },
    { name: "Reti di calcolatori", day: 4, start: 9, end: 11, room: "Aula B", c: 3 },
    { name: "Sistemi operativi", day: 4, start: 11, end: 13, room: "Aula 12", c: 4 },
  ];
  const COURSE_HUE = ["255", "280", "200", "330", "160"];
  const EXAMS = [
    { name: "Calcolo delle probabilità", date: "19 giu", time: "10:00", room: "Aula 18", days: 2, tone: "danger", label: "scade tra 2g" },
    { name: "Basi di dati e conoscenza", date: "3 lug", time: "09:30", room: "Aula T5", days: 20, tone: "signal", label: "prenotabile" },
    { name: "Sistemi operativi", date: "10 lug", time: "09:00", room: "Aula 12", days: 27, tone: null, label: "appello" },
    { name: "Reti di calcolatori", date: "15 lug", time: "14:00", room: "Aula B", days: 32, tone: null, label: "appello" },
  ];
  const GRADES = [
    { name: "Programmazione I", grade: "30L", cfu: 12 },
    { name: "Analisi Matematica I", grade: "28", cfu: 9 },
    { name: "Matematica discreta", grade: "30", cfu: 6 },
    { name: "Algoritmi e strutture dati", grade: "27", cfu: 9 },
    { name: "Fisica Generale", grade: "26", cfu: 9 },
    { name: "Architettura elaboratori", grade: "25", cfu: 6 },
    { name: "Analisi Matematica II", grade: "28", cfu: 9 },
    { name: "Basi di dati", grade: "29", cfu: 9 },
    { name: "Programmazione II", grade: "27", cfu: 12 },
    { name: "Calcolo numerico", grade: "26", cfu: 6 },
  ];
  const NEWS = [
    { tone: "warn", t: "Aula cambiata", d: "Sistemi operativi si terrà in Aula 12 da lunedì." },
    { tone: "signal", t: "Sessione estiva", d: "Aperte le prenotazioni per gli appelli di luglio." },
    { tone: "ok", t: "Voto registrato", d: "Basi di dati — 29/30 verbalizzato su Delphi." },
  ];
  const NOTES = [
    { subj: "Basi di dati", title: "Normalizzazione (1NF→BCNF)", date: "ieri", words: 420 },
    { subj: "Reti", title: "Modello OSI e incapsulamento", date: "2 giorni fa", words: 310 },
    { subj: "Analisi II", title: "Serie di Fourier — convergenza", date: "5 giorni fa", words: 680 },
    { subj: "Sistemi operativi", title: "Scheduling: round-robin vs SJF", date: "1 sett. fa", words: 540 },
  ];

  /* ── CRUSCOTTO ────────────────────────────────────────────────────────── */
  function Cruscotto({ go }) {
    return React.createElement(Page, {
      title: "Cruscotto",
      sub: "Venerdì 13 giugno 2026 · tutto ciò che conta, adesso",
      action: React.createElement("span", { className: "chip chip-signal" }, React.createElement(I.Sparkles, { size: 13 }), "sync attiva"),
    },
      React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(12, 1fr)" } },
        /* summary bar */
        React.createElement("div", { style: { gridColumn: "span 12" } },
          React.createElement(Card, { style: { padding: "1.1rem 1.4rem" } },
            React.createElement("div", { style: { display: "flex", gap: "2.5rem", flexWrap: "wrap", alignItems: "center" } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.7rem" } },
                React.createElement("span", { className: "grad-fill", style: chipIcon }, React.createElement(I.CalendarClock, { size: 18 })),
                React.createElement("div", null,
                  React.createElement("div", { className: "font-num", style: bigNum }, "2 giorni"),
                  React.createElement("div", { className: "faint", style: tiny }, "al prossimo esame"))),
              React.createElement("div", { style: { width: 1, height: 36, background: "var(--hairline)" } }),
              React.createElement("div", null,
                React.createElement("div", { className: "font-num", style: bigNum }, "1"),
                React.createElement("div", { className: "faint", style: tiny }, "esame questa settimana")),
              React.createElement("div", { style: { width: 1, height: 36, background: "var(--hairline)" } }),
              React.createElement("div", null,
                React.createElement("div", { className: "font-num", style: bigNum }, "27,4"),
                React.createElement("div", { className: "faint", style: tiny }, "media ponderata"))))),
        /* quick actions */
        React.createElement("div", { style: { gridColumn: "span 12" } },
          React.createElement("div", { style: { display: "flex", gap: "0.7rem", flexWrap: "wrap" } },
            [["GradCap", "Libretto", "libretto"], ["CalendarClock", "Appelli", "appelli"], ["Timer", "Avvia Focus", "focus"], ["Notebook", "Nuova nota", "note"]].map(([ic, lb, dest], i) =>
              React.createElement(Reveal, { key: lb, delay: i * 0.05, as: "button", className: "glass lift", onClick: () => go(dest),
                style: { padding: "0.7rem 1.1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "inherit", fontWeight: 600, fontSize: "0.88rem" } },
                React.createElement("span", { style: { color: "var(--signal-2)" } }, React.createElement(I[ic], { size: 17 })), lb)))),
        /* media panel */
        React.createElement("div", { className: "col7" },
          React.createElement(Card, { title: "Carriera", icon: "Trend", style: { height: "100%" } },
            React.createElement("div", { style: { display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" } },
              React.createElement(Stat, { label: "Media ponderata", value: "27,4", hint: "+0,2 sugli ultimi 4 esami", tone: "var(--signal-2)" }),
              React.createElement(Stat, { label: "Base di laurea", value: "100,5", unit: "/110" }),
              React.createElement("div", null,
                React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)", letterSpacing: "0.08em", marginBottom: "0.5rem" } }, "Andamento voti"),
                React.createElement(Sparkline, { values: [25, 26, 24, 27, 28, 27, 28], width: 180, height: 48 }))))),
        /* CFU ring */
        React.createElement("div", { className: "col5" },
          React.createElement(Card, { title: "Avanzamento CFU", icon: "GradCap", style: { height: "100%" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1.4rem" } },
              React.createElement(Ring, { value: 96 / 180, size: 124 },
                React.createElement("span", { className: "font-num", style: { fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 700 } }, "96"),
                React.createElement("span", { className: "faint", style: { fontSize: "0.72rem" } }, "/180 CFU")),
              React.createElement("p", { className: "muted", style: { fontSize: "0.9rem", maxWidth: "20ch" } }, "Mancano ", React.createElement("strong", { style: { color: "var(--ink)" } }, "84 CFU"), " alla laurea. Sei al 53% del percorso.")))),
        /* exam timeline */
        React.createElement("div", { className: "col8" },
          React.createElement(Card, { title: "Prossimi appelli", icon: "CalendarClock", style: { height: "100%" }, action: React.createElement("button", { className: "navlink", onClick: () => go("appelli"), style: { fontSize: "0.78rem" } }, "Tutti", React.createElement(I.ArrowRight, { size: 13 })) },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.6rem" } },
              EXAMS.slice(0, 3).map((e) => React.createElement(ExamRow, { key: e.name, e }))))),
        /* news */
        React.createElement("div", { className: "col4" },
          React.createElement(Card, { title: "Avvisi", icon: "Bell", style: { height: "100%" } },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.9rem" } },
              NEWS.map((n) => React.createElement("div", { key: n.t, style: { display: "flex", gap: "0.7rem" } },
                React.createElement("span", { style: { width: 8, height: 8, borderRadius: 99, marginTop: 6, flex: "none", background: "var(--" + n.tone + ")" } }),
                React.createElement("div", null,
                  React.createElement("div", { style: { fontWeight: 600, fontSize: "0.88rem" } }, n.t),
                  React.createElement("div", { className: "muted", style: { fontSize: "0.82rem" } }, n.d)))))))));
  }

  const ExamRow = ({ e }) => React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1rem", padding: "0.7rem 0", borderBottom: "1px solid var(--hairline)" } },
    React.createElement("div", { style: { textAlign: "center", minWidth: 52 } },
      React.createElement("div", { className: "font-num", style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem" } }, e.date.split(" ")[0]),
      React.createElement("div", { className: "faint", style: { fontSize: "0.7rem", textTransform: "uppercase" } }, e.date.split(" ")[1])),
    React.createElement("div", { style: { flex: 1 } },
      React.createElement("div", { style: { fontWeight: 600, fontSize: "0.92rem" } }, e.name),
      React.createElement("div", { className: "faint font-num", style: { fontSize: "0.8rem" } }, e.time + " · " + e.room)),
    e.tone ? React.createElement("span", { className: "chip chip-" + e.tone }, e.label) : React.createElement("span", { className: "chip" }, e.label));

  /* ── ORARIO ───────────────────────────────────────────────────────────── */
  function Orario() {
    const days = ["Lun", "Mar", "Mer", "Gio", "Ven"];
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const ROW = 56;
    return React.createElement(Page, { title: "Orario", sub: "Settimana corrente · 9–13 giugno" },
      React.createElement(Reveal, { className: "glass", style: { padding: "1.2rem", overflowX: "auto" } },
        React.createElement("div", { style: { minWidth: 680 } },
          /* header row */
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "3.2rem repeat(5, 1fr)", marginBottom: "0.4rem" } },
            React.createElement("div", null),
            days.map((d) => React.createElement("div", { key: d, style: { textAlign: "center", fontWeight: 600, fontSize: "0.85rem", paddingBottom: "0.4rem" } }, d))),
          /* grid body */
          React.createElement("div", { style: { position: "relative", display: "grid", gridTemplateColumns: "3.2rem repeat(5, 1fr)" } },
            /* hour gutter */
            React.createElement("div", null, hours.slice(0, -1).map((h) =>
              React.createElement("div", { key: h, className: "font-num faint", style: { height: ROW, fontSize: "0.72rem", textAlign: "right", paddingRight: "0.5rem", transform: "translateY(-6px)" } }, h + ":00"))),
            /* 5 day columns */
            days.map((d, di) => React.createElement("div", { key: d, style: { position: "relative", borderLeft: "1px solid var(--hairline)" } },
              hours.slice(0, -1).map((h) => React.createElement("div", { key: h, style: { height: ROW, borderBottom: "1px solid var(--hairline)" } })),
              LESSONS.filter((l) => l.day === di).map((l, i) => {
                const top = (l.start - 8) * ROW;
                const h = (l.end - l.start) * ROW;
                const hue = COURSE_HUE[l.c];
                return React.createElement("div", { key: i, className: "lift", style: {
                  position: "absolute", top: top + 2, left: 3, right: 3, height: h - 4,
                  borderRadius: 10, padding: "0.45rem 0.55rem", overflow: "hidden",
                  background: "color-mix(in oklch, oklch(0.6 0.2 " + hue + ") 22%, var(--bg-2))",
                  borderLeft: "3px solid oklch(0.68 0.2 " + hue + ")", cursor: "pointer",
                } },
                  React.createElement("div", { style: { fontWeight: 600, fontSize: "0.78rem", lineHeight: 1.2 } }, l.name),
                  React.createElement("div", { className: "faint font-num", style: { fontSize: "0.68rem", marginTop: "0.15rem" } }, l.start + ":00 · " + l.room));
              })))))));
  }

  /* ── APPELLI ──────────────────────────────────────────────────────────── */
  function Appelli() {
    return React.createElement(Page, { title: "Appelli", sub: "Sessione estiva 2026 · 4 appelli tracciati",
      action: React.createElement("button", { className: "btn btn-primary", style: { padding: "0.6rem 1.1rem", fontSize: "0.85rem" } }, React.createElement(I.Plus, { size: 16 }), "Aggiungi") },
      React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" } },
        EXAMS.map((e, i) => React.createElement(Reveal, { key: e.name, delay: i * 0.06, className: "glass lift", style: { padding: "1.4rem", display: "flex", flexDirection: "column", gap: "1rem" } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.6rem" } },
            React.createElement("h3", { style: { fontSize: "1.05rem", fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: 0 } }, e.name),
            e.tone ? React.createElement("span", { className: "chip chip-" + e.tone }, e.label) : React.createElement("span", { className: "chip" }, e.label)),
          React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "0.5rem" } },
            React.createElement("span", { className: "font-num grad-text", style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.4rem", lineHeight: 1 } }, e.date.split(" ")[0]),
            React.createElement("span", { className: "muted", style: { fontWeight: 600 } }, e.date.split(" ")[1])),
          React.createElement("div", { className: "faint font-num", style: { display: "flex", gap: "1rem", fontSize: "0.85rem" } },
            React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.3rem" } }, React.createElement(I.Timer, { size: 14 }), e.time),
            React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.3rem" } }, React.createElement(I.MapPin, { size: 14 }), e.room)),
          React.createElement("div", { style: { height: 6, borderRadius: 99, background: "var(--hairline)", overflow: "hidden" } },
            React.createElement("div", { style: { height: "100%", width: Math.max(8, 100 - e.days * 2.5) + "%", background: e.tone === "danger" ? "var(--danger)" : "linear-gradient(90deg, var(--signal), var(--signal-2))" } })),
          React.createElement("div", { className: "faint", style: { fontSize: "0.78rem" } }, "tra " + e.days + " giorni")))));
  }

  /* ── LIBRETTO ─────────────────────────────────────────────────────────── */
  function Libretto() {
    const acquired = GRADES.reduce((s, g) => s + g.cfu, 0);
    return React.createElement(Page, { title: "Libretto", sub: GRADES.length + " esami verbalizzati · importati da Delphi",
      action: React.createElement("button", { className: "btn", style: { padding: "0.6rem 1.1rem", fontSize: "0.85rem" } }, React.createElement(I.FileText, { size: 15 }), "Importa da PDF Delphi") },
      React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "1rem" } },
        React.createElement(Card, { style: { textAlign: "center" } }, React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)" } }, "Media ponderata"), React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.6rem" }, className: "grad-text font-num" }, React.createElement(CountUp, { to: 27.4, decimals: 1 }))),
        React.createElement(Card, { style: { textAlign: "center" } }, React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)" } }, "Base di laurea"), React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.6rem" }, className: "font-num" }, React.createElement(CountUp, { to: 100.5, decimals: 1 }), React.createElement("span", { className: "muted", style: { fontSize: "1rem" } }, "/110"))),
        React.createElement(Card, { style: { textAlign: "center" } }, React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)" } }, "CFU acquisiti"), React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.6rem" }, className: "font-num" }, React.createElement(CountUp, { to: acquired }), React.createElement("span", { className: "muted", style: { fontSize: "1rem" } }, "/180")))),
      React.createElement(Reveal, { className: "glass", style: { padding: "0.4rem 0", overflow: "hidden" } },
        React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } },
          React.createElement("thead", null, React.createElement("tr", { className: "eyebrow", style: { textAlign: "left" } },
            React.createElement("th", { style: thStyle }, "Insegnamento"),
            React.createElement("th", { style: { ...thStyle, textAlign: "center" } }, "Voto"),
            React.createElement("th", { style: { ...thStyle, textAlign: "right" } }, "CFU"))),
          React.createElement("tbody", null, GRADES.map((g, i) => React.createElement("tr", { key: g.name, style: { borderTop: "1px solid var(--hairline)" } },
            React.createElement("td", { style: tdStyle }, g.name),
            React.createElement("td", { style: { ...tdStyle, textAlign: "center" } },
              React.createElement("span", { className: "chip " + (g.grade.startsWith("30") ? "chip-ok" : g.grade >= "28" ? "chip-signal" : ""), style: { fontFamily: "var(--font-display)", fontWeight: 700 } }, g.grade)),
            React.createElement("td", { className: "font-num muted", style: { ...tdStyle, textAlign: "right" } }, g.cfu)))))));
  }

  /* ── NOTE ─────────────────────────────────────────────────────────────── */
  function Note() {
    return React.createElement(Page, { title: "Note", sub: "Appunti organizzati per materia",
      action: React.createElement("button", { className: "btn btn-primary", style: { padding: "0.6rem 1.1rem", fontSize: "0.85rem" } }, React.createElement(I.Plus, { size: 16 }), "Nuova nota") },
      React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" } },
        NOTES.map((n, i) => React.createElement(Reveal, { key: n.title, delay: i * 0.06, as: "button", className: "glass lift", style: { padding: "1.4rem", textAlign: "left", color: "inherit", display: "flex", flexDirection: "column", gap: "0.7rem", minHeight: 150 } },
          React.createElement("span", { className: "chip chip-signal", style: { alignSelf: "flex-start" } }, n.subj),
          React.createElement("h3", { style: { fontSize: "1.05rem", fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: 0, lineHeight: 1.3 } }, n.title),
          React.createElement("div", { className: "faint font-num", style: { fontSize: "0.78rem", marginTop: "auto", display: "flex", justifyContent: "space-between" } },
            React.createElement("span", null, n.date), React.createElement("span", null, n.words + " parole"))))));
  }

  /* shared inline styles */
  const chipIcon = { width: 40, height: 40, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" };
  const bigNum = { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", lineHeight: 1 };
  const tiny = { fontSize: "0.76rem" };
  const thStyle = { padding: "0.7rem 1.4rem", fontSize: "0.72rem", color: "var(--ink-faint)" };
  const tdStyle = { padding: "0.8rem 1.4rem" };

  window.Screens = { Cruscotto, Orario, Appelli, Libretto, Note };
})();
