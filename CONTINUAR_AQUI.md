# Estado del Proyecto Indumec Web — 22 Marzo 2026 11:50pm

## Donde quedamos

Se esta construyendo el sitio web de Indumec como proyecto standalone en `d:\Indumec\web\`
usando HTML + CSS + JS vanilla con GSAP ScrollTrigger + Lenis smooth scroll + Canvas frame animation.

## Stack definida por el usuario (claude.md)
- React 19
- Tailwind v3.4.17
- Lucide icons
- GSAP
- Framer Motion

> **NOTA:** El usuario definio este stack en `claude.md` pero aun NO se ha migrado a React.
> La version actual es HTML/CSS/JS vanilla. Confirmar con el usuario si quiere migrar a React
> o si prefiere seguir con vanilla.

## Lo que funciona correctamente
1. **Canvas como fondo del Hero** — El video de producto (192 frames WebP) se muestra
   a pantalla completa (100vh) como fondo del hero y avanza frame por frame con el scroll
2. **Loader** — Barra de progreso que carga los 192 frames antes de mostrar el sitio
3. **Hero text** — "Tu operacion no puede parar" con fade-out al scrollear
4. **Lenis smooth scroll** — Integrado con GSAP ScrollTrigger
5. **WhatsApp button** — Flotante verde con pulse animation
6. **Marquee text** — Texto horizontal gigante que se mueve con scroll
7. **Frame rendering** — requestAnimationFrame (nunca en scroll event), cover mode

## Bug pendiente: SOLAPAMIENTO DE SECCIONES
Las secciones de contenido (Triage, Proceso, Industrias, Diferenciadores, Stats, CTA)
usan `position: fixed` y se superponen entre si en vez de mostrarse una a la vez.

**Causa raiz:** La logica de exclusividad de secciones NO esta funcionando correctamente.
Se reescribio 3 veces el controlador de secciones (de ScrollTrigger individuales a un
master controller con `showSection/hideAllSections`). La ultima version usa:
- `visibility: hidden` + `opacity: 0` para forzar ocultamiento
- Un unico ScrollTrigger con `scrub: 0.1` como master controller
- Estado `activeSectionIndex` para tracking

**La ultima verificacion (screenshot en triage_section_verification_1774241519607.png)
mostro la seccion Triage correctamente aislada, pero no se pudo completar la verificacion
de las demas secciones por falta de tiempo.**

## Archivos clave
- `d:\Indumec\web\index.html` — Estructura HTML (11 secciones)
- `d:\Indumec\web\css\style.css` — Design system completo
- `d:\Indumec\web\js\app.js` — Motor de animacion (ultima version con master controller)
- `d:\Indumec\web\frames/` — 192 WebP frames del video de producto
- `d:\Indumec\claude.md` — Stack definida por el usuario

## Skills aplicadas
- `claude.skills/taste-skill/skills/taste-skill/SKILL.md` — Reglas de diseno premium
- `claude.skills/scroll-web.md` — Animacion scroll con canvas

## Proximos pasos
1. **Verificar** si el solapamiento de secciones se resolvio con la ultima version del JS
2. **Si persiste**, el approach recomendado es:
   - Cambiar las secciones de `position: fixed` a un layout normal con scroll
   - Cada seccion ocupa su propio espacio vertical (en vez de overlay sobre canvas)
   - O usar un approach hibrido: sticky sections que se apilan correctamente
3. **Confirmar con el usuario** si quiere migrar a React 19 + Tailwind (segun claude.md)
4. Aplicar diagnostico completo del taste-skill
5. Pulir animaciones, responsive, y SEO

## Servidor local
El servidor esta corriendo en `npx serve . -l 3000` desde `d:\Indumec\web\`
URL: http://localhost:3000
