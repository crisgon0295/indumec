
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';
let sessionId = null;
let callId = 0;

async function mcpCall(method, params = {}) {
    callId++;
    const headers = { 'Authorization': auth, 'Content-Type': 'application/json' };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
    const res = await fetch(url, {
        method: 'POST', headers,
        body: JSON.stringify({ jsonrpc: "2.0", id: callId, method, params })
    });
    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;
    return res.json();
}

async function tool(name, args) {
    const r = await mcpCall('tools/call', { name, arguments: args });
    const content = r.result?.content?.[0]?.text;
    if (content) { try { return JSON.parse(content); } catch { return content; } }
    return r.result || r.error;
}

async function main() {
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-builder", version: "1.0.0" }
    });

    const POST_ID = 7;

    // Add custom CSS for premium styling
    console.log('Adding custom CSS...');
    const cssResult = await tool('elementor-mcp-add-custom-css', {
        post_id: POST_ID,
        css: `
/* ==============================
   INDUMEC — Custom Premium CSS
   ============================== */

/* Google Font Import */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

/* Global body overrides */
body {
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
}

/* Smooth scroll */
html {
    scroll-behavior: smooth;
}

/* Premium button hover effects */
.elementor-button {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative;
    overflow: hidden;
}
.elementor-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
.elementor-button:active {
    transform: translateY(0) scale(0.98);
}

/* WhatsApp button glow */
.elementor-button[style*="background-color: rgb(37, 211, 102)"]:hover,
.elementor-button[style*="background-color:#25D366"]:hover {
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
}

/* Icon box cards - hover animation */
.elementor-icon-box-wrapper {
    padding: 30px 25px;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.06);
}
.elementor-icon-box-wrapper:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    border-color: rgba(27, 94, 59, 0.15);
}

/* Icon animation on hover */
.elementor-icon-box-wrapper:hover .elementor-icon {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}

/* Counter animation enhancement */
.elementor-counter .elementor-counter-number-wrapper {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 700;
}

/* Heading reveal animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.elementor-heading-title {
    animation: fadeInUp 0.8s ease-out;
}

/* Section entrance animations */
.elementor-section,
.e-con {
    opacity: 1;
}

/* Form styling */
.elementor-form .elementor-field {
    border: 1px solid #E0E0E0 !important;
    border-radius: 8px !important;
    padding: 14px 16px !important;
    font-family: 'Outfit', sans-serif !important;
    transition: border-color 0.3s ease;
}
.elementor-form .elementor-field:focus {
    border-color: #1B5E3B !important;
    box-shadow: 0 0 0 3px rgba(27, 94, 59, 0.1) !important;
    outline: none;
}
.elementor-form .elementor-field-label {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 500 !important;
    color: #1A2E35 !important;
    margin-bottom: 6px !important;
}

/* Video container styling */
.elementor-video-container {
    border-radius: 16px;
    overflow: hidden;
}

/* Responsive mobile adjustments */
@media (max-width: 767px) {
    .elementor-heading-title {
        word-break: break-word;
    }
    .elementor-icon-box-wrapper {
        padding: 20px 15px;
    }
}

/* Sticky WhatsApp floating button */
.whatsapp-float {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
    z-index: 999;
    transition: all 0.3s ease;
    cursor: pointer;
}
.whatsapp-float:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(37, 211, 102, 0.5);
}
.whatsapp-float svg {
    width: 32px;
    height: 32px;
    fill: white;
}
`
    });
    console.log('CSS result:', JSON.stringify(cssResult));

    // Add floating WhatsApp button via HTML
    console.log('\nAdding floating WhatsApp button...');
    const waFloat = await tool('elementor-mcp-add-html', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            html: `<a href="https://wa.me/573046741878?text=Hola%2C%20necesito%20asesor%C3%ADa%20t%C3%A9cnica%20urgente" target="_blank" class="whatsapp-float" aria-label="Contactar por WhatsApp">
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>`
        }
    });
    console.log('WhatsApp float result:', JSON.stringify(waFloat));

    // Add Google Analytics placeholder via code snippet
    console.log('\nAdding tracking code snippet...');
    const tracking = await tool('elementor-mcp-add-code-snippet', {
        title: 'Indumec - Google Analytics Placeholder',
        location: 'head',
        code: `<!-- Google Analytics placeholder - Replace GA_MEASUREMENT_ID with your ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
  
  // Track WhatsApp CTA clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('wa.me')) {
      gtag('event', 'whatsapp_click', {
        event_category: 'CTA',
        event_label: link.textContent.trim()
      });
    }
  });
</script>`,
        priority: 10,
        status: 'draft'
    });
    console.log('Tracking result:', JSON.stringify(tracking));

    console.log('\n=== CUSTOM CSS & ENHANCEMENTS COMPLETE ===');
}

main().catch(console.error);
