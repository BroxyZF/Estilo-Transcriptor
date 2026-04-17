"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  markdown: string;
}

/**
 * Slug consistente con el usado en la página del índice.
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extrae el texto llano de hijos arbitrarios de react-markdown. */
function textoPlano(nodes: React.ReactNode): string {
  if (nodes == null || typeof nodes === "boolean") return "";
  if (typeof nodes === "string" || typeof nodes === "number") return String(nodes);
  if (Array.isArray(nodes)) return nodes.map(textoPlano).join("");
  if (typeof nodes === "object" && "props" in (nodes as object)) {
    // @ts-expect-error — acceso seguro a props
    return textoPlano(nodes.props?.children);
  }
  return "";
}

const components: Components = {
  // Los h2 reciben ID anclable para el TOC lateral
  h2({ children, ...props }) {
    const id = slugify(textoPlano(children));
    return (
      <h2 id={id} {...props} className="scroll-mt-24">
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    const id = slugify(textoPlano(children));
    return (
      <h3 id={id} {...props} className="scroll-mt-24">
        {children}
      </h3>
    );
  },
  // Los ejemplos cirílicos reciben lang="ru" automáticamente si vienen como
  // strong con caracteres cirílicos — para que los subsets tipográficos de
  // PT Serif rusa se apliquen bien.
};

export default function NormaContenido({ markdown }: Props) {
  return (
    <div className="prose-norma">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
