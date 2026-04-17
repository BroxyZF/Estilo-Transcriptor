"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  comprobarSalud,
  transcribir,
  type EstadoMotor,
  type RespuestaTranscripcion,
} from "@/lib/api";
import EstadoMotorPill from "./EstadoMotorPill";

// ────────────────────────────────────────────────────────────────────────────
// Ejemplos clásicos — breves, sin apostillas
// ────────────────────────────────────────────────────────────────────────────
const EJEMPLOS: string[] = [
  "Ленин",
  "Горбачёв",
  "Пётр",
  "Санкт-Петербург",
  "Достоевский",
  "Анна",
  "Евгений",
  "Маяковский",
];

const LIMITE_CARACTERES = 5000;

/**
 * Escala tipográfica adaptativa: textos breves se muestran grandes;
 * los largos bajan de tamaño progresivamente para permanecer legibles.
 */
function claseTipografica(longitud: number): string {
  if (longitud <= 24) return "text-2xl sm:text-3xl leading-snug";
  if (longitud <= 80) return "text-xl sm:text-2xl leading-snug";
  if (longitud <= 240) return "text-lg sm:text-xl leading-relaxed";
  return "text-base sm:text-lg leading-relaxed";
}

export default function Transcriber() {
  const [texto, setTexto] = useState<string>("Горбачёв");
  const [simplificar, setSimplificar] = useState<boolean>(true);
  const [usarPLN, setUsarPLN] = useState<boolean>(false); // apagado por defecto
  const [resultado, setResultado] = useState<RespuestaTranscripcion | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoMotor>("comprobando");
  const [copiado, setCopiado] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contenedorRef = useRef<HTMLElement>(null);

  // ── Health-check al montar, con reintentos suaves ───────────────────────
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

  // ── Auto-resize del textarea según contenido ────────────────────────────
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Máximo razonable para no comerse media pantalla con textos muy largos
    const maxPx = Math.min(window.innerHeight * 0.5, 520);
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`;
  }, [texto]);

  // ── Métricas y validación ───────────────────────────────────────────────
  const stats = useMemo(() => {
    const chars = texto.length;
    const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
    return { chars, palabras };
  }, [texto]);

  const tieneCirilico = useMemo(
    () => /[\u0400-\u04FF]/.test(texto),
    [texto]
  );

  const sobrepasa = stats.chars > LIMITE_CARACTERES;

  // ── Acción principal ────────────────────────────────────────────────────
  const ejecutar = useCallback(async () => {
    if (!texto.trim() || !tieneCirilico || cargando || sobrepasa) return;
    setCargando(true);
    setError(null);

    try {
      const r = await transcribir({
        texto,
        colapsar_consonantes: simplificar,
        usar_pln: usarPLN,
      });
      setResultado(r);
      setEstado("operativo");
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.code === "AWAKENING") {
        setEstado("despertando");
        setError("El motor está despertando. Inténtalo de nuevo en unos segundos.");
      } else {
        setError(e.message || "Error de conexión con el motor.");
      }
    } finally {
      setCargando(false);
    }
  }, [texto, simplificar, usarPLN, cargando, tieneCirilico, sobrepasa]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      ejecutar();
    }
  };

  // ── Clic en un ejemplo: rellenar y desplazarse suavemente al transcriptor
  //    (no al tope absoluto de la página).
  const onClickEjemplo = (ejemplo: string) => {
    setTexto(ejemplo);
    setResultado(null);
    setError(null);
    // Si el usuario estaba mirando los ejemplos (más abajo), lo llevamos a la
    // zona del transcriptor sin mover nada si ya estaba visible.
    contenedorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
  };

  const copiar = async () => {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resultado.resultado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* el botón simplemente no confirma */
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  const claseInput = claseTipografica(stats.chars);
  const claseOutput = claseTipografica(resultado?.resultado.length ?? 0);

  return (
    <section ref={contenedorRef} className="relative scroll-mt-20">
      {/* Barra superior: estado + contador */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-sm text-muted">
        <EstadoMotorPill estado={estado} />
        <span
          className={`smallcaps oldstyle-nums tabular-nums ${sobrepasa ? "text-rubric" : ""}`}
        >
          {stats.palabras} palabra{stats.palabras === 1 ? "" : "s"} · {stats.chars.toLocaleString("es-ES")} car.
          {sobrepasa && ` · excede ${LIMITE_CARACTERES.toLocaleString("es-ES")}`}
        </span>
      </div>

      {/* Cuerpo: dos columnas con filete vertical dorado */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0">
        {/* Filete vertical — solo desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-px flex-col items-center"
        >
          <div className="flex-1 w-px bg-rule" />
          <span className="my-3 text-gold text-xs tracking-widest select-none">·</span>
          <div className="flex-1 w-px bg-rule" />
        </div>

        {/* ── Entrada ── */}
        <div className="lg:pr-12">
          <label htmlFor="entrada" className="flex items-baseline justify-between mb-3">
            <span className="smallcaps text-muted text-sm">
              Texto original · кириллица
            </span>
            {texto && (
              <button
                onClick={() => {
                  setTexto("");
                  setResultado(null);
                  setError(null);
                  inputRef.current?.focus();
                }}
                className="text-sm smallcaps text-muted hover:text-rubric transition-colors"
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
            placeholder="Escribe o pega texto en cirílico…"
            rows={3}
            spellCheck={false}
            lang="ru"
            className={`w-full resize-none bg-transparent border-0 border-t border-b border-rule py-4 font-body text-ink placeholder:text-[color:var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-gold transition-colors duration-200 ${claseInput}`}
            style={{ minHeight: "5rem" }}
          />

          {/* Opciones */}
          <div className="mt-5 space-y-4">
            <Toggle
              checked={simplificar}
              onChange={setSimplificar}
              label="Simplificar dobles consonantes"
              hint="Анна → Ana, Россия → Rosía"
            />
            <Toggle
              checked={usarPLN}
              onChange={setUsarPLN}
              label="Acentuación neuronal"
              hint="Experimental. Puede errar en formas declinadas."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <span className="text-xs text-muted italic">
              <kbd className="font-mono text-[10px] bg-paper-sunk px-1.5 py-0.5 rounded border border-rule">
                ⌘ / Ctrl + ↵
              </kbd>
            </span>
          </div>
        </div>

        {/* ── Salida ── */}
        <div className="lg:pl-12">
          <div className="flex items-baseline justify-between mb-3">
            <span className="smallcaps text-muted text-sm">
              Transcripción · Norma SRH
            </span>
            {resultado && !cargando && (
              <button
                onClick={copiar}
                className="text-sm smallcaps text-muted hover:text-gold transition-colors"
                title="Copiar al portapapeles"
              >
                {copiado ? "Copiado ✓" : "Copiar"}
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
                  className={`font-body text-ink break-words w-full ${claseOutput}`}
                  style={{ whiteSpace: "pre-wrap" }}
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

          {/* Metadata de la última transcripción */}
          <div className="mt-5 min-h-[1.25rem] text-sm smallcaps text-muted tabular-nums">
            {resultado && !cargando ? (
              <span className="inline-flex items-center gap-4">
                <span>{resultado.ms.toLocaleString("es-ES")} ms</span>
                <span className="text-rule">·</span>
                <span>{resultado.nlp_activo ? "con acentuación neuronal" : "sin acentuación neuronal"}</span>
              </span>
            ) : (
              <span className="opacity-0">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Botón principal */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={ejecutar}
          disabled={cargando || !tieneCirilico || sobrepasa}
          className="group relative font-display text-lg tracking-tight px-10 py-3 border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink disabled:cursor-not-allowed"
        >
          {cargando ? "Componiendo…" : "Transcribir"}
        </button>
      </div>

      {/* Ejemplos clásicos — sin apostillas */}
      <div className="mt-20">
        <div className="filete mb-8" aria-hidden="true">
          <span className="filete-ornament">EJEMPLOS</span>
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5">
          {EJEMPLOS.map((ej) => (
            <li key={ej}>
              <button
                onClick={() => onClickEjemplo(ej)}
                className="px-4 py-2 border border-rule hover:border-gold hover:bg-paper-sunk transition-colors duration-150"
              >
                <span lang="ru" className="font-body text-base text-ink">
                  {ej}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Toggle interno — diseño sobrio, sin emoji ni colores chillones
// ────────────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}

function Toggle({ checked, onChange, label, hint }: ToggleProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none group">
      <span className="relative inline-flex h-5 w-9 items-center flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-rule bg-paper-sunk transition-colors peer-checked:bg-ink peer-checked:border-ink" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-paper shadow-sm transition-transform peer-checked:translate-x-4 peer-checked:bg-gold" />
      </span>
      <span className="flex-1">
        <span className="block text-sm smallcaps text-ink group-hover:text-rubric transition-colors">
          {label}
        </span>
        {hint && (
          <span className="block text-[13px] italic text-muted mt-0.5 leading-snug">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
