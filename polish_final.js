
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
    return r;
}

const pid = 76;

async function main() {
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-final-touches", version: "1.0.0" }
    });

    console.log('Polishing page 76...');

    // 1. Meta
    console.log('Setting SEO metadata...');
    await tool('elementor-mcp-update-page-settings', {
        post_id: pid,
        settings: {
            post_title: 'Mangueras y Acoples Industriales en Bogotá | Entrega Inmediata — Indumec',
            _elementor_page_title: 'Mangueras y Acoples Industriales en Bogotá | Entrega Inmediata — Indumec',
            _description: 'Solución técnica urgente para tu industria. Mangueras, acoples y accesorios certificados con asesoría y despacho en minutos. Cotiza por WhatsApp.'
        }
    });

    // 2. CSS
    console.log('Injecting Custom CSS...');
    const css = `
        /* Glassmorphism Triage Cards (already improved) */
        .elementor-widget-icon-box {
            background: rgba(255,255,255,0.85) !important;
            backdrop-filter: blur(12px) !important;
            border-radius: 16px !important;
            padding: 40px !important;
            box-shadow: 0 15px 40px rgba(0,0,0,0.08) !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .elementor-widget-icon-box:hover {
            transform: translateY(-15px) scale(1.02) !important;
            box-shadow: 0 30px 60px rgba(27,94,59,0.15) !important;
        }
        
        /* Floating WhatsApp Button Simulation (Custom JS below) */
        .wa-floating {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #25D366;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 9999;
            text-decoration: none;
            transition: transform 0.3s;
        }
        .wa-floating:hover { transform: scale(1.1); }
    `;
    await tool('elementor-mcp-add-custom-css', {
        post_id: pid,
        css: css
    });

    // 3. JS (Atomic build-page doesn't handle JS well, injecting via custom-js)
    console.log('Injecting Custom JS...');
    const js = `
        // Floating WhatsApp Button
        const wa = document.createElement('a');
        wa.href = 'https://wa.me/573046741878?text=Hola%2C%20necesito%20asesor%C3%ADa%20t%C3%A9cnica%20industrial%20urgente';
        wa.className = 'wa-floating';
        wa.target = '_blank';
        wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
        document.body.appendChild(wa);
        
        // Counter Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector('.elementor-counter-number');
                    if (counter) {
                        const target = parseInt(counter.dataset.toValue);
                        let count = 0;
                        const interval = setInterval(() => {
                            count += Math.ceil(target / 40);
                            if (count >= target) {
                                counter.innerText = target;
                                clearInterval(interval);
                            } else {
                                counter.innerText = count;
                            }
                        }, 50);
                    }
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.elementor-widget-counter').forEach(el => observer.observe(el));
    `;
    await tool('elementor-mcp-add-custom-js', {
        post_id: pid,
        js: js,
        wrap_dom_ready: true
    });

    console.log('DONE Polishing.');
}

main().catch(console.error);
