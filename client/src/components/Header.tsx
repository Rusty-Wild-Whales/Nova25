import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/feed", label: "Policy Feed" },
  { to: "/profile", label: "Profile" }
];

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("civiclens-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("civiclens-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("civiclens-theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-lg font-semibold text-primary dark:text-white">
          CivicLens
        </NavLink>
        <nav className="flex items-center gap-4 text-sm font-medium text-primary dark:text-slate-200">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-primary dark:text-slate-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs uppercase tracking-wide text-slate-600 transition hover:border-primary dark:border-white/30 dark:text-white"
            aria-pressed={darkMode}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
