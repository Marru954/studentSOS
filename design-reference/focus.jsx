/* Focus screen — interactive Pomodoro + task board + stats. window.Focus */
(function () {
  const { useState, useEffect, useRef } = React;
  const I = window.Icons;
  const { Reveal } = window.UI;

  const MODES = {
    focus: { label: "Focus", mins: 25, hue: "var(--signal)" },
    short: { label: "Pausa breve", mins: 5, hue: "var(--signal-3)" },
    long: { label: "Pausa lunga", mins: 15, hue: "var(--signal-2)" },
  };

  function Focus() {
    const [mode, setMode] = useState("focus");
    const [left, setLeft] = useState(MODES.focus.mins * 60);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(2);
    const ref = useRef(null);

    useEffect(() => {
      if (!running) return;
      ref.current = setInterval(() => {
        setLeft((s) => {
          if (s <= 1) {
            clearInterval(ref.current);
            setRunning(false);
            if (mode === "focus") setDone((d) => d + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(ref.current);
    }, [running, mode]);

    const switchMode = (m) => { setMode(m); setLeft(MODES[m].mins * 60); setRunning(false); };
    const total = MODES[mode].mins * 60;
    const progress = 1 - left / total;
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");

    const size = 320, stroke = 14, r = (size - stroke) / 2, circ = 2 * Math.PI * r;

    return React.createElement("main", { id: "contenuto", className: "wrap", style: { position: "relative", zIndex: 2, paddingTop: "1.5rem", paddingBottom: "4rem" } },
      React.createElement(Reveal, { className: "in", style: { marginBottom: "1.6rem" } },
        React.createElement("h1", { style: { fontSize: "clamp(2rem, 5vw, 3rem)" } }, "Focus"),
        React.createElement("p", { className: "muted", style: { marginTop: "0.4rem" } }, "Studia in sessioni. La costanza diventa una statistica.")),

      React.createElement("div", { style: { display: "grid", gap: "1.4rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" } },
        /* TIMER */
        React.createElement(Reveal, { className: "glass", style: { padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.6rem", position: "relative", overflow: "hidden" } },
          React.createElement("div", { "aria-hidden": true, style: { position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 50% 30%, " + MODES[mode].hue + ", transparent 70%)", opacity: running ? 0.22 : 0.1, transition: "opacity 0.6s" } }),
          React.createElement("div", { style: { position: "relative", display: "flex", gap: "0.4rem", padding: "0.3rem", borderRadius: 999, background: "var(--card)", border: "1px solid var(--hairline)" } },
            Object.entries(MODES).map(([k, m]) => React.createElement("button", {
              key: k, onClick: () => switchMode(k),
              className: "navlink" + (mode === k ? " active" : ""), style: { fontSize: "0.8rem" },
            }, m.label))),
          React.createElement("div", { style: { position: "relative", width: size, height: size, maxWidth: "78vw" } },
            React.createElement("svg", { width: "100%", viewBox: "0 0 " + size + " " + size, style: { transform: "rotate(-90deg)" } },
              React.createElement("defs", null, React.createElement("linearGradient", { id: "focusg", x1: "0", y1: "0", x2: "1", y2: "1" },
                React.createElement("stop", { offset: "0%", stopColor: "var(--signal)" }), React.createElement("stop", { offset: "100%", stopColor: "var(--signal-2)" }))),
              React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--hairline-strong)", strokeWidth: stroke }),
              React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "url(#focusg)", strokeWidth: stroke, strokeLinecap: "round",
                strokeDasharray: circ, strokeDashoffset: circ * (1 - progress), style: { transition: "stroke-dashoffset 0.9s linear" } })),
            React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
              React.createElement("div", { className: "font-num", style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 12vw, 4.6rem)", lineHeight: 1, letterSpacing: "-0.03em" } }, mm + ":" + ss),
              React.createElement("div", { className: "eyebrow", style: { marginTop: "0.4rem" } }, MODES[mode].label))),
          React.createElement("div", { style: { position: "relative", display: "flex", gap: "0.8rem", alignItems: "center" } },
            React.createElement("button", { className: "btn btn-primary", style: { padding: "0.9rem 2rem", fontSize: "1rem" }, onClick: () => setRunning((r) => !r) },
              running ? React.createElement(I.Pause, { size: 18 }) : React.createElement(I.Play, { size: 18 }), running ? "Pausa" : "Avvia"),
            React.createElement("button", { className: "btn", style: { padding: "0.9rem" }, onClick: () => { switchMode(mode); }, "aria-label": "Reimposta" }, React.createElement(I.Reset, { size: 18 })))),

        /* RIGHT COLUMN: stats + tasks */
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "1.4rem" } },
          React.createElement(StatsRow, { done }),
          React.createElement(TaskBoard))));
  }

  function StatsRow({ done }) {
    const cells = [
      { v: done, l: "Pomodori oggi", ic: "Flame" },
      { v: "2h 05m", l: "Tempo focus", ic: "Timer" },
      { v: "6", l: "Giorni di fila", ic: "Trend" },
    ];
    return React.createElement(Reveal, { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem" } },
      cells.map((c) => React.createElement("div", { key: c.l, className: "glass", style: { padding: "1.1rem", textAlign: "center" } },
        React.createElement("span", { style: { color: "var(--signal-2)", display: "inline-flex" } }, React.createElement(I[c.ic], { size: 18 })),
        React.createElement("div", { className: "font-num", style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.7rem", marginTop: "0.3rem" } }, c.v),
        React.createElement("div", { className: "faint", style: { fontSize: "0.74rem" } }, c.l))));
  }

  function TaskBoard() {
    const [tasks, setTasks] = useState([
      { t: "Ripasso normalizzazione BD", done: true },
      { t: "Esercizi calcolo probabilità", done: false },
      { t: "Riassunto modello OSI", done: false },
      { t: "Past paper Sistemi operativi", done: false },
    ]);
    const [val, setVal] = useState("");
    const toggle = (i) => setTasks((ts) => ts.map((t, j) => j === i ? { ...t, done: !t.done } : t));
    const add = (e) => { e.preventDefault(); if (!val.trim()) return; setTasks((ts) => [...ts, { t: val.trim(), done: false }]); setVal(""); };
    const left = tasks.filter((t) => !t.done).length;
    return React.createElement(Reveal, { className: "glass", style: { padding: "1.4rem" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" } },
        React.createElement("h3", { style: { fontSize: "0.95rem", fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: 0 } }, "Obiettivi di studio"),
        React.createElement("span", { className: "chip" }, left + " da fare")),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" } },
        tasks.map((t, i) => React.createElement("button", { key: i, onClick: () => toggle(i),
          style: { display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.6rem 0.7rem", borderRadius: 12, border: "1px solid var(--hairline)", background: t.done ? "var(--card)" : "var(--card-2)", color: "inherit", textAlign: "left", transition: "all 0.2s" } },
          React.createElement("span", { style: { width: 22, height: 22, flex: "none", borderRadius: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", border: t.done ? "none" : "1.5px solid var(--hairline-strong)", background: t.done ? "linear-gradient(125deg, var(--signal), var(--signal-2))" : "transparent", color: "#fff" } },
            t.done && React.createElement(I.Check, { size: 14, sw: 3 })),
          React.createElement("span", { style: { fontSize: "0.9rem", textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--ink-faint)" : "var(--ink)" } }, t.t)))),
      React.createElement("form", { onSubmit: add, style: { display: "flex", gap: "0.5rem", marginTop: "0.8rem" } },
        React.createElement("input", { value: val, onChange: (e) => setVal(e.target.value), placeholder: "Aggiungi un obiettivo…",
          style: { flex: 1, padding: "0.6rem 0.8rem", borderRadius: 12, border: "1px solid var(--hairline)", background: "var(--card)", color: "var(--ink)", fontSize: "0.88rem", fontFamily: "inherit", outline: "none" } }),
        React.createElement("button", { type: "submit", className: "btn btn-primary", style: { padding: "0.6rem 0.9rem" }, "aria-label": "Aggiungi" }, React.createElement(I.Plus, { size: 16 }))));
  }

  window.Focus = Focus;
})();
