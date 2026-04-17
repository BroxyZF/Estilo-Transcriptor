import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NormaContenido from "@/components/NormaContenido";

export const metadata = {
  title: "La Norma SRH · Documento fundacional",
  description:
    "Documento íntegro de la Norma SRH: reglas, tablas y dinámica contextual del sistema de transcripción del ruso al español.",
};

// Se lee en build-time: página estática, ultrarrápida desde la CDN de Vercel.
function cargarNorma(): string {
  const ruta = path.join(process.cwd(), "content", "norma-srh.md");
  return fs.readFileSync(ruta, "utf-8");
}

// Extrae secciones de primer nivel (## …) para el índice.
function extraerTOC(md: string): { id: string; titulo: string }[] {
  const toc: { id: string; titulo: string }[] = [];
  const lineas = md.split("\n");
  for (const l of lineas) {
    const m = l.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const titulo = m[1].replace(/[*_`]/g, "").trim();
      const id = slugify(titulo);
      toc.push({ id, titulo });
    }
  }
  return toc;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function NormaPage() {
  const contenido = cargarNorma();
  const toc = extraerTOC(contenido);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* ═══ Cabecera del documento ════════════════════════════════════════ */}
        <section className="pt-20 sm:pt-28 pb-12">
          <p className="smallcaps text-gold text-xs mb-4 oldstyle-nums">
            <span className="roman-num">§</span> &middot; Documento fundacional
          </p>
          <h1 className="font-display font-normal text-display-xl text-ink leading-none">
            La Norma <span className="italic">SRH</span>
          </h1>
          <p className="mt-4 font-display italic text-gold text-xl">
            Versión definitiva · con ejemplos comentados
          </p>

          <div className="mt-10 filete" aria-hidden="true">
            <span className="filete-ornament">✦</span>
          </div>
        </section>

        {/* ═══ Layout: TOC + cuerpo ═════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24">
          {/* Índice lateral — sticky en desktop */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p className="smallcaps text-muted text-xs mb-4">Índice</p>
              <nav aria-label="Índice del documento">
                <ol className="space-y-2 text-sm oldstyle-nums">
                  {toc.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex gap-3 text-muted hover:text-ink transition-colors"
                      >
                        <span className="text-gold tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug group-hover:underline decoration-gold underline-offset-4">
                          {s.titulo}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="mt-8 pt-6 border-t border-rule">
                <Link
                  href="/"
                  className="text-xs smallcaps text-muted hover:text-rubric transition-colors"
                >
                  ← Volver al instrumento
                </Link>
              </div>
            </div>
          </aside>

          {/* Cuerpo del documento */}
          <article className="lg:col-span-9">
            <NormaContenido markdown={contenido} />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
