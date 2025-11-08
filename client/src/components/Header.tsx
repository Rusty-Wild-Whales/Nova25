import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/feed", label: "Policy Feed" },
  { to: "/profile", label: "Profile" }
];

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const stored = localStorage.getItem("civiclens-theme");
    if (stored) {
      return stored === "dark";
    }
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
    <header className="bg-primary text-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="font-semibold tracking-wide">
          CivicLens
        </NavLink>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-wide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-accent ${isActive ? "text-accent" : "text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="rounded-full border border-white/40 px-3 py-1 text-xs"
            aria-pressed={darkMode}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? "Light" : "Dark"} mode
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
