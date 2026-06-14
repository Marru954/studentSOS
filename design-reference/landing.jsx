/* Immersive landing. window.Landing */
(function () {
  const I = window.Icons;
  const { Reveal, Wordmark, Ring, Sparkline, CountUp } = window.UI;

  const FEATURES = [
    { icon: "GradCap", title: "Libretto digitale", desc: "Importa i voti da Delphi: media ponderata e CFU sempre aggiornati, in tempo reale." },
    { icon: "CalendarClock", title: "Appelli", desc: "Ogni data che conta in un posto solo. Avvisi sui conflitti, scadenze di prenotazione." },
    { icon: "Timer", title: "Focus", desc: "Timer Pomodoro e board obiettivi. Le sessioni diventano statistiche di costanza." },
  ];
  const STEPS = [
    { n: "01", title: "Scegli il tuo ateneo", text: "Cerca tra le università supportate e seleziona il tuo corso di laurea e anno. Nessun account richiesto." },
    { n: "02", title: "Seleziona i tuoi corsi", text: "Scegli le materie che frequenti. StudentOS sincronizza orario, appelli e avvisi solo per te." },
    { n: "03", title: "Tutto aggiornato", text: "Media ponderata, CFU acquisiti, prossimi appelli e orario settimanale — pronti e sempre offline." },
  ];
  const STATS = [
    { value: 50, unit: "atenei", desc: "università italiane già supportate" },
    { value: 100, unit: "% offline", desc: "nessun dato sui server — tutto sul tuo dispositivo" },
    { value: 5, unit: "min", desc: "per essere operativo dal primo avvio" },
  ];
  const ALL = [
    ["GradCap", "Libretto", "voti da Delphi o manuali"],
    ["CalendarClock", "Appelli", "date, avvisi e conflitti"],
    ["Notebook", "Note", "appunti per materia"],
    ["Timer", "Focus", "Pomodoro per studiare meglio"],
    ["Dashboard", "Cruscotto", "panoramica della carriera"],
    ["CalendarDays", "Orario", "la settimana a colpo d'occhio"],
  ];

  function HeroCard() {
    return React.createElement("div", { className: "glass float", style: {
      padding: "1.3rem", width: "min(380px, 86vw)", boxShadow: "var(--shadow)",
    } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" } },
        React.createElement("span", { className: "eyebrow" }, "Cruscotto"),
        React.createElement("span", { className: "chip chip-signal" }, React.createElement(I.Sparkles, { size: 13 }), "live")),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1.1rem" } },
        React.createElement(Ring, { value: 96 / 180, size: 104, stroke: 9 },
          React.createElement("span", { className: "font-num", style: { fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 } }, "96"),
          React.createElement("span", { className: "faint", style: { fontSize: "0.7rem" } }, "/180 CFU")),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)" } }, "Media ponderata"),
          React.createElement("div", { className: "font-num", style: { fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 700, lineHeight: 1 } }, "27,4"),
          React.createElement("div", { style: { marginTop: "0.4rem" } }, React.createElement(Sparkline, { values: [25, 26, 24, 27, 28, 27, 28], width: 150, height: 40 })))),
      React.createElement("div", { style: { marginTop: "1.1rem", paddingTop: "1rem", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: "0.6rem" } },
        React.createElement("span", { className: "chip chip-danger" }, "Calcolo prob. · 2g"),
        React.createElement("span", { className: "chip" }, "Basi di dati · 03/07")));
  }

  function Landing({ go }) {
    return React.createElement("main", { id: "contenuto", style: { position: "relative", zIndex: 2 } },
      /* HERO */
      React.createElement("section", { className: "wrap", style: { paddingTop: "3rem", paddingBottom: "4rem", textAlign: "center" } },
        React.createElement("div", { className: "chip chip-signal reveal in", style: { marginBottom: "1.6rem" } },
          React.createElement(I.LifeBuoy, { size: 14 }), "Il tuo sistema operativo universitario"),
        React.createElement("h1", { "aria-label": "StudentOS", style: {
          fontSize: "clamp(3.2rem, 13vw, 9rem)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 auto",
        } }, React.createElement(Wordmark, { animated: true, spin: true })),
        React.createElement("p", { className: "muted hero-fade", style: {
          maxWidth: "40ch", margin: "1.6rem auto 0", fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
        }, ref: (el) => { if (el && !matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.opacity = 0; el.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 1500, fill: "forwards", easing: "cubic-bezier(.22,1,.36,1)" }); } } },
          "Esami, appelli, libretto e carriera in un unico posto. ",
          React.createElement("span", { style: { color: "var(--ink)" } }, "Calmo, immersivo, tutto offline.")),
        React.createElement("div", { className: "hero-fade", style: { marginTop: "2.2rem", display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" },
          ref: (el) => { if (el && !matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.opacity = 0; el.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 2000, fill: "forwards", easing: "cubic-bezier(.22,1,.36,1)" }); } } },
          React.createElement("button", { className: "btn btn-primary", onClick: () => go("cruscotto") }, "Inizia ora", React.createElement(I.ArrowRight, { size: 17 })),
          React.createElement("button", { className: "btn", onClick: () => go("focus") }, "Prova il Focus")),
        React.createElement("div", { style: { marginTop: "3.5rem", display: "flex", justifyContent: "center" } },
          React.createElement(Reveal, { delay: 0.1 }, React.createElement(HeroCard)))),

      /* FEATURE CARDS */
      React.createElement("section", { className: "wrap", style: { paddingBlock: "3rem" } },
        React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" } },
          FEATURES.map((f, i) =>
            React.createElement(Reveal, { key: f.title, delay: i * 0.08, as: "button",
              className: "glass lift", onClick: () => go(f.title === "Libretto digitale" ? "libretto" : f.title.toLowerCase()),
              style: { padding: "1.6rem", textAlign: "left", color: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.9rem" } },
              React.createElement("span", { className: "grad-fill", style: { width: 46, height: 46, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" } },
                React.createElement(I[f.icon], { size: 22 })),
              React.createElement("h3", { style: { fontSize: "1.2rem" } }, f.title),
              React.createElement("p", { className: "muted", style: { fontSize: "0.92rem", margin: 0 } }, f.desc),
              React.createElement("span", { className: "eyebrow", style: { display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "auto" } }, "Apri", React.createElement(I.ArrowRight, { size: 13 }))))) ),

      /* COME FUNZIONA */
      React.createElement("section", { className: "wrap", style: { paddingBlock: "4rem" } },
        React.createElement(Reveal, { className: "eyebrow", as: "p", style: { textAlign: "center" } }, "Come funziona"),
        React.createElement(Reveal, { as: "h2", delay: 0.05, style: { textAlign: "center", fontSize: "clamp(2rem, 5vw, 3.2rem)", marginTop: "0.6rem", maxWidth: "16ch", marginInline: "auto" } },
          "Dal PDF di Delphi al ", React.createElement("span", { className: "grad-text" }, "libretto vivo"), " in tre passi."),
        React.createElement("div", { style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: "2.6rem" } },
          STEPS.map((s, i) =>
            React.createElement(Reveal, { key: s.n, delay: i * 0.1, className: "glass", style: { padding: "1.6rem" } },
              React.createElement("div", { className: "font-num grad-text", style: { fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 800, lineHeight: 1 } }, s.n),
              React.createElement("h3", { style: { fontSize: "1.15rem", marginTop: "0.9rem" } }, s.title),
              React.createElement("p", { className: "muted", style: { fontSize: "0.9rem", marginTop: "0.5rem" } }, s.text)))) ),

      /* STATS BAND */
      React.createElement("section", { style: { position: "relative", paddingBlock: "4rem" } },
        React.createElement("div", { className: "wrap", style: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" } },
          STATS.map((s, i) =>
            React.createElement(Reveal, { key: s.unit, delay: i * 0.1, className: "glass", style: { padding: "2rem", textAlign: "center" } },
              React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 } },
                React.createElement("span", { className: "grad-text", style: { fontSize: "clamp(3rem, 7vw, 4.5rem)" } },
                  s.unit === "% offline" ? React.createElement(CountUp, { to: 100 }) : React.createElement(CountUp, { to: s.value })),
                React.createElement("span", { className: "muted", style: { fontSize: "1.3rem", fontWeight: 700, marginLeft: "0.3rem" } }, s.unit === "% offline" ? "% offline" : s.unit)),
              React.createElement("p", { className: "muted", style: { fontSize: "0.9rem", marginTop: "0.7rem", maxWidth: "24ch", marginInline: "auto" } }, s.desc)))) ),

      /* TUTTO IN UN POSTO */
      React.createElement("section", { className: "wrap", style: { paddingBlock: "3rem" } },
        React.createElement(Reveal, { as: "h2", style: { textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.6rem)" } }, "Tutto in un posto"),
        React.createElement("div", { style: { display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: "2rem" } },
          ALL.map(([icon, title, desc], i) =>
            React.createElement(Reveal, { key: title, delay: (i % 3) * 0.07, className: "glass lift", style: { padding: "1.1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.9rem" } },
              React.createElement("span", { style: { width: 40, height: 40, borderRadius: 12, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--card-2)", border: "1px solid var(--hairline)", color: "var(--signal-2)" } },
                React.createElement(I[icon], { size: 19 })),
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: "0.95rem" } }, title),
                React.createElement("div", { className: "muted", style: { fontSize: "0.82rem" } }, desc))))) ),

      /* CTA */
      React.createElement("section", { className: "wrap", style: { paddingBlock: "4rem" } },
        React.createElement(Reveal, { className: "glass", style: { padding: "clamp(2rem, 6vw, 4rem)", textAlign: "center", position: "relative", overflow: "hidden" } },
          React.createElement("div", { "aria-hidden": true, style: { position: "absolute", inset: 0, background: "radial-gradient(60% 80% at 50% 0%, var(--glow-1), transparent 70%)", opacity: 0.5 } }),
          React.createElement("div", { style: { position: "relative" } },
            React.createElement("h2", { style: { fontSize: "clamp(2rem, 5vw, 3.4rem)", maxWidth: "18ch", marginInline: "auto" } }, "Prendi il largo senza affogare negli appelli."),
            React.createElement("p", { className: "muted", style: { marginTop: "1rem", maxWidth: "36ch", marginInline: "auto" } }, "Nessun account, nessun server. Apri il cruscotto e parti."),
            React.createElement("button", { className: "btn btn-primary", style: { marginTop: "1.8rem" }, onClick: () => go("cruscotto") }, "Apri il Cruscotto", React.createElement(I.ArrowRight, { size: 17 }))))),

      React.createElement("footer", { style: { borderTop: "1px solid var(--hairline)", marginTop: "1rem" } },
        React.createElement("div", { className: "wrap", style: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", paddingBlock: "2rem" } },
          React.createElement("span", { style: { fontWeight: 700, fontFamily: "var(--font-display)" } }, React.createElement(Wordmark)),
          React.createElement("span", { className: "faint", style: { fontSize: "0.8rem" } }, "Dati 100% locali · nessun account richiesto"))),
    );
  }

  window.Landing = Landing;
})();
