"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  comprobarSalud,
  transcribir,
  type EstadoMotor,
  type RespuestaTranscripcion,
} from "@/lib/api";
import EstadoMotorPill from "./EstadoMotorPill";

// ────────────────────────────────────────────────────────────────────────────
// Ejemplos clásicos — elegidos para mostrar las reglas distintivas de la Norma
// ────────────────────────────────────────────────────────────────────────────
const EJEMPLOS: { cirílico: string; nota: string }[] = [
  { cirílico: "Ленин",            nota: "iotación tras consonante" },
  { cirílico: "Горбачёв",         nota: "arbitraje de la Ё" },
  { cirílico: "Пётр",             nota: "diptongación ie" },
  { cirílico: "Санкт-Петербург",  nota: "asimilación nasal" },
  { cirílico: "Достоевский",      nota: "colapso ИЙ / ЫЙ" },
  { cirílico: "Анна",             nota: "colapso de dobles" },
  { cirílico: "Евгений",          nota: "velar protegida" },
  { cirílico: "Маяковский",       nota: "iotada tras vocal" },
];

export default function Transcriber() {
  const [texto, setTexto] = useState<string>("Горбачёв");
  const [colapsar, setColapsar] = useState<boolean>(true);
  const [resultado, setResultado] = useState<RespuestaTranscripcion | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoMotor>("comprobando");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Health-check al montar + reintentos suaves si está despertando ──────
  useEffect(() => {
    let cancel = false;
    let intentos = 0;

    const ciclo = async () => {
      const salud = await comprobarSalud(10000);
      if (cancel) return;

      if (salud?.estado === "operativo") {
        setEstado("operativo");
        return;
      }
      intentos += 1;
      if (intentos < 6) {
        setEstado("despertando");
        setTimeout(ciclo, 10000);
      } else {
        setEstado("offline");
      }
    };

    ciclo();
    return () => {
      cancel = true;
    };
  }, []);

  // ── Contador editorial (palabras y caracteres) ──────────────────────────
  const stats = useMemo(() => {
    const chars = texto.length;
    const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
    return { chars, palabras };
  }, [texto]);

  const tieneCirilico = useMemo(
    () => /[\u0400-\u04FF]/.test(texto),
    [texto]
  );

  // ── Acción principal ────────────────────────────────────────────────────
  const ejecutar = useCallback(async () => {
    if (!texto.trim() || !tieneCirilico || cargando) return;
    setCargando(true);
    setError(null);

    try {
      const r = await transcribir({
        texto,
        colapsar_consonantes: colapsar,
      });
      setResultado(r);
      setEstado("operativo");
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.code === "AWAKENING") {
        setEstado("despertando");
        setError("El motor está despertando. Espera unos segundos y vuelve a intentarlo.");
      } else {
        setError(e.message || "Error de conexión con el motor.");
      }
    } finally {
      setCargando(false);
    }
  }, [texto, colapsar, cargando, tieneCirilico]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      ejecutar();
    }
  };

  return (
    <section className="relative">
      {/* ═══ Barra superior: estado del motor + contador ═══════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-muted">
        <EstadoMotorPill estado={estado} />
        <span className="smallcaps oldstyle-nums tabular-nums">
          {stats.palabras} palabra{stats.palabras === 1 ? "" : "s"} · {stats.chars} car.
        </span>
      </div>

      {/* ═══ Cuerpo: dos columnas con filete vertical dorado ═══════════════ */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0">
        {/* filete vertical dorado — solo en desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-px flex-col items-center"
        >
          <div className="flex-1 w-px bg-rule" />
          <span className="my-3 text-gold text-xs tracking-widest select-none">·</span>
          <div className="flex-1 w-px bg-rule" />
        </div>

        {/* ── Columna izquierda: entrada en ruso ── */}
        <div className="lg:pr-12">
          <label
            htmlFor="entrada"
            className="flex items-baseline justify-between mb-3"
          >
            <span className="smallcaps text-muted text-xs">
              Texto original · кириллица
            </span>
            {texto && (
              <button
                onClick={() => { setTexto(""); setResultado(null); setError(null); inputRef.current?.focus(); }}
                className="text-xs smallcaps text-muted hover:text-rubric transition-colors"
              >
                Limpiar
              </button>
            )}
          </label>

          <textarea
            ref={inputRef}
            id="entrada"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Борис Пастернак, Доктор Живаго…"
            rows={5}
            spellCheck={false}
            lang="ru"
            className="w-full resize-none bg-transparent border-0 border-t border-b border-rule py-4 font-body text-2xl sm:text-3xl leading-snug text-ink placeholder:text-[color:var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-gold transition-colors"
          />

          {/* Opciones filológicas */}
          <div className="mt-5 flex items-center justify-between">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
              <span className="relative inline-flex h-5 w-9 items-center">
                <input
                  type="checkbox"
                  checked={colapsar}
                  onChange={(e) => setColapsar(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full border border-rule bg-paper-sunk transition-colors peer-checked:bg-ink peer-checked:border-ink" />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-paper shadow-sm transition-transform peer-checked:translate-x-4 peer-checked:bg-gold" />
              </span>
              <span className="text-xs smallcaps text-muted group-hover:text-ink transition-colors">
                Colapsar dobles
              </span>
            </label>

            <span className="text-xs text-muted italic">
              <kbd className="font-mono text-[10px] bg-paper-sunk px-1.5 py-0.5 rounded border border-rule">⌘ / Ctrl + ↵</kbd>
            </span>
          </div>
        </div>

        {/* ── Columna derecha: salida en español ── */}
        <div className="lg:pl-12">
          <div className="flex items-baseline justify-between mb-3">
            <span className="smallcaps text-muted text-xs">
              Transcripción · Norma SRH
            </span>
            {resultado && !cargando && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resultado.resultado).catch(() => {});
                }}
                className="text-xs smallcaps text-muted hover:text-gold transition-colors"
                title="Copiar al portapapeles"
              >
                Copiar
              </button>
            )}
          </div>

          <div className="min-h-[8rem] border-t border-b border-rule py-4 flex items-start">
            <AnimatePresence mode="wait">
              {cargando && (
                <motion.div
                  key="cargando"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-muted italic text-xl"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span>componiendo…</span>
                </motion.div>
              )}
              {!cargando && resultado && (
                <motion.p
                  key={resultado.resultado}
                  initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.55, ease: [0.2, 0.6, 0.2, 1] }}
                  className="font-body text-2xl sm:text-3xl leading-snug text-ink break-words"
                  lang="es"
                >
                  {resultado.resultado}
                </motion.p>
              )}
              {!cargando && !resultado && !error && (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted italic text-xl"
                >
                  La transcripción aparecerá aquí.
                </motion.p>
              )}
              {!cargando && error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rubric text-base leading-snug"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Marginalia: datos de la última transcripción */}
          <div className="mt-5 min-h-[1.25rem] text-xs smallcaps text-muted tabular-nums">
            {resultado && !cargando ? (
              <span className="inline-flex items-center gap-4">
                <span>{resultado.ms} ms</span>
                <span className="text-rule">·</span>
                <span>{resultado.nlp_activo ? "prosodia neuronal" : "sin PLN"}</span>
              </span>
            ) : (
              <span className="opacity-0">—</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Botón de acción principal ═══════════════════════════════════════ */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={ejecutar}
          disabled={cargando || !tieneCirilico}
          className="group relative font-display text-lg tracking-tight px-10 py-3 border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink disabled:cursor-not-allowed"
        >
          <span className="relative">
            {cargando ? "Componiendo…" : "Transcribir"}
          </span>
        </button>
      </div>

      {/* ═══ Ejemplos clásicos ═══════════════════════════════════════════════ */}
      <div className="mt-20">
        <div className="filete mb-8" aria-hidden="true">
          <span className="filete-ornament">EJEMPLOS CLÁSICOS</span>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-4">
          {EJEMPLOS.map((ej) => (
            <li key={ej.cirílico}>
              <button
                onClick={() => {
                  setTexto(ej.cirílico);
                  setResultado(null);
                  setError(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => inputRef.current?.focus(), 200);
                }}
                className="group text-left px-4 py-2 border border-rule hover:border-gold hover:bg-paper-sunk transition-colors duration-150"
                title={ej.nota}
              >
                <span lang="ru" className="font-body text-base text-ink">
                  {ej.cirílico}
                </span>
                <span className="block text-[10px] smallcaps text-muted group-hover:text-gold mt-0.5">
                  {ej.nota}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
