export default function Footer() {
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-16">
        {/* Filete ornamental */}
        <div className="filete mb-10" aria-hidden="true">
          <span className="filete-ornament">· · ✦ · ·</span>
        </div>

        {/* Colofón: el texto al final de los libros antiguos que explicaba
            quién, cómo, cuándo y dónde se había impreso. */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="smallcaps text-muted text-xs">Colofón</p>
          <p className="font-display italic text-ink text-lg leading-relaxed">
            Compuesto en Fraunces y PT&nbsp;Serif, con datos en JetBrains&nbsp;Mono.
            <br />
            El motor filológico arbitra en Python; la prosodia, en una red neuronal.
            <br />
            La ortografía, donde corresponde, la dicta la{" "}
            <abbr title="Real Academia Española" className="no-underline">RAE</abbr>.
          </p>
          <p className="text-xs text-muted pt-6 oldstyle-nums">
            Norma SRH · MMXXVI · Edición digital, libre y gratuita.
          </p>
        </div>
      </div>
    </footer>
  );
}
