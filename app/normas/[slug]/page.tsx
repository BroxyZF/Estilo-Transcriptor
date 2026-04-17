import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NormaContenido from "@/components/NormaContenido";
import { NORMAS, encontrarNorma, normasDisponibles } from "@/lib/normas";

interface Params {
  params: { slug: string };
}

/**
 * Pre-renderizado estático: Next.js genera una página HTML por cada norma
 * disponible al compilar. Resultado: CDN puro, latencia cero.
 */
export function generateStaticParams() {
  return NORMAS.filter((n) => n.disponible).map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: Params) {
  const norma = encontrarNorma(params.slug);
  if (!norma) return { title: "Documento no encontrado" };
  return {
    title: `${norma.nombre} · ${norma.subtitulo}`,
    description: norma.descripcion,
  };
}

function cargarDocumento(archivo: string): string {
  const ruta = path.join(process.cwd(), "content", "normas", archivo);
  return fs.readFileSync(ruta, "utf-8");
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

function extraerTOC(md: string): { id: string; titulo: string }[] {
  const toc: { id: string; titulo: string }[] = [];
  for (const linea of md.split("\n")) {
    const m = linea.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const titulo = m[1].replace(/[*_`]/g, "").trim();
      toc.push({ id: slugify(titulo), titulo });
    }
  }
  return toc;
}

export default function PaginaNorma({ params }: Params) {
  const norma = encontrarNorma(params.slug);
  if (!norma) notFound();

  const contenido = cargarDocumento(norma.archivo);
  const toc = extraerTOC(contenido);
  const hayVarias = normasDisponibles().length > 1;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Cabecera del documento */}
        <section className="pt-20 sm:pt-28 pb-12">
          {hayVarias && (
            <nav className="mb-6 text-xs smallcaps text-muted">
              <Link href="/normas" className="hover:text-ink transition-colors">
                Normas
              </Link>
              <span aria-hidden="true" className="mx-2 text-gold">/</span>
              <span className="text-ink">{norma.nombre}</span>
            </nav>
          )}
          <p className="smallcaps text-gold text-xs mb-4 oldstyle-nums">
            <span className="roman-num">§</span> &middot; Documento fundacional
          </p>
          <h1 className="font-display font-normal text-display-xl text-ink leading-none">
            {norma.nombre.replace("Norma ", "Norma ")}
          </h1>
          <p className="mt-4 font-display italic text-gold text-xl">
            {norma.subtitulo}
          </p>

          <div className="mt-10 filete" aria-hidden="true">
            <span className="filete-ornament">✦</span>
          </div>
        </section>

        {/* Layout: índice + cuerpo */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24">
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

          <article className="lg:col-span-9">
            <NormaContenido markdown={contenido} />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
