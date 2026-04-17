/**
 * Cliente del backend Transcriptor SRH.
 *
 * El backend se aloja en Hugging Face Spaces. En el plan gratuito, los
 * contenedores se duermen tras ~48 h de inactividad y la primera petición
 * tras dormir tarda 30-60 s en devolver respuesta. Este cliente diferencia
 * explícitamente los estados para que la UI los muestre con dignidad.
 */

export type EstadoMotor = "comprobando" | "operativo" | "despertando" | "offline";

export interface RespuestaTranscripcion {
  original: string;
  resultado: string;
  nlp_activo: boolean;
  ms: number;
}

export interface RespuestaSalud {
  estado: string;
  motor_nlp: boolean;
  uptime_s: number;
  version: string;
}

export interface OpcionesTranscripcion {
  texto: string;
  colapsar_consonantes?: boolean;
  y_extranjera?: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:7860";

export function getApiUrl(): string {
  return API_URL;
}

/** Health-check. Usa un timeout corto para no colgar la UI. */
export async function comprobarSalud(
  timeoutMs = 8000
): Promise<RespuestaSalud | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}/salud`, {
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as RespuestaSalud;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Transcribe un texto. Si la primera llamada falla con 503 (motor
 * despertando), el caller puede decidir reintentar; este cliente no
 * reintenta solo para que la UI mantenga el control del mensaje mostrado.
 */
export async function transcribir(
  opciones: OpcionesTranscripcion
): Promise<RespuestaTranscripcion> {
  const payload = {
    texto: opciones.texto,
    colapsar_consonantes: opciones.colapsar_consonantes ?? true,
    y_extranjera: opciones.y_extranjera ?? false,
  };

  const res = await fetch(`${API_URL}/transcribir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 503) {
    const err = new Error("Motor despertando. Inténtalo en unos segundos.");
    (err as Error & { code?: string }).code = "AWAKENING";
    throw err;
  }

  if (!res.ok) {
    let detalle = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) detalle = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* ignora cuerpo no-JSON */
    }
    throw new Error(detalle);
  }

  return (await res.json()) as RespuestaTranscripcion;
}
