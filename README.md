# Transcriptor SRH — Frontend

Interfaz web del Transcriptor SRH. **Next.js 14** (App Router) · **TypeScript**
· **Tailwind CSS** · **Framer Motion** · **react-markdown**.

## Estructura

```
frontend/
├── app/
│   ├── layout.tsx         # layout raíz, fuentes, script antiflash
│   ├── page.tsx           # home: portada + transcriptor
│   ├── norma/page.tsx     # documento de la Norma SRH
│   └── globals.css        # sistema tipográfico (variables CSS)
├── components/
│   ├── Header.tsx         # cabecera sticky con logo СРХ·SRH
│   ├── Footer.tsx         # colofón tipo libro antiguo
│   ├── Transcriber.tsx    # componente principal (input/output)
│   ├── EstadoMotorPill.tsx# indicador del estado del backend
│   ├── NormaContenido.tsx # renderizador markdown con anclas
│   └── ThemeToggle.tsx    # claro/oscuro con persistencia
├── content/
│   └── norma-srh.md       # documento fundacional (copia del backend)
├── lib/
│   └── api.ts             # cliente del backend (health + transcribir)
├── public/
│   └── favicon.svg        # Х cirílica en rojo rúbrica
├── tailwind.config.ts     # paleta y tokens de diseño
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Desarrollo local

```bash
# 1. Instala dependencias
npm install

# 2. Configura la URL del backend
cp .env.local.example .env.local
# edita .env.local si tu backend no corre en localhost:7860

# 3. Levanta el servidor de desarrollo
npm run dev
# → http://localhost:3000
```

Asegúrate de tener el backend corriendo en paralelo:
```bash
# en otra terminal, desde /backend
uvicorn app:app --reload --port 7860
```

## Despliegue en Vercel (gratis, 2 minutos)

1. Sube el proyecto a un repositorio de **GitHub**.
2. En [vercel.com](https://vercel.com), elige *Add New → Project* e importa
   el repo.
3. En *Configure Project*, especifica el directorio raíz como `frontend`.
   Vercel detectará Next.js automáticamente.
4. En *Environment Variables*, añade:

   ```
   Name:  NEXT_PUBLIC_API_URL
   Value: https://TU-USUARIO-transcriptor-srh.hf.space
   ```

5. *Deploy*. En ~60 segundos tendrás tu dominio `*.vercel.app`.
6. (**Importante**) Vuelve al Space de Hugging Face y añade tu dominio Vercel
   a la variable `ALLOWED_ORIGINS` del backend para cerrar el CORS.

## Paleta y tipografía

Definidas en `app/globals.css` y `tailwind.config.ts`:

| Variable       | Valor (día)  | Rol                                  |
| -------------- | ------------ | ------------------------------------ |
| `--paper`      | `#F6F2EA`    | Fondo, papel cálido                  |
| `--ink`        | `#1A1613`    | Tinta principal                      |
| `--muted`      | `#6B6255`    | Metadatos, texto secundario          |
| `--rule`       | `#D9CEB9`    | Filetes y bordes                     |
| `--rubric`     | `#8B2230`    | Acento rojo (errores, enfásis)       |
| `--gold`       | `#A67C3D`    | Acento secundario, numeración        |

| Familia       | Uso                                     |
| ------------- | --------------------------------------- |
| Fraunces      | Display, títulos, marca                 |
| PT Serif      | Cuerpo de texto, cirílico y latino      |
| JetBrains Mono| Datos técnicos, teclas, métricas        |

Todas las fuentes se cargan con `next/font/google` — sin FOIT, sin red externa
en runtime.

## Accesibilidad

- Contrastes AA en ambos modos.
- `prefers-reduced-motion` respetado.
- `focus-visible` con anillo dorado sobrio.
- Todas las interacciones funcionan con teclado.
- Atajo `Ctrl/⌘ + Enter` para transcribir.
