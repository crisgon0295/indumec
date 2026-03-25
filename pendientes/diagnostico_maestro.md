# 🏥 Diagnóstico Maestro: Indumec Lead Generation System

**Estado:** Crítico / Reconstrucción  
**Objetivo:** Transformar Indumec en una máquina de captación de leads B2B en Bogotá.

---

# 1. RESUMEN EJECUTIVO (Puntuación 1–10)

| Área | Puntuación | Estado |
|---|---|---|
| **SEO** | 5.5/10 | Estructura básica presente, pero falta autoridad y profundidad de contenido. |
| **Rendimiento (WPO)** | 4/10 | El sistema de canvas actual es pesado y bloquea el hilo principal si no se gestiona bien. |
| **Conversión (CRO)** | 7/10 | Mejorado con el rediseño reciente, pero el "cerrador" técnico aún es débil. |
| **Claridad UX** | 6.5/10 | La animación compite con el mensaje. El usuario debe "trabajar" para leer. |
| **Calidad Técnica** | 6/10 | Código limpio pero frágil; dependiente de scripts externos pesados. |

### 🚨 Top 5 Problemas Críticos
1. ~~**Fricción por Carga Visual:** 192 frames de video pesan demasiado.~~ **[RESUELTO: 60 frames y Preload optimizado]**
2. ~~**Ausencia de Autoridad Real:** Faltan certificaciones visibles y logos de clientes.~~ **[RESUELTO: Banda de confianza y Certificaciones SAE/ISO inyectadas]**
3. ~~**Tracking Ciego:** GTM/GA4 eran placeholders.~~ **[RESUELTO: ID GTM-NZ4556RZ configurado y eventos de click activos]**
4. **Ancho de Banda SEO Bajo:** Faltan subpáginas. **[EN PROGRESO: 2 Landings críticas creadas]**
5. ~~**Formulario Sin Cierre:** El formulario no confirmaba recepción.~~ **[RESUELTO: FormSubmit con redirect a WhatsApp e ID de tracking]**

### 🚀 Top 5 Oportunidades de Crecimiento
1. **SEO Local Bogotá:** Dominar "mangueras hidráulicas Bogotá" mediante páginas de aterrizaje geolocalizadas.
2. **Catálogo como Lead Magnet:** El catálogo actual es bueno; convertirlo en una herramienta de consulta técnica obligada.
3. **Automatización WhatsApp:** Mensajes contextuales por producto que ahorran tiempo de calificación al vendedor.
4. **Prueba Social B2B:** Incluir casos de éxito de paradas de planta resueltas en menos de 2 horas.
5. **Optimización de Activos:** Migrar a frames de menor resolución o compresión extrema para volar en 4G.

---

# 2. AUDITORÍA TÉCNICA SEO

*   **Estructura HTML:** Correcta (H1 único, jerarquía H2/H3 respetada).
*   **Metadatos:** Optimizados hoy, pero estáticos. Falta dinamismo.
*   **Canonicals:** Implementados. Bien.
*   **Indexabilidad:** El sitio es indexable, pero la estructura de archivos (`d:/Indumec/...`) debe ser monitoreada al subir a producción para evitar enlaces rotos.
*   **Schema.org:** Se añadió FAQ y LocalBusiness. Falta `Product` schema para el catálogo (aunque no tenga precios).

---

# 3. BRECHA ESTRATÉGICA SEO (GAP)

**Veredicto:** El sitio es un "folleto animado", no una red de pesca.
*   **Páginas Faltantes:** Necesitas landing pages específicas para:
    *   `/ensambles-hidraulicos-bogota.html`
    *   `/terminales-y-acoples-npt-bsp.html`
    *   `/mangueras-grado-alimenticio-fda.html`
*   **Contenido:** Falta texto técnico largo (800+ palabras) para posicionar términos de alta competencia técnica.

---

# 4. RENDIMIENTO (WPO) - EL "ELEFANTE EN LA HABITACIÓN"

**Veredicto Brutal:** El sistema GSAP + Canvas es estéticamente superior pero técnicamente un riesgo.
*   **LCP (Largest Contentful Paint):** Pobre. El canvas tarda en inicializar.
*   **JS Weight:** Gsap + ScrollTrigger + Lenis + Local JS = ~300KB extra antes de ver el primer producto.
*   **Impacto Canvas:** Bloquea la interacción en dispositivos gama media si el usuario intenta hacer scroll rápido.
*   **Solución:** Reducir frames a 60 (como hice en config.js) y usar compresión WebP nivel 60.

---

# 5. AUDITORÍA DE CONVERSIÓN (CRO)

**¿Por qué un usuario NO contactaría?**
1. **Duda Técnica:** "¿Estarán abiertos ahora?" (Aunque añadimos el dot de estado, falta más énfasis).
2. **Desconfianza:** "Parece una web muy moderna para un taller de mangueras, ¿serán reales?". Necesitamos fotos reales del local y equipo.
3. **Fricción:** El botón de WhatsApp a veces se pierde entre tanto movimiento.

---

# 6. ANÁLISIS DEL FUNNEL DE WHATSAPP

*   **Flujo:** Bueno. Mensajes contextuales ayudan.
*   **Fricción:** Ninguna. Click to chat es directo.
*   **Visibilidad:** Alta en móvil (Sticky bar inferior).

---

# 7. ANÁLISIS UX/UI

*   **Veredicto:** El rediseño mejoró la jerarquía, pero la animación del "Triage Industrial" (Sección 1) debe ser más rápida. El usuario bajo presión no quiere esperar a que un frame cargue para leer "Fuga activa".

---

# 8. CONFIANZA Y AUTORIDAD

*   **Problema:** El carousel de logos es invisible si el usuario no llega al 80% del scroll.
*   **Recomendación:** Subir los logos de clientes importantes al Hero. "Empresas que confían en nosotros" debe verse en los primeros 3 segundos.

---

# 9. TRACKING Y DATOS (CRÍTICO)

*   **GA4 / GTM:** TOTALMENTE INÚTILES actualmente. Son contenedores vacíos.
*   **Acción:** Implementar el tracking de eventos de WhatsApp DE INMEDIATO para medir el ROI de los anuncios/SEO.

---

# 10. LISTA DE ERRORES CRÍTICOS

| Prioridad | Problema | Impacto | Solución |
|---|---|---|---|
| **ALTA** | GA4/GTM Placeholder | Cero datos de marketing. | ~~Configurar IDs reales y eventos.~~ **[RESUELTO]** |
| **ALTA** | Peso de Frames | Rebote de usuarios móviles (4G). | ~~Comprimir WebP y reducir a 60 frames.~~ **[RESUELTO]** |
| **MEDIA** | Falta de SSL/HTTPS | Advertencia de "Sitio no seguro". | Asegurar certificado al subir a prod. |
| **MEDIA** | 404 en subpáginas | Pérdida de tráfico SEO. | Crear archivos para mangueras/acoples. |

---

# 11. PLAN DE ACCIÓN MAESTRO

## FASE 1: Estabilización (Días 0–7)
1.  ~~**Configurar Tracking REAL:** Conectar GTM con GA4 y medir clicks en WhatsApp.~~ **✅ COMPLETADO**
2.  ~~**Optimización de Activos:** Animación a 60 frames liberando Main Thread.~~ **✅ COMPLETADO**
3.  ~~**Corrección de Authority:** Inyectar logos de clientes reales en banda de autoridad.~~ **✅ COMPLETADO**

## FASE 2: Expansión de Contenido (Días 7–30)
1.  ~~**Estructura Multi-página:** Crear landigs (Ensambles y Terminales NPT/BSP).~~ **✅ COMPLETADO**
2.  ~~**Sección de Certificaciones:** Crear bloque visual con logos de normas SAE, NFPA, ISO.~~ **✅ COMPLETADO**
3.  ~~**Formulario Auto-responder:** Configurar FormSubmit con redirect estratégico.~~ **✅ COMPLETADO**
4.  **Limpieza de CSS:** Migrar estilos inline a `style.css` para mejor WPO. **[PENDIENTE]**

## FASE 3: Dominancia (Días 30–90)
1.  **Blog Técnico:** 2 artículos mensuales sobre "Mantenimiento Preventivo de Circuitos Hidráulicos".
2.  **SEO Local:** Google Business Profile optimizado y enlazado a la web.

---

# 12. VEREDICTO FINAL

**¿Puede generar leads hoy?**  
Sí, el rediseño actual es funcional y mucho más directo que el anterior. La narrativa de "Operación detenida" funcionará con el tráfico correcto.

**¿Qué falta para ser dominante?**  
Contenido específico. Google no te posicionará por encima de los grandes distribuidores solo por tener una animación bonita. Necesitas **autoridad técnica escrita**.

**¿Qué arreglaría primero si mi sueldo dependiera de esto?**  
El **Tracking**. Sin saber cuánta gente hace click en WhatsApp, estamos volando a ciegas. Lo segundo: **la velocidad de carga móvil**. Si el cliente tiene una urgencia y la web tarda 5 segundos en cargar el video, se irá a la competencia.
