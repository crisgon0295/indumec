
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const WP_API = 'https://indumec.com.co/wp-json/wp/v2';
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
    return r.result;
}

const VIDEO_URL = 'https://indumec.com.co/wp-content/uploads/2026/03/Components_placed_one_202603220857.mp4';
const LOGO_URL = 'https://indumec.com.co/wp-content/uploads/2026/03/Logo-indumec.jpeg';
const WA_LINK = 'https://wa.me/573046741878?text=Hola%2C%20necesito%20asesor%C3%ADa%20t%C3%A9cnica%20urgente';

// Helper for typical container
const sectionContainer = (settings, children) => ({
    type: 'container',
    settings: {
        content_width: 'boxed',
        padding: { top: '80', right: '40', bottom: '80', left: '40', unit: 'px' },
        ...settings
    },
    children
});

const heading = (title, level = 'h2', color = '#1A2E35', size = 36) => ({
    type: 'widget',
    widget_type: 'heading',
    settings: {
        title,
        header_size: level,
        title_color: color,
        typography_typography: 'custom',
        typography_font_family: 'Outfit',
        typography_font_weight: '700',
        typography_font_size: { size, unit: 'px' }
    }
});

async function main() {
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-final-builder", version: "1.0.0" }
    });

    console.log('Constructing full page structure...');

    const structure = [
        // 1. HERO
        {
            type: 'container',
            settings: {
                content_width: 'full', flex_direction: 'row', min_height: { size: 100, unit: 'vh' },
                background_background: 'classic', background_color: '#0D1B1E', overflow: 'hidden'
            },
            children: [
                {
                    type: 'container',
                    settings: { flex_direction: 'column', justify_content: 'center', padding: { top: '80', right: '60', bottom: '80', left: '80', unit: 'px' } },
                    children: [
                        { type: 'widget', widget_type: 'heading', settings: { title: 'SOLUCIÓN INDUSTRIAL INMEDIATA', header_size: 'h6', title_color: '#E87C5D', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '600', typography_font_size: { size: 14, unit: 'px' }, typography_letter_spacing: { size: 3, unit: 'px' }, typography_text_transform: 'uppercase' } },
                        heading('Tu operación no puede parar. Nosotros tampoco.', 'h1', '#FFFFFF', 52),
                        { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p style="color: #B0BEC5; font-size: 18px; line-height: 1.7;">Mangueras y acoples industriales con despacho en minutos.</p>' } },
                        {
                            type: 'container',
                            settings: { flex_direction: 'row', gap: { size: 16, unit: 'px' }, margin: { top: '30', unit: 'px' } },
                            children: [
                                { type: 'widget', widget_type: 'button', settings: { text: 'Cotizar por WhatsApp', link: { url: WA_LINK, is_external: true }, background_color: '#25D366' } },
                                { type: 'widget', widget_type: 'button', settings: { text: 'Solicitar Asesoría', link: { url: '#contacto' }, background_color: 'transparent', border_border: 'solid', border_width: { top: '2', unit: 'px' }, border_color: '#FFFFFF' } }
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    settings: { flex_direction: 'column', justify_content: 'center' },
                    children: [
                        { type: 'widget', widget_type: 'video', settings: { video_type: 'hosted', hosted_url: { url: VIDEO_URL }, autoplay: 'yes', loop: 'yes', mute: 'yes', controls: 'no', play_on_mobile: 'yes' } }
                    ]
                }
            ]
        },
        // 2. TRIAGE
        sectionContainer({ background_background: 'classic', background_color: '#FAFAF8' }, [
            heading('¿Cuál es tu emergencia?', 'h2', '#1A2E35', 42),
            {
                type: 'container',
                settings: { flex_direction: 'row', gap: { size: 20, unit: 'px' }, margin: { top: '40', unit: 'px' } },
                children: [
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: 'Fuga en Manguera', description_text: 'Detección inmediata', selected_icon: { value: 'fas fa-tint', library: 'fa-solid' }, primary_color: '#1B5E3B' } },
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: 'Reemplazo Urgente', description_text: 'Compatibilidad total', selected_icon: { value: 'fas fa-bolt', library: 'fa-solid' }, primary_color: '#1B5E3B' } },
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: 'Parada de Planta', description_text: 'Respuesta urgente', selected_icon: { value: 'fas fa-industry', library: 'fa-solid' }, primary_color: '#1B5E3B' } }
                ]
            }
        ]),
        // 3. PROCESS (3 steps)
        sectionContainer({ background_background: 'classic', background_color: '#FFFFFF' }, [
            heading('Cómo trabajamos', 'h2', '#1A2E35', 42),
            {
                type: 'container',
                settings: { flex_direction: 'row', gap: { size: 30, unit: 'px' }, margin: { top: '40', unit: 'px' } },
                children: [
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: '1. Envía foto o medida', description_text: 'Identificamos la referencia exacta por ti.', selected_icon: { value: 'fas fa-camera', library: 'fa-solid' }, primary_color: '#E87C5D' } },
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: '2. Cotización rápida', description_text: 'En minutos tienes tu presupuesto formal.', selected_icon: { value: 'fas fa-file-invoice-dollar', library: 'fa-solid' }, primary_color: '#E87C5D' } },
                    { type: 'widget', widget_type: 'icon-box', settings: { title_text: '3. Despacho en minutos', description_text: 'Recoge en planta o te lo enviamos volando.', selected_icon: { value: 'fas fa-shipping-fast', library: 'fa-solid' }, primary_color: '#E87C5D' } }
                ]
            }
        ]),
        // 4. INDUSTRIES
        sectionContainer({ background_background: 'classic', background_color: '#1A2E35' }, [
            heading('Sectores que atendemos', 'h2', '#FFFFFF', 42),
            {
                type: 'container',
                settings: { flex_direction: 'row', flex_wrap: 'wrap', gap: { size: 10, unit: 'px' }, margin: { top: '30', unit: 'px' } },
                children: [
                    { type: 'widget', widget_type: 'button', settings: { text: 'Manufactura e Industria', background_color: 'rgba(255,255,255,0.1)', typography_font_size: { size: 18, unit: 'px' } } },
                    { type: 'widget', widget_type: 'button', settings: { text: 'Minería y Construcción', background_color: 'rgba(255,255,255,0.1)', typography_font_size: { size: 18, unit: 'px' } } },
                    { type: 'widget', widget_type: 'button', settings: { text: 'Alimentos y Bebidas', background_color: 'rgba(255,255,255,0.1)', typography_font_size: { size: 18, unit: 'px' } } },
                    { type: 'widget', widget_type: 'button', settings: { text: 'Energía y Petróleo', background_color: 'rgba(255,255,255,0.1)', typography_font_size: { size: 18, unit: 'px' } } }
                ]
            }
        ]),
        // 5. STATS
        sectionContainer({ background_background: 'classic', background_color: '#FAFAF8' }, [
            {
                type: 'container',
                settings: { flex_direction: 'row', justify_content: 'space-around', align_items: 'center' },
                children: [
                    { type: 'widget', widget_type: 'counter', settings: { starting_number: 0, ending_number: 15, title: 'Años de Experiencia', number_color: '#1B5E3B' } },
                    { type: 'widget', widget_type: 'counter', settings: { starting_number: 0, ending_number: 1000, title: 'Clientes Industriales', number_color: '#1B5E3B' } },
                    { type: 'widget', widget_type: 'counter', settings: { starting_number: 0, ending_number: 99, title: '% Efectividad', number_color: '#1B5E3B' } }
                ]
            }
        ]),
        // 6. CONTACT FORM
        sectionContainer({ id: 'contacto', background_background: 'classic', background_color: '#FFFFFF' }, [
            heading('Solicita Asesoría Técnica', 'h2', '#1A2E35', 42),
            { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p>Déjanos tus datos y un experto te contactará en menos de 30 minutos.</p>' } },
            { 
               type: 'widget', 
               widget_type: 'html', 
               settings: { 
                 html: `
                 <form style="display: grid; gap: 15px; max-width: 500px; margin-top: 20px;">
                    <input type="text" placeholder="Nombre completo" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="email" placeholder="Correo corporativo" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="tel" placeholder="Teléfono" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                    <textarea placeholder="¿Qué manguera o acople necesitas?" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;"></textarea>
                    <button type="button" style="background: #1B5E3B; color: white; padding: 15px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">ENVIAR SOLICITUD</button>
                 </form>
                 `
               } 
            }
        ]),
        // 7. FOOTER
        {
            type: 'container',
            settings: { background_background: 'classic', background_color: '#0D1B1E', padding: { top: '60', right: '40', bottom: '60', left: '40', unit: 'px' } },
            children: [
                {
                    type: 'container',
                    settings: { flex_direction: 'row', justify_content: 'space-between', align_items: 'center' },
                    children: [
                        { type: 'widget', widget_type: 'image', settings: { image: { url: LOGO_URL }, width: { size: 150, unit: 'px' } } },
                        { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p style="color: #8899A4;">Bogotá, Colombia | Calle 123 #45-67<br>PBX: (601) 123 4567 | WhatsApp: +57 304 6741878</p>' } }
                    ]
                },
                { type: 'widget', widget_type: 'divider', settings: { color: 'rgba(255,255,255,0.1)', space: { size: 40, unit: 'px' } } },
                { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p style="color: #546E7A; text-align: center; font-size: 14px;">© 2026 Indumec S.A.S. | Mangueras y Acoples Industriales</p>' } }
            ]
        }
    ];

    console.log('Building NEW Final Home Page...');
    const buildRes = await tool('elementor-mcp-build-page', {
        title: 'Home Indumec FINAL',
        status: 'publish',
        structure: structure,
        page_settings: {
            template: 'elementor_canvas'
        }
    });

    const result = (typeof buildRes === 'string') ? JSON.parse(buildRes) : buildRes;

    if (result && result.post_id) {
        const pid = result.post_id;
        console.log(`Page created with ID: ${pid}`);

        // 1. Set as front page
        console.log('Setting as front page...');
        await fetch(`${WP_API}/settings`, {
            method: 'POST',
            headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
            body: JSON.stringify({ show_on_front: 'page', page_on_front: pid })
        });

        // 2. Set SEO Title/Meta
        console.log('Setting SEO metadata...');
        await tool('elementor-mcp-update-page-settings', {
            post_id: pid,
            settings: {
                post_title: 'Mangueras y Acoples Industriales en Bogotá | Entrega Inmediata — Indumec',
                _elementor_page_title: 'Mangueras y Acoples Industriales en Bogotá | Entrega Inmediata — Indumec',
                _description: 'Solución técnica urgente para tu industria. Mangueras, acoples y accesorios certificados con asesoría y despacho en minutos. Cotiza por WhatsApp.'
            }
        });

        // 3. Inject Premium CSS
        console.log('Injecting Premium CSS...');
        const customCss = "/* Animations */ .elementor-heading-title { transition: all 0.5s ease; } .elementor-container:hover .elementor-heading-title { transform: translateY(-5px); } /* Glassmorphism Triage Cards */ .elementor-widget-icon-box { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s ease; } .elementor-widget-icon-box:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); } /* Industrial Buttons */ .elementor-button { border-radius: 4px !important; font-weight: 700 !important; letter-spacing: 1px; text-transform: uppercase; }";
        
        await tool('elementor-mcp-add-custom-css', {
            post_id: pid,
            css: customCss
        });

        console.log('DONE! Site is live at https://indumec.com.co/');
    } else {
        console.error('FAILED to build page:', result);
    }
}

main().catch(console.error);
