# Indumec - Sitio Web Industrial

Sistema de generacion de leads para Indumec, proveedor de mangueras y acoples industriales en Bogota, Colombia.

## Estructura del Proyecto

```
Indumec/
├── index.html              # Pagina principal
├── catalogo.html           # Catalogo de productos
├── css/
│   └── style.css           # Estilos principales
├── js/
│   └── app.js              # Logica principal
├── assets/                  # Imagenes y logos
├── frames/                  # Frames para animacion canvas
├── docs/                    # Documentos PDF
├── scripts/                 # Scripts de desarrollo
└── legacy/                  # Codigo obsoleto
```

## Configuracion

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno
3. Actualiza `js/config.js` con los valores correctos

## Desarrollo Local

```bash
# Servidor local con Python
python -m http.server 8000

# O con Node.js
npx serve .
```

## Variables de Entorno Requeridas

| Variable | Descripcion |
|----------|-------------|
| `EMAILJS_PUBLIC_KEY` | Clave publica de EmailJS |
| `EMAILJS_SERVICE_ID` | ID del servicio EmailJS |
| `EMAILJS_TEMPLATE_ID` | ID de la plantilla |
| `CONTACT_EMAIL` | Email de contacto |
| `CONTACT_WHATSAPP` | Numero de WhatsApp |

## SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Schema: Organization + LocalBusiness + FAQPage

## Contacto

- WhatsApp: +57 305 767 0817
- Email: info@indumec.com.co