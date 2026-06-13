/* Inline icon set — lucide-style stroke icons. Exposed on window.Icons. */
(function () {
  const S = ({ children, size = 24, fill = "none", sw = 1.8, cls = "", style }) =>
    React.createElement(
      "svg",
      {
        width: size, height: size, viewBox: "0 0 24 24", fill,
        stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round",
        strokeLinejoin: "round", className: cls, style, "aria-hidden": true,
      },
      children
    );
  const P = (d) => React.createElement("path", { d });
  const C = (cx, cy, r) => React.createElement("circle", { cx, cy, r });
  const L = (x1, y1, x2, y2) => React.createElement("line", { x1, y1, x2, y2 });

  const LifeBuoy = (p) => S({ ...p, children: [
    C(12, 12, 10), C(12, 12, 4),
    L(4.93, 4.93, 9.17, 9.17), L(14.83, 14.83, 19.07, 19.07),
    L(14.83, 9.17, 19.07, 4.93), L(14.83, 9.17, 18.36, 5.64), L(4.93, 19.07, 9.17, 14.83),
  ].map((e, i) => React.cloneElement(e, { key: i })) });

  const Dashboard = (p) => S({ ...p, children: [
    React.createElement("rect", { key: 0, x: 3, y: 3, width: 7, height: 9, rx: 1.5 }),
    React.createElement("rect", { key: 1, x: 14, y: 3, width: 7, height: 5, rx: 1.5 }),
    React.createElement("rect", { key: 2, x: 14, y: 12, width: 7, height: 9, rx: 1.5 }),
    React.createElement("rect", { key: 3, x: 3, y: 16, width: 7, height: 5, rx: 1.5 }),
  ] });

  const CalendarDays = (p) => S({ ...p, children: [
    React.createElement("rect", { key: 0, x: 3, y: 4, width: 18, height: 18, rx: 2 }),
    React.cloneElement(L(8, 2, 8, 6), { key: 1 }), React.cloneElement(L(16, 2, 16, 6), { key: 2 }),
    React.cloneElement(L(3, 10, 21, 10), { key: 3 }),
    React.cloneElement(P("M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"), { key: 4 }),
  ] });

  const CalendarClock = (p) => S({ ...p, children: [
    React.cloneElement(P("M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"), { key: 0 }),
    React.cloneElement(L(8, 2, 8, 6), { key: 1 }), React.cloneElement(L(16, 2, 16, 6), { key: 2 }),
    React.cloneElement(L(3, 10, 21, 10), { key: 3 }),
    React.cloneElement(C(18, 17, 4), { key: 4 }),
    React.cloneElement(P("M18 15.5v1.5l1 1"), { key: 5 }),
  ] });

  const GradCap = (p) => S({ ...p, children: [
    React.cloneElement(P("M22 10 12 5 2 10l10 5 10-5Z"), { key: 0 }),
    React.cloneElement(P("M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"), { key: 1 }),
    React.cloneElement(L(22, 10, 22, 16), { key: 2 }),
  ] });

  const Notebook = (p) => S({ ...p, children: [
    React.cloneElement(P("M11.5 15H7M14.5 11H7"), { key: 0 }),
    React.cloneElement(P("M16 3v18"), { key: 1 }),
    React.createElement("rect", { key: 2, x: 4, y: 3, width: 16, height: 18, rx: 2 }),
    React.cloneElement(P("M11.5 7H7"), { key: 3 }),
  ] });

  const Timer = (p) => S({ ...p, children: [
    React.cloneElement(L(10, 2, 14, 2), { key: 0 }),
    React.cloneElement(C(12, 14, 8), { key: 1 }),
    React.cloneElement(P("M12 10v4l2.5 1.5"), { key: 2 }),
    React.cloneElement(P("M17 4.5 19 6.5"), { key: 3 }),
  ] });

  const ArrowRight = (p) => S({ ...p, children: [
    React.cloneElement(L(5, 12, 19, 12), { key: 0 }), React.cloneElement(P("m12 5 7 7-7 7"), { key: 1 }),
  ] });
  const ArrowUpRight = (p) => S({ ...p, children: [
    React.cloneElement(P("M7 17 17 7"), { key: 0 }), React.cloneElement(P("M7 7h10v10"), { key: 1 }),
  ] });
  const Lock = (p) => S({ ...p, children: [
    React.createElement("rect", { key: 0, x: 4, y: 11, width: 16, height: 10, rx: 2 }),
    React.cloneElement(P("M8 11V7a4 4 0 0 1 8 0v4"), { key: 1 }),
  ] });
  const FileText = (p) => S({ ...p, children: [
    React.cloneElement(P("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"), { key: 0 }),
    React.cloneElement(P("M14 2v6h6"), { key: 1 }),
    React.cloneElement(P("M9 13h6M9 17h6"), { key: 2 }),
  ] });
  const Sun = (p) => S({ ...p, children: [
    React.cloneElement(C(12, 12, 4), { key: 0 }),
    React.cloneElement(P("M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"), { key: 1 }),
  ] });
  const Moon = (p) => S({ ...p, children: [
    React.cloneElement(P("M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"), { key: 0 }),
  ] });
  const Play = (p) => S({ ...p, fill: "currentColor", children: [
    React.cloneElement(P("M6 4.5v15l13-7.5z"), { key: 0 }),
  ] });
  const Pause = (p) => S({ ...p, children: [
    React.createElement("rect", { key: 0, x: 6, y: 4, width: 4, height: 16, rx: 1 }),
    React.createElement("rect", { key: 1, x: 14, y: 4, width: 4, height: 16, rx: 1 }),
  ] });
  const Reset = (p) => S({ ...p, children: [
    React.cloneElement(P("M3 12a9 9 0 1 0 3-6.7L3 8"), { key: 0 }),
    React.cloneElement(P("M3 4v4h4"), { key: 1 }),
  ] });
  const Plus = (p) => S({ ...p, children: [React.cloneElement(P("M12 5v14M5 12h14"), { key: 0 })] });
  const Check = (p) => S({ ...p, children: [React.cloneElement(P("M20 6 9 17l-5-5"), { key: 0 })] });
  const Bell = (p) => S({ ...p, children: [
    React.cloneElement(P("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"), { key: 0 }),
    React.cloneElement(P("M10.3 21a1.94 1.94 0 0 0 3.4 0"), { key: 1 }),
  ] });
  const Trend = (p) => S({ ...p, children: [
    React.cloneElement(P("M22 7 13.5 15.5 8.5 10.5 2 17"), { key: 0 }),
    React.cloneElement(P("M16 7h6v6"), { key: 1 }),
  ] });
  const Sparkles = (p) => S({ ...p, children: [
    React.cloneElement(P("M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"), { key: 0 }),
    React.cloneElement(P("M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8z"), { key: 1 }),
  ] });
  const MapPin = (p) => S({ ...p, children: [
    React.cloneElement(P("M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"), { key: 0 }),
    React.cloneElement(C(12, 10, 3), { key: 1 }),
  ] });
  const Flame = (p) => S({ ...p, children: [
    React.cloneElement(P("M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c1 1.5 1.5 3 0 5a5 5 0 1 1-7-7c2-2 3-4 4-7z"), { key: 0 }),
  ] });

  window.Icons = {
    LifeBuoy, Dashboard, CalendarDays, CalendarClock, GradCap, Notebook, Timer,
    ArrowRight, ArrowUpRight, Lock, FileText, Sun, Moon, Play, Pause, Reset,
    Plus, Check, Bell, Trend, Sparkles, MapPin, Flame,
  };
})();
