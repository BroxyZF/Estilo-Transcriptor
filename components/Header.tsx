import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-rule"
      style={{ backgroundColor: "color-mix(in oklab, var(--paper) 82%, transparent)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logotipo: cirílico · latino */}
        <Link
          href="/"
          className="group flex items-center gap-3 font-display text-lg tracking-tight"
          aria-label="Inicio — Norma SRH"
        >
          <span className="text-ink">СРХ</span>
          <span aria-hidden="true" className="text-gold text-xs">·</span>
          <span className="text-ink">SRH</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className="hidden sm:inline text-sm smallcaps text-muted hover:text-ink transition-colors"
          >
            Transcriptor
          </Link>
          <Link
            href="/norma"
            className="text-sm smallcaps text-muted hover:text-ink transition-colors"
          >
            La Norma
          </Link>
          <span className="hidden sm:inline h-4 w-px bg-rule mx-1" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
