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
  // Obtener en: https://www.emailjs.com/
  // Pasos:
  // 1. Crear cuenta en EmailJS
  // 2. Crear servicio de email
  // 3. Crear plantilla de email
  // 4. Obtener Public Key
  emailjs: {
    publicKey: 'indumec_web',     // Reemplazar con tu clave
    serviceId: 'service_indumec', // Reemplazar con tu service ID
    templateId: 'template_indumec', // Reemplazar con tu template ID
    enabled: true
  },

  // =========================================
  // GOOGLE ANALYTICS / GTM
  // =========================================
  analytics: {
    gaMeasurementId: 'G-XXXXXXXXXX', // Reemplazar con ID de GA si lo tienes, o dejarlo así para GTM
    gtmId: 'GTM-NZ4556RZ',           // ID actualizado
    enabled: true // Analytics activado
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
  // CONFIGURACION DEL CANVAS
  // Desktop: 192 frames para video completo
  // Mobile: 40 frames para WPO optimizado
  // =========================================
  canvas: {
    // Configuración desktop - video completo
    desktop: {
      frameCount: 192,
      batchSize: 24,
      maxDpr: 2 // Limitar DPR para pantallas retina
    },
    // Configuración mobile - WPO optimizado
    mobile: {
      frameCount: 40,
      batchSize: 12,
      maxDpr: 1.5 // Reducir DPR en móvil
    },
    framePath: 'frames/frame_',
    frameExt: '.webp'
  },

  // Detectar si es dispositivo móvil
  isMobile: function() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Obtener configuración del canvas según dispositivo
  getCanvasConfig: function() {
    const isMobile = this.isMobile();
    const config = isMobile ? this.canvas.mobile : this.canvas.desktop;
    return {
      frameCount: config.frameCount,
      framePath: this.canvas.framePath,
      frameExt: this.canvas.frameExt,
      batchSize: config.batchSize,
      maxDpr: config.maxDpr,
      isMobile: isMobile
    };
  }
};

// No modificar debajo de esta linea
if (typeof window !== 'undefined') {
  window.INDUMEC_CONFIG = INDUMEC_CONFIG;
}