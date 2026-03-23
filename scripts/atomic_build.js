
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

async function main() {
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-atomic-builder", version: "1.0.0" }
    });

    console.log('Building page structure...');

    const structure = [
        // SECTION 1: HERO (Row with 2 columns)
        {
            type: 'container',
            settings: {
                content_width: 'full',
                flex_direction: 'row',
                min_height: { size: 100, unit: 'vh' },
                background_background: 'classic',
                background_color: '#0D1B1E',
                overflow: 'hidden'
            },
            children: [
                // Hero Left
                {
                    type: 'container',
                    settings: {
                        flex_direction: 'column',
                        justify_content: 'center',
                        padding: { top: '80', right: '60', bottom: '80', left: '80', unit: 'px' }
                    },
                    children: [
                        { type: 'widget', widget_type: 'heading', settings: { title: 'SOLUCIÓN INDUSTRIAL INMEDIATA', header_size: 'h6', title_color: '#E87C5D', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '600', typography_font_size: { size: 14, unit: 'px' }, typography_letter_spacing: { size: 3, unit: 'px' }, typography_text_transform: 'uppercase' } },
                        { type: 'widget', widget_type: 'spacer', settings: { space: { size: 20, unit: 'px' } } },
                        { type: 'widget', widget_type: 'heading', settings: { title: 'Tu operación no puede parar. Nosotros tampoco.', header_size: 'h1', title_color: '#FFFFFF', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '700', typography_font_size: { size: 52, unit: 'px' }, typography_line_height: { size: 1.1, unit: 'em' } } },
                        { type: 'widget', widget_type: 'spacer', settings: { space: { size: 20, unit: 'px' } } },
                        { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p style="color: #B0BEC5; font-size: 18px; line-height: 1.7;">Mangueras y acoples industriales con despacho en minutos.</p>' } },
                        { type: 'widget', widget_type: 'spacer', settings: { space: { size: 30, unit: 'px' } } },
                        {
                            type: 'container',
                            settings: { flex_direction: 'row', gap: { size: 16, unit: 'px' } },
                            children: [
                                { type: 'widget', widget_type: 'button', settings: { text: 'Cotizar por WhatsApp', link: { url: WA_LINK, is_external: true }, background_color: '#25D366', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '600', button_padding: { top: '16', right: '32', bottom: '16', left: '32', unit: 'px' } } },
                                { type: 'widget', widget_type: 'button', settings: { text: 'Solicitar Asesoría', link: { url: '#contacto' }, background_color: 'transparent', border_border: 'solid', border_width: { top: '2', right: '2', bottom: '2', left: '2', unit: 'px' }, border_color: '#FFFFFF', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '600', button_padding: { top: '16', right: '32', bottom: '16', left: '32', unit: 'px' } } }
                            ]
                        }
                    ]
                },
                // Hero Right
                {
                    type: 'container',
                    settings: { flex_direction: 'column', justify_content: 'center', align_items: 'center' },
                    children: [
                        { type: 'widget', widget_type: 'video', settings: { video_type: 'hosted', hosted_url: { url: VIDEO_URL }, autoplay: 'yes', loop: 'yes', mute: 'yes', controls: 'no', play_on_mobile: 'yes' } }
                    ]
                }
            ]
        },
        // SECTION 2: TRIAGE
        {
            type: 'container',
            settings: { content_width: 'boxed', flex_direction: 'column', align_items: 'center', background_background: 'classic', background_color: '#FAFAF8', padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' } },
            children: [
                { type: 'widget', widget_type: 'heading', settings: { title: '¿Cuál es tu emergencia?', header_size: 'h2', align: 'center', title_color: '#1A2E35', typography_typography: 'custom', typography_font_family: 'Outfit', typography_font_weight: '700', typography_font_size: { size: 42, unit: 'px' } } },
                { type: 'widget', widget_type: 'spacer', settings: { space: { size: 50, unit: 'px' } } },
                {
                    type: 'container',
                    settings: { flex_direction: 'row', flex_wrap: 'wrap', gap: { size: 20, unit: 'px' }, justify_content: 'center' },
                    children: [
                        { type: 'widget', widget_type: 'icon-box', settings: { selected_icon: { value: 'fas fa-tint', library: 'fa-solid' }, title_text: 'Fuga en Manguera', description_text: 'Detección inmediata', link: { url: WA_LINK, is_external: true }, primary_color: '#1B5E3B' } },
                        { type: 'widget', widget_type: 'icon-box', settings: { selected_icon: { value: 'fas fa-bolt', library: 'fa-solid' }, title_text: 'Reemplazo de Acople', description_text: 'Compatibilidad total', link: { url: WA_LINK, is_external: true }, primary_color: '#1B5E3B' } },
                        { type: 'widget', widget_type: 'icon-box', settings: { selected_icon: { value: 'fas fa-industry', library: 'fa-solid' }, title_text: 'Parada de Planta', description_text: 'Respuesta urgente', link: { url: WA_LINK, is_external: true }, primary_color: '#1B5E3B' } }
                    ]
                }
            ]
        },
        // SECTION 3: FOOTER
        {
            type: 'container',
            settings: { background_background: 'classic', background_color: '#0D1B1E', padding: { top: '60', right: '40', bottom: '60', left: '40', unit: 'px' } },
            children: [
                { type: 'widget', widget_type: 'image', settings: { image: { url: LOGO_URL }, width: { size: 150, unit: 'px' } } },
                { type: 'widget', widget_type: 'text-editor', settings: { editor: '<p style="color: #8899A4;">© 2026 Indumec S.A.S. Todos los derechos reservados.</p>' } }
            ]
        }
    ];

    console.log('Executing elementor-mcp-build-page...');
    const result = await tool('elementor-mcp-build-page', {
        title: 'Home Indumec NEW',
        status: 'publish',
        structure: structure,
        page_settings: {
            template: 'elementor_canvas'
        }
    });

    console.log('Result:', JSON.stringify(result, null, 2));

    if (result && result.post_id) {
        console.log(`\nNew Page ID: ${result.post_id}`);
        
        // Update front page settings
        console.log('Updating WordPress settings to use new page...');
        const updateSettings = await fetch(`${WP_API}/settings`, {
            method: 'POST',
            headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                show_on_front: 'page',
                page_on_front: result.post_id
            })
        });
        
        if (updateSettings.ok) {
            console.log('SUCCESS: New page is now the static home page.');
            console.log(`View it at: https://indumec.com.co/`);
        } else {
            console.error('FAILED to update settings:', await updateSettings.text());
        }
    }
}

main().catch(console.error);
