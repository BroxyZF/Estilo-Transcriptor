"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  markdown: string;
}

/** Slug consistente con el usado en la generación del TOC. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extrae texto llano de hijos arbitrarios de react-markdown. */
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
};

export default function NormaContenido({ markdown }: Props) {
  return (
    <div className="prose-norma">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
