import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Transcriber from "@/components/Transcriber";
import { normasDisponibles } from "@/lib/normas";

export default function HomePage() {
  const normas = normasDisponibles();
  const rutaNorma =
    normas.length === 1 ? `/normas/${normas[0].slug}` : "/normas";

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* ═══ PORTADA ═══════════════════════════════════════════════════════ */}
        <section className="pt-20 sm:pt-28 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            {/* Título */}
            <div className="lg:col-span-7 animate-rise">
              <p className="smallcaps text-gold text-xs mb-6 oldstyle-nums">
                <span className="roman-num">§ i</span> &middot; Edición digital · 2026
              </p>
              <h1 className="font-display font-normal text-display-xl text-ink">
                Norma <span className="italic">SRH</span>
              </h1>
              <p className="font-display italic text-gold text-xl mt-2">
                Sistema de Romanización Hispánico
              </p>
            </div>

            {/* Descripción — directa, sin floritura */}
            <div
              className="lg:col-span-5 animate-rise"
              style={{ animationDelay: "120ms" }}
            >
              <div className="border-l-2 border-gold pl-6">
                <p className="text-base leading-relaxed text-ink">
                  Transcripción del ruso al español conforme a la Norma SRH,
                  con acentuación ortográfica según la{" "}
                  <abbr title="Real Academia Española" className="no-underline smallcaps text-gold">
                    RAE
                  </abbr>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Filete ornamental */}
          <div className="mt-16 filete" aria-hidden="true">
            <span className="filete-ornament">✦</span>
          </div>
        </section>

        {/* ═══ EL INSTRUMENTO ════════════════════════════════════════════════ */}
        <section id="transcriptor" aria-labelledby="h-transcriptor" className="pb-24">
          <div className="mb-10 flex items-baseline justify-between">
            <h2
              id="h-transcriptor"
              className="font-display text-display-md text-ink"
            >
              <span className="roman-num mr-3">§ ii</span>
              El instrumento
            </h2>
            <Link
              href={rutaNorma}
              className="text-xs smallcaps text-muted hover:text-rubric transition-colors"
            >
              Consultar la Norma →
            </Link>
          </div>

          <Transcriber />
        </section>

        {/* ═══ INVITACIÓN A LA NORMA ═════════════════════════════════════════ */}
        <section aria-labelledby="h-norma" className="pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <h2
                id="h-norma"
                className="font-display text-display-md text-ink"
              >
                <span className="roman-num mr-3">§ iii</span>
                La Norma
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="font-body text-lg leading-relaxed text-ink">
                Documento íntegro con las reglas, tablas y ejemplos que rigen
                el sistema.
              </p>
              <div className="mt-6">
                <Link
                  href={rutaNorma}
                  className="inline-block font-display text-lg border-b-2 border-gold text-ink hover:text-rubric hover:border-rubric transition-colors"
                >
                  Leer la Norma SRH →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
