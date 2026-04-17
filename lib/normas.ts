/**
 * Catálogo de normas de romanización.
 *
 * Agregar una norma nueva requiere tres pasos, ninguno invasivo:
 *
 *   1. Añadir una entrada en este array.
 *   2. Colocar el documento en `content/normas/{slug}.md`.
 *   3. (Opcional, si debe ser transcribible en la web) crear el transcriptor
 *      correspondiente en el backend y ampliar `endpoint`.
 *
 * Mientras solo haya una norma `disponible: true`, la interfaz la trata como
 * "la Norma" (singular). Al aparecer una segunda, el índice `/normas` y el
 * enlace del header se adaptan automáticamente.
 */

export interface NormaMeta {
  /** Identificador único, usado en la URL: `/normas/{slug}`. */
  slug: string;
  /** Nombre corto (rótulo). */
  nombre: string;
  /** Subtítulo — preferentemente el nombre completo, sin adornos. */
  subtitulo: string;
  /** Par de idiomas que romaniza. */
  origen: string;
  destino: string;
  /** Descripción de una línea, sobria, sin superlativos. */
  descripcion: string;
  /** Archivo Markdown del documento, relativo a `content/normas/`. */
  archivo: string;
  /**
   * Identificador del endpoint del backend. `"srh"` corresponde al único
   * transcriptor existente. `null` = la norma existe solo como documento
   * (no hay motor en el backend); la UI oculta el transcriptor en ese caso.
   */
  endpoint: "srh" | null;
  /** Si `false`, se lista como "Próximamente" y no recibe página propia. */
  disponible: boolean;
}

export const NORMAS: NormaMeta[] = [
  {
    slug: "srh",
    nombre: "Norma SRH",
    subtitulo: "Sistema de Romanización Hispánico",
    origen: "Ruso",
    destino: "Español",
    descripcion:
      "Transcripción del cirílico ruso al español con acentuación conforme a la RAE.",
    archivo: "srh.md",
    endpoint: "srh",
    disponible: true,
  },
  // Ejemplo de norma futura (descomenta cuando la tengas):
  // {
  //   slug: "sgh",
  //   nombre: "Norma SGH",
  //   subtitulo: "Sistema de romanización del griego",
  //   origen: "Griego",
  //   destino: "Español",
  //   descripcion: "Transcripción del alfabeto griego al español.",
  //   archivo: "sgh.md",
  //   endpoint: null,
  //   disponible: false,
  // },
];

/** Normas visibles al público (disponibles). */
export function normasDisponibles(): NormaMeta[] {
  return NORMAS.filter((n) => n.disponible);
}

/** Busca una norma por slug. Devuelve `undefined` si no existe o no está disponible. */
export function encontrarNorma(slug: string): NormaMeta | undefined {
  return NORMAS.find((n) => n.slug === slug && n.disponible);
}
