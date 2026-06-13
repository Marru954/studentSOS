/* Shared UI: atmosphere, nav, theme toggle, scroll reveal, graphic primitives.
   Exposed on window.UI. */
(function () {
  const { useState, useEffect, useRef } = React;
  const I = window.Icons;

  /* Animated aurora + grain background, fixed behind everything. */
  function Atmosphere() {
    return React.createElement(React.Fragment, null,
      React.createElement("div", { className: "atmosphere", "aria-hidden": true },
        React.createElement("div", { className: "aurora a1" }),
        React.createElement("div", { className: "aurora a2" }),
        React.createElement("div", { className: "aurora a3" }),
      ),
      React.createElement("div", { className: "grain", "aria-hidden": true }),
    );
  }

  /* The Student🛟S wordmark. animated=true plays the SOS→StudentOS reveal. */
  function Wordmark({ animated = false, spin = false, style }) {
    const buoy = React.createElement(I.LifeBuoy, { cls: "buoy" + (spin ? " buoy-spin" : ""), sw: 2.4 });
    if (!animated) {
      return React.createElement("span", { className: "word", style, "aria-label": "StudentOS" },
        React.createElement("span", { "aria-hidden": true, style: { display: "inline-flex", alignItems: "center" } },
          "Student", buoy, "S"));
    }
    return React.createElement("span", { className: "word", style, "aria-label": "StudentOS" },
      React.createElement("span", { "aria-hidden": true }, "S"),
      React.createElement("span", { className: "mid", "aria-hidden": true },
        React.createElement("span", null, "tudent")),
      buoy,
      React.createElement("span", { "aria-hidden": true }, "S"),
    );
  }

  /* Scroll-reveal wrapper. children animate in once on intersection. */
  function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } }),
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);
    return React.createElement(as, {
      ref, className: "reveal " + className,
      style: { ...style, "--d": delay + "s" }, ...rest,
    }, children);
  }

  function ThemeToggle({ theme, onToggle }) {
    const dark = theme === "dark";
    return React.createElement("button", {
      className: "navlink", onClick: onToggle, title: dark ? "Tema chiaro" : "Tema scuro",
      "aria-label": dark ? "Passa al tema chiaro" : "Passa al tema scuro",
      style: { marginLeft: "auto", padding: "0.45rem" },
    }, React.createElement(dark ? I.Sun : I.Moon, { size: 18 }));
  }

  const NAV = [
    ["cruscotto", "Cruscotto", "Dashboard"],
    ["orario", "Orario", "CalendarDays"],
    ["appelli", "Appelli", "CalendarClock"],
    ["libretto", "Libretto", "GradCap"],
    ["note", "Note", "Notebook"],
    ["focus", "Focus", "Timer"],
  ];

  function Nav({ route, go, theme, onToggle }) {
    return React.createElement("div", { className: "navwrap" },
      React.createElement("nav", { className: "nav", "aria-label": "Principale" },
        React.createElement("button", {
          className: "navlink", onClick: () => go("home"),
          style: { fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-display)", fontSize: "0.95rem", paddingRight: "0.7rem" },
        }, React.createElement(Wordmark)),
        NAV.map(([id, label, icon]) =>
          React.createElement("button", {
            key: id, onClick: () => go(id),
            className: "navlink" + (route === id ? " active" : ""),
            "aria-current": route === id ? "page" : undefined,
          }, React.createElement(I[icon], { size: 16 }), label)),
        React.createElement(ThemeToggle, { theme, onToggle }),
      ));
  }

  /* Progress ring with animated fill. */
  function Ring({ value, size = 132, stroke = 11, children }) {
    const [shown, setShown] = useState(0);
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    useEffect(() => { const t = setTimeout(() => setShown(value), 120); return () => clearTimeout(t); }, [value]);
    return React.createElement("div", { style: { position: "relative", width: size, height: size, flex: "none" } },
      React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } },
        React.createElement("defs", null,
          React.createElement("linearGradient", { id: "ringg", x1: "0", y1: "0", x2: "1", y2: "1" },
            React.createElement("stop", { offset: "0%", stopColor: "var(--signal)" }),
            React.createElement("stop", { offset: "100%", stopColor: "var(--signal-2)" }))),
        React.createElement("circle", { className: "ring-track", cx: size / 2, cy: size / 2, r, fill: "none", strokeWidth: stroke }),
        React.createElement("circle", {
          className: "ring-fill", cx: size / 2, cy: size / 2, r, fill: "none",
          stroke: "url(#ringg)", strokeWidth: stroke,
          strokeDasharray: circ, strokeDashoffset: circ * (1 - shown),
        })),
      React.createElement("div", {
        style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" },
      }, children));
  }

  /* Sparkline that draws on mount. */
  function Sparkline({ values, width = 160, height = 46, stroke = 2.4 }) {
    const ref = useRef(null);
    const min = Math.min(...values), max = Math.max(...values);
    const span = max - min || 1;
    const pts = values.map((v, i) => [
      (i / (values.length - 1)) * width,
      height - ((v - min) / span) * (height - 6) - 3,
    ]);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    useEffect(() => {
      const path = ref.current; if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      requestAnimationFrame(() => { path.style.strokeDashoffset = 0; });
    }, []);
    return React.createElement("svg", { width, height, style: { overflow: "visible" } },
      React.createElement("defs", null,
        React.createElement("linearGradient", { id: "sparkg", x1: "0", y1: "0", x2: "1", y2: "0" },
          React.createElement("stop", { offset: "0%", stopColor: "var(--signal)" }),
          React.createElement("stop", { offset: "100%", stopColor: "var(--signal-3)" }))),
      React.createElement("path", {
        ref, d, fill: "none", stroke: "url(#sparkg)", strokeWidth: stroke,
        strokeLinecap: "round", strokeLinejoin: "round",
        style: { transition: "stroke-dashoffset 1.5s var(--ease)" },
      }),
      React.createElement("circle", { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: 3.5, fill: "var(--signal-3)" }),
    );
  }

  /* CountUp number animation. */
  function CountUp({ to, decimals = 0, duration = 1100, suffix = "" }) {
    const [n, setN] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      let raf, started = false, done = false;
      const run = () => {
        if (started) return; started = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(to * eased);
          if (p < 1) raf = requestAnimationFrame(tick); else done = true;
        };
        raf = requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) run(); }), { threshold: 0.4 });
      io.observe(el);
      // safety: if rAF/IO are frozen (background tab), still land on the value.
      const fb = setTimeout(() => { if (!done) { cancelAnimationFrame(raf); setN(to); } }, 2200);
      return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(fb); };
    }, [to]);
    const txt = decimals ? n.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : Math.round(n).toString();
    return React.createElement("span", { ref, className: "font-num" }, txt, suffix);
  }

  function Stat({ label, value, unit, hint, tone }) {
    return React.createElement("div", null,
      React.createElement("div", { className: "eyebrow", style: { color: "var(--ink-faint)", letterSpacing: "0.08em" } }, label),
      React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "0.3rem", marginTop: "0.35rem" } },
        React.createElement("span", { className: "font-num", style: { fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: tone || "var(--ink)" } }, value),
        unit && React.createElement("span", { className: "muted", style: { fontSize: "0.9rem", fontWeight: 600 } }, unit)),
      hint && React.createElement("div", { className: "faint", style: { fontSize: "0.78rem", marginTop: "0.15rem" } }, hint));
  }

  window.UI = { Atmosphere, Wordmark, Reveal, ThemeToggle, Nav, Ring, Sparkline, CountUp, Stat, NAV };
})();
