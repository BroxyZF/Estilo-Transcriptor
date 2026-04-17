# Transcriptor SRH — Frontend

Interfaz web del Transcriptor SRH. **Next.js 14** (App Router) · **TypeScript**
· **Tailwind CSS** · **Framer Motion** · **react-markdown**.

## Estructura

```
frontend/
├── app/
│   ├── layout.tsx               # layout raíz, fuentes, script antiflash
│   ├── page.tsx                 # home: portada + transcriptor
│   ├── normas/
│   │   ├── page.tsx             # índice de normas (se adapta al catálogo)
│   │   └── [slug]/page.tsx      # documento de cada norma (SSG)
│   └── globals.css              # sistema tipográfico (variables CSS)
├── components/
│   ├── Header.tsx               # cabecera sticky con logo СРХ·SRH
│   ├── Footer.tsx               # colofón de una línea
│   ├── Transcriber.tsx          # componente principal (input/output)
│   ├── EstadoMotorPill.tsx      # indicador del estado del backend
│   ├── NormaContenido.tsx       # renderizador de Markdown con rehype-raw
│   └── ThemeToggle.tsx          # claro/oscuro con persistencia
├── content/
│   └── normas/
│       └── srh.md               # documento de la Norma SRH
├── lib/
│   ├── api.ts                   # cliente del backend
│   └── normas.ts                # catálogo de normas disponibles
├── public/
│   └── favicon.svg              # Х cirílica en rojo rúbrica
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Desarrollo local

```bash
npm install

# Configura la URL del backend
cp .env.local.example .env.local
# edita .env.local si tu backend no corre en localhost:7860

npm run dev    # → http://localhost:3000
```

Asegúrate de tener el backend corriendo en paralelo:

```bash
# en otra terminal, desde /backend
uvicorn app:app --reload --port 7860
```

## Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), importa el repo como nuevo proyecto.
3. En *Configure Project → Root Directory*, indica `frontend`. Next.js se
   detecta automáticamente.
4. En *Environment Variables*, añade:

   ```
   NEXT_PUBLIC_API_URL = https://TU-USUARIO-transcriptor-srh.hf.space
   ```

5. *Deploy*.
6. Vuelve al Space de Hugging Face y añade tu dominio de Vercel a la
   variable `ALLOWED_ORIGINS` del backend para cerrar el CORS.

## Añadir una norma nueva

El catálogo está centralizado en `lib/normas.ts`. Para añadir una norma
nueva:

1. Redacta el documento en `content/normas/{slug}.md`.
2. Añade una entrada al array `NORMAS` con la metadata:

   ```ts
   {
     slug: "sgh",
     nombre: "Norma SGH",
     subtitulo: "Sistema de romanización del griego",
     origen: "Griego",
     destino: "Español",
     descripcion: "Transcripción del griego antiguo al español.",
     archivo: "sgh.md",
     endpoint: null,        // null = solo documento; "sgh" = transcriptor
     disponible: true,
   }
   ```

3. (Opcional) Crea el transcriptor en el backend y ajusta `endpoint`.

El índice `/normas`, las rutas dinámicas y la navegación del header se
actualizan automáticamente.

## Paleta y tipografía

Definidas en `app/globals.css`:

| Variable       | Valor (día)  | Rol                                  |
| -------------- | ------------ | ------------------------------------ |
| `--paper`      | `#F6F2EA`    | Fondo, papel cálido                  |
| `--ink`        | `#1A1613`    | Tinta principal                      |
| `--muted`      | `#6B6255`    | Metadatos, texto secundario          |
| `--rule`       | `#D9CEB9`    | Filetes y bordes                     |
| `--rubric`     | `#8B2230`    | Acento rojo (errores, énfasis)       |
| `--gold`       | `#A67C3D`    | Acento secundario, numeración        |

| Familia        | Uso                                    |
| -------------- | -------------------------------------- |
| Fraunces       | Display, títulos, marca                |
| PT Serif       | Cuerpo de texto, cirílico y latino     |
| JetBrains Mono | Datos técnicos, teclas, métricas       |

Las tres fuentes se cargan con `next/font/google` — sin FOIT, sin red
externa en runtime.

## Accesibilidad

- Contrastes AA en ambos modos.
- `prefers-reduced-motion` respetado.
- `focus-visible` con anillo dorado sobrio.
- Todas las interacciones funcionan con teclado.
- Atajo `Ctrl/⌘ + Enter` para transcribir.
- El tema sigue la preferencia del sistema; el usuario puede cambiarla
  manualmente y la elección queda guardada.
