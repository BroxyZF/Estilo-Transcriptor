import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NORMAS } from "@/lib/normas";

export const metadata = {
  title: "Normas · Sistemas de romanización",
  description: "Índice de normas de romanización disponibles.",
};

export default function IndiceNormas() {
  const visibles = NORMAS.filter((n) => n.disponible);
  const proximas = NORMAS.filter((n) => !n.disponible);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        <section className="pt-20 sm:pt-28 pb-16">
          <p className="smallcaps text-gold text-xs mb-4 oldstyle-nums">
            <span className="roman-num">§</span> &middot; Índice
          </p>
          <h1 className="font-display font-normal text-display-lg text-ink">
            Normas
          </h1>
          <p className="mt-4 max-w-xl text-ink leading-relaxed">
            Documentos de romanización al español.
          </p>

          <div className="mt-10 filete" aria-hidden="true">
            <span className="filete-ornament">✦</span>
          </div>
        </section>

        {/* Disponibles */}
        <section className="pb-16">
          <h2 className="smallcaps text-xs text-muted mb-8">Disponibles</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibles.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/normas/${n.slug}`}
                  className="group block border border-rule p-7 hover:border-gold transition-colors h-full"
                >
                  <p className="text-xs smallcaps text-muted oldstyle-nums">
                    {n.origen} → {n.destino}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-ink group-hover:text-rubric transition-colors">
                    {n.nombre}
                  </h3>
                  <p className="mt-1 font-display italic text-gold">
                    {n.subtitulo}
                  </p>
                  <p className="mt-4 text-sm text-ink leading-relaxed">
                    {n.descripcion}
                  </p>
                  <p className="mt-6 text-xs smallcaps text-muted group-hover:text-ink transition-colors">
                    Leer →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Próximamente */}
        {proximas.length > 0 && (
          <section className="pb-24">
            <h2 className="smallcaps text-xs text-muted mb-8">En preparación</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proximas.map((n) => (
                <li
                  key={n.slug}
                  className="border border-dashed border-rule p-7 opacity-70"
                >
                  <p className="text-xs smallcaps text-muted oldstyle-nums">
                    {n.origen} → {n.destino}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-ink">
                    {n.nombre}
                  </h3>
                  <p className="mt-1 font-display italic text-gold">
                    {n.subtitulo}
                  </p>
                  <p className="mt-4 text-sm text-muted leading-relaxed">
                    {n.descripcion}
                  </p>
                  <p className="mt-6 text-xs smallcaps text-muted italic">
                    Próximamente
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
