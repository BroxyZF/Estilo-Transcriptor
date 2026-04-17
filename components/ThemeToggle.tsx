"use client";

import { useEffect, useState } from "react";

/**
 * Alterna entre tema claro y oscuro. La preferencia se guarda en
 * localStorage bajo la clave 'srh-theme'. El script antiflash del
 * layout ya la lee al primer render.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("srh-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };

  // Primer render: evita parpadeo mostrando placeholder neutro
  if (dark === null) {
    return (
      <button
        aria-label="Cambiar tema"
        className="h-9 w-9 rounded-full border border-rule opacity-0"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="group h-9 w-9 rounded-full border border-rule flex items-center justify-center transition-colors hover:border-gold hover:text-gold"
    >
      {dark ? (
        // Sol estilizado (manuscrito) — se muestra cuando estamos en oscuro
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
        </svg>
      ) : (
        // Luna creciente — se muestra cuando estamos en claro
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
