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
    gaMeasurementId: 'G-XXXXXXXXXX', // Reemplazar
    gtmId: 'GTM-XXXXXXX',           // Reemplazar
    enabled: false // Cambiar a true cuando tengas ID
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
  // =========================================
  canvas: {
    frameCount: 60, // Reducido de 192 para performance
    framePath: 'frames/frame_',
    frameExt: '.webp',
    batchSize: 18
  }
};

// No modificar debajo de esta linea
if (typeof window !== 'undefined') {
  window.INDUMEC_CONFIG = INDUMEC_CONFIG;
}