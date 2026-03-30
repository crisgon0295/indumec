/**
 * Indumec - Configuracion Central
 *
 * Este archivo contiene toda la configuracion del sitio.
 * Modifica estos valores para cambiar comportamiento del sitio.
 *
 * NO SUBIR .env a repositorios publicos
 */

const INDUMEC_CONFIG = {
  // =========================================
  // INFORMACION DEL NEGOCIO
  // =========================================
  business: {
    name: 'Indumec S.A.S.',
    nit: '900.XXX.XXX-X', // Actualizar con NIT real
    phone: '+57 305 767 0817',
    whatsapp: '573057670817',
    email: 'info@indumec.com.co',
    city: 'Bogota',
    country: 'Colombia',
    fullAddress: 'Bogota, Colombia',
    schedule: {
      weekdays: '7:00am - 6:00pm',
      saturday: '8:00am - 1:00pm'
    }
  },

  // =========================================
  // EMAILJS - Formulario de Contacto
  // =========================================
  emailjs: {
    publicKey: 'indumec_web',
    serviceId: 'service_indumec',
    templateId: 'template_indumec',
    enabled: true
  },

  // =========================================
  // GOOGLE ANALYTICS / GTM
  // =========================================
  analytics: {
    gaMeasurementId: 'G-XXXXXXXXXX',
    gtmId: 'GTM-NZ4556RZ',
    enabled: true
  },

  // =========================================
  // MENSAJES PREDEFINIDOS DE WHATSAPP
  // =========================================
  whatsappMessages: {
    default: 'Hola, necesito asesoria tecnica industrial',
    urgent: 'Hola, tengo una urgencia con mangueras industriales',
    quote: 'Hola, necesito cotizar mangueras o acoples industriales',
    catalog: 'Hola, quiero ver el catalogo completo de productos',
    hydraulic: 'Hola, necesito mangueras hidraulicas SAE 100',
    fire: 'Hola, necesito mangueras contra incendio NFPA',
    food: 'Hola, necesito mangueras grado alimenticio FDA',
    fuel: 'Hola, necesito mangueras para combustibles',
    suction: 'Hola, necesito mangueras de succion para motobombas'
  },

  // =========================================
  // METRICAS DEL NEGOCIO
  // =========================================
  metrics: {
    yearsExperience: 20,
    clientsCount: 250,
    effectivenessRate: 98,
    sameDayDelivery: 90
  },

  // =========================================
  // CONFIGURACION DEL CANVAS (Animacion Hero)
  //
  // Desktop (>1024px):
  //   192 frames reales · velocidad 2× (scroll-container = 350vh)
  //
  // Tablet (769-1024px):
  //   192 frames reales · velocidad 2× · DPR limitado a 1.5
  //
  // Mobile (≤768px):
  //   96 frames VIRTUALES → cada uno mapea a frame real ×2
  //   (frame 0→real 1, frame 1→real 3, frame 2→real 5...)
  //   Animacion visualmente completa con 50% menos requests y memoria
  //   WPO: -50% network, -50% RAM canvas
  // =========================================
  canvas: {

    desktop: {
      frameCount:       192, // cuantos frames se cargan
      frameStep:        1,   // salto en archivos reales (1 = todos)
      scrollMultiplier: 2,   // velocidad: 2× = scroll-container ÷ 2
      batchSize:        24,
      maxDpr:           2
    },

    tablet: {
      frameCount:       192,
      frameStep:        1,
      scrollMultiplier: 2,
      batchSize:        20,
      maxDpr:           1.5
    },

    mobile: {
      frameCount:       96,  // frames virtuales (la mitad)
      frameStep:        2,   // cada virtual → real×2 (cubre rango 1-191)
      scrollMultiplier: 1,   // velocidad normal en móvil (scroll-container = 350vh)
      batchSize:        12,
      maxDpr:           1.5
    },

    framePath: 'frames/frame_',
    frameExt:  '.webp'
  },

  // =========================================
  // DETECCION DE DISPOSITIVO
  // =========================================

  // Retorna 'mobile' | 'tablet' | 'desktop'
  getBreakpoint: function() {
    const w = window.innerWidth;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (w <= 768 || isMobileUA) return 'mobile';
    if (w <= 1024) return 'tablet';
    return 'desktop';
  },

  // Compatibilidad hacia atras
  isMobile: function() {
    return this.getBreakpoint() === 'mobile';
  },

  // Retorna objeto de configuracion segun breakpoint actual
  getCanvasConfig: function() {
    const bp    = this.getBreakpoint();
    const cfg   = this.canvas[bp] || this.canvas.desktop;
    return {
      frameCount:       cfg.frameCount,
      frameStep:        cfg.frameStep,
      scrollMultiplier: cfg.scrollMultiplier,
      framePath:        this.canvas.framePath,
      frameExt:         this.canvas.frameExt,
      batchSize:        cfg.batchSize,
      maxDpr:           cfg.maxDpr,
      isMobile:         bp === 'mobile',
      breakpoint:       bp
    };
  }
};

// No modificar debajo de esta linea
if (typeof window !== 'undefined') {
  window.INDUMEC_CONFIG = INDUMEC_CONFIG;
}