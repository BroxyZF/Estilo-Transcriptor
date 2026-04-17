import type { Metadata } from "next";
import { Fraunces, PT_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontDisplay = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const fontBody = PT_Serif({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Norma SRH · Sistema de Romanización Hispánico",
  description:
    "Transcripción del ruso al español conforme a la Norma SRH, con acentuación ortográfica según la RAE.",
  authors: [{ name: "Norma SRH" }],
  keywords: [
    "Norma SRH",
    "Sistema de Romanización Hispánico",
    "transcripción del ruso",
    "transliteración ruso español",
    "cirílico",
    "RAE",
  ],
  openGraph: {
    title: "Norma SRH · Sistema de Romanización Hispánico",
    description:
      "Transcripción del ruso al español conforme a la Norma SRH.",
    type: "website",
    locale: "es_ES",
  },
  robots: { index: true, follow: true },
};

/**
 * Script de bloqueo del "flash of wrong theme".
 * Se ejecuta antes de pintar; respeta la preferencia guardada por el usuario,
 * y si no la hay, sigue la preferencia del sistema operativo.
 */
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('srh-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
