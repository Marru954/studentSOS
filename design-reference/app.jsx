/* App shell: routing, theme persistence. window.App */
(function () {
  const { useState, useEffect } = React;
  const { Atmosphere, Nav } = window.UI;

  function App() {
    const [route, setRoute] = useState("home");
    const [theme, setTheme] = useState(() => localStorage.getItem("sos-theme") || "dark");

    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("sos-theme", theme);
    }, [theme]);

    // Arm motion (only when allowed) so the un-armed base state stays visible.
    useEffect(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("anim-ready");
      }
    }, []);

    // Safety net: whatever happens to IntersectionObserver / throttled tabs,
    // reveal everything within a few seconds so content is never stuck hidden.
    useEffect(() => {
      const t = setTimeout(() => {
        document.querySelectorAll(".reveal").forEach((el) => {
          el.classList.add("in");
          el.style.transition = "none";
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        document.querySelectorAll(".hero-fade").forEach((el) => { el.style.opacity = "1"; });
      }, 2600);
      return () => clearTimeout(t);
    }, [route]);

    const go = (r) => {
      setRoute(r);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    let screen;
    if (route === "home") screen = React.createElement(window.Landing, { go });
    else if (route === "cruscotto") screen = React.createElement(window.Screens.Cruscotto, { go });
    else if (route === "orario") screen = React.createElement(window.Screens.Orario);
    else if (route === "appelli") screen = React.createElement(window.Screens.Appelli);
    else if (route === "libretto") screen = React.createElement(window.Screens.Libretto);
    else if (route === "note") screen = React.createElement(window.Screens.Note);
    else if (route === "focus") screen = React.createElement(window.Focus);

    return React.createElement(React.Fragment, null,
      React.createElement(Atmosphere),
      React.createElement(Nav, { route: route === "home" ? null : route, go, theme, onToggle: toggle }),
      React.createElement("div", { key: route, className: "route-enter" }, screen));
  }

  window.App = App;
})();
