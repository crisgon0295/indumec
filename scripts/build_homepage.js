
const fs = require('fs');
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
    const data = await res.json();
    if (data.error) console.error(`MCP Error [${callId}]:`, JSON.stringify(data.error));
    return data;
}

async function tool(name, args) {
    const r = await mcpCall('tools/call', { name, arguments: args });
    const content = r.result?.content?.[0]?.text;
    if (content) {
        try { return JSON.parse(content); } catch { return content; }
    }
    if (r.result?.structuredContent) return r.result.structuredContent;
    return r.result || r.error;
}

async function main() {
    // Init
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-builder", version: "1.0.0" }
    });
    console.log('Session:', sessionId);

    const POST_ID = 7;
    const VIDEO_URL = 'https://indumec.com.co/wp-content/uploads/2026/03/Components_placed_one_202603220857.mp4';
    const LOGO_URL = 'https://indumec.com.co/wp-content/uploads/2026/03/Logo-indumec.jpeg';
    const WA_LINK = 'https://wa.me/573046741878?text=Hola%2C%20necesito%20asesor%C3%ADa%20t%C3%A9cnica%20urgente';

    // ================================================================
    // SECTION 1: HERO — Full-width dark background with video
    // ================================================================
    console.log('\n=== SECTION 1: HERO ===');
    
    const heroContainer = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'full',
            flex_direction: 'row',
            min_height: { size: 100, unit: 'vh' },
            background_background: 'classic',
            background_color: '#0D1B1E',
            padding: { top: '0', right: '0', bottom: '0', left: '0', unit: 'px' },
            overflow: 'hidden'
        }
    });
    const heroId = heroContainer?.element_id;
    console.log('Hero container:', heroId);

    // Hero Left Column (Text content - 50%)
    const heroLeft = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: heroId,
        position: 'end',
        settings: {
            content_width: 'full',
            flex_direction: 'column',
            width: { size: 50, unit: '%' },
            justify_content: 'center',
            padding: { top: '80', right: '60', bottom: '80', left: '80', unit: 'px' },
            z_index: 2
        }
    });
    const heroLeftId = heroLeft?.element_id;
    console.log('Hero left:', heroLeftId);

    // Accent label
    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: {
            title: 'SOLUCIÓN INDUSTRIAL INMEDIATA',
            header_size: 'h6',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 14, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });
    console.log('  + Accent label');

    // Spacer
    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: { space: { size: 20, unit: 'px' } }
    });

    // Main headline
    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: {
            title: 'Tu operación no puede parar. Nosotros tampoco.',
            header_size: 'h1',
            title_color: '#FFFFFF',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 52, unit: 'px' },
            typography_font_size_tablet: { size: 40, unit: 'px' },
            typography_font_size_mobile: { size: 32, unit: 'px' },
            typography_line_height: { size: 1.1, unit: 'em' },
            typography_letter_spacing: { size: -1, unit: 'px' }
        }
    });
    console.log('  + H1 headline');

    // Spacer
    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: { space: { size: 20, unit: 'px' } }
    });

    // Subheadline
    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: {
            editor: '<p style="color: #B0BEC5; font-size: 18px; line-height: 1.7; max-width: 480px;">Mangueras y acoples industriales certificados con asesoría técnica experta y despacho en minutos. Envíanos una foto o medida y te ayudamos de inmediato.</p>'
        }
    });
    console.log('  + Subheadline');

    // Spacer
    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: { space: { size: 30, unit: 'px' } }
    });

    // CTA Buttons container
    const ctaContainer = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: heroLeftId,
        position: 'end',
        settings: {
            flex_direction: 'row',
            content_width: 'full',
            gap: { size: 16, unit: 'px' },
            flex_wrap: 'wrap'
        }
    });
    const ctaContId = ctaContainer?.element_id;

    // WhatsApp CTA
    await tool('elementor-mcp-add-button', {
        post_id: POST_ID,
        parent_id: ctaContId,
        position: 'end',
        settings: {
            text: 'Cotizar por WhatsApp',
            link: { url: WA_LINK, is_external: true },
            button_type: 'default',
            background_color: '#25D366',
            button_text_color: '#FFFFFF',
            border_radius: { top: '8', right: '8', bottom: '8', left: '8', unit: 'px' },
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 16, unit: 'px' },
            button_padding: { top: '16', right: '32', bottom: '16', left: '32', unit: 'px' }
        }
    });
    console.log('  + CTA WhatsApp');

    // Secondary CTA
    await tool('elementor-mcp-add-button', {
        post_id: POST_ID,
        parent_id: ctaContId,
        position: 'end',
        settings: {
            text: 'Solicitar Asesoría',
            link: { url: '#contacto' },
            button_type: 'default',
            background_color: 'transparent',
            button_text_color: '#FFFFFF',
            border_border: 'solid',
            border_width: { top: '2', right: '2', bottom: '2', left: '2', unit: 'px' },
            border_color: '#FFFFFF',
            border_radius: { top: '8', right: '8', bottom: '8', left: '8', unit: 'px' },
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 16, unit: 'px' },
            button_padding: { top: '16', right: '32', bottom: '16', left: '32', unit: 'px' }
        }
    });
    console.log('  + CTA Secondary');

    // Hero Right Column (Video - 50%)
    const heroRight = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: heroId,
        position: 'end',
        settings: {
            content_width: 'full',
            flex_direction: 'column',
            width: { size: 50, unit: '%' },
            justify_content: 'center',
            align_items: 'center',
            overflow: 'hidden'
        }
    });
    const heroRightId = heroRight?.element_id;

    // Video widget
    await tool('elementor-mcp-add-video', {
        post_id: POST_ID,
        parent_id: heroRightId,
        position: 'end',
        settings: {
            video_type: 'hosted',
            hosted_url: { url: VIDEO_URL },
            autoplay: 'yes',
            loop: 'yes',
            mute: 'yes',
            controls: 'no',
            play_on_mobile: 'yes',
            show_image_overlay: 'no'
        }
    });
    console.log('  + Video widget');

    // ================================================================
    // SECTION 2: TRIAGE — "¿Cuál es tu emergencia?"
    // ================================================================
    console.log('\n=== SECTION 2: TRIAGE ===');

    const triageSection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#FAFAF8',
            padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' }
        }
    });
    const triageId = triageSection?.element_id;

    // Triage accent label
    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: triageId,
        position: 'end',
        settings: {
            title: 'IDENTIFICA TU PROBLEMA',
            header_size: 'h6',
            align: 'center',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 13, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: triageId,
        position: 'end',
        settings: { space: { size: 15, unit: 'px' } }
    });

    // Triage title
    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: triageId,
        position: 'end',
        settings: {
            title: '¿Cuál es tu emergencia?',
            header_size: 'h2',
            align: 'center',
            title_color: '#1A2E35',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 42, unit: 'px' },
            typography_letter_spacing: { size: -0.5, unit: 'px' }
        }
    });
    console.log('  + Triage heading');

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: triageId,
        position: 'end',
        settings: { space: { size: 50, unit: 'px' } }
    });

    // Triage cards grid
    const triageGrid = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: triageId,
        position: 'end',
        settings: {
            flex_direction: 'row',
            content_width: 'full',
            flex_wrap: 'wrap',
            gap: { size: 20, unit: 'px' },
            justify_content: 'center'
        }
    });
    const triageGridId = triageGrid?.element_id;

    const problems = [
        { icon: 'fas fa-tint', title: 'Fuga en Manguera', desc: 'Detección y reemplazo inmediato', waMsg: 'Hola%2C%20tengo%20una%20fuga%20en%20manguera%20y%20necesito%20soluci%C3%B3n%20urgente' },
        { icon: 'fas fa-bolt', title: 'Reemplazo de Acople', desc: 'Compatibilidad garantizada', waMsg: 'Hola%2C%20necesito%20un%20reemplazo%20urgente%20de%20acople%20industrial' },
        { icon: 'fas fa-industry', title: 'Parada de Planta', desc: 'Respuesta en minutos', waMsg: 'Hola%2C%20tenemos%20una%20parada%20de%20planta%20y%20necesitamos%20mangueras%20urgente' },
        { icon: 'fas fa-link', title: 'Incompatibilidad', desc: 'Asesoría técnica experta', waMsg: 'Hola%2C%20tengo%20un%20problema%20de%20incompatibilidad%20en%20conexiones' },
        { icon: 'fas fa-clipboard-check', title: 'Auditoría', desc: 'Reposición post-inspección', waMsg: 'Hola%2C%20necesito%20reponer%20mangueras%20tras%20una%20auditor%C3%ADa' }
    ];

    for (const p of problems) {
        await tool('elementor-mcp-add-icon-box', {
            post_id: POST_ID,
            parent_id: triageGridId,
            position: 'end',
            settings: {
                selected_icon: { value: p.icon, library: 'fa-solid' },
                title_text: p.title,
                description_text: p.desc,
                link: { url: `https://wa.me/573046741878?text=${p.waMsg}`, is_external: true },
                position: 'top',
                title_color: '#1A2E35',
                primary_color: '#1B5E3B',
                icon_size: { size: 40, unit: 'px' },
                title_typography_typography: 'custom',
                title_typography_font_family: 'Outfit',
                title_typography_font_weight: '600',
                title_typography_font_size: { size: 18, unit: 'px' }
            }
        });
    }
    console.log('  + 5 triage cards');

    // ================================================================
    // SECTION 3: COMO TRABAJAMOS — 3 Steps
    // ================================================================
    console.log('\n=== SECTION 3: COMO TRABAJAMOS ===');

    const processSection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#1A2E35',
            padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' }
        }
    });
    const processId = processSection?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: processId,
        position: 'end',
        settings: {
            title: 'CÓMO TRABAJAMOS',
            header_size: 'h6',
            align: 'center',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 13, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: processId,
        position: 'end',
        settings: { space: { size: 15, unit: 'px' } }
    });

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: processId,
        position: 'end',
        settings: {
            title: 'De tu problema a la solución en 3 pasos',
            header_size: 'h2',
            align: 'center',
            title_color: '#FFFFFF',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 42, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: processId,
        position: 'end',
        settings: { space: { size: 50, unit: 'px' } }
    });

    // Steps grid
    const stepsGrid = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: processId,
        position: 'end',
        settings: {
            flex_direction: 'row',
            content_width: 'full',
            gap: { size: 30, unit: 'px' },
            flex_wrap: 'wrap',
            justify_content: 'center'
        }
    });
    const stepsGridId = stepsGrid?.element_id;

    const steps = [
        { num: '01', title: 'Envía foto o medida', desc: 'Cuéntanos tu problema por WhatsApp. Puedes enviar fotos, medidas o el código de tu pieza. Te identificamos la referencia correcta.' },
        { num: '02', title: 'Cotización en minutos', desc: 'Sin formalismos innecesarios. Te enviamos precio, disponibilidad y alternativas certificadas en minutos, no en días.' },
        { num: '03', title: 'Despacho inmediato', desc: 'Retira en nuestro punto o te lo enviamos hoy mismo. Tu operación no puede esperar y nosotros lo sabemos.' }
    ];

    for (const s of steps) {
        const stepCard = await tool('elementor-mcp-add-container', {
            post_id: POST_ID,
            parent_id: stepsGridId,
            position: 'end',
            settings: {
                flex_direction: 'column',
                width: { size: 30, unit: '%' },
                min_width: { size: 280, unit: 'px' },
                padding: { top: '40', right: '30', bottom: '40', left: '30', unit: 'px' },
                border_border: 'solid',
                border_width: { top: '1', right: '1', bottom: '1', left: '1', unit: 'px' },
                border_color: 'rgba(255,255,255,0.1)',
                border_radius: { top: '12', right: '12', bottom: '12', left: '12', unit: 'px' }
            }
        });
        const stepCardId = stepCard?.element_id;

        await tool('elementor-mcp-add-heading', {
            post_id: POST_ID,
            parent_id: stepCardId,
            position: 'end',
            settings: {
                title: s.num,
                header_size: 'h3',
                title_color: '#E87C5D',
                typography_typography: 'custom',
                typography_font_family: 'Outfit',
                typography_font_weight: '800',
                typography_font_size: { size: 48, unit: 'px' }
            }
        });

        await tool('elementor-mcp-add-heading', {
            post_id: POST_ID,
            parent_id: stepCardId,
            position: 'end',
            settings: {
                title: s.title,
                header_size: 'h3',
                title_color: '#FFFFFF',
                typography_typography: 'custom',
                typography_font_family: 'Outfit',
                typography_font_weight: '600',
                typography_font_size: { size: 22, unit: 'px' }
            }
        });

        await tool('elementor-mcp-add-text-editor', {
            post_id: POST_ID,
            parent_id: stepCardId,
            position: 'end',
            settings: {
                editor: `<p style="color: #B0BEC5; font-size: 15px; line-height: 1.7;">${s.desc}</p>`
            }
        });
    }
    console.log('  + 3 process steps');

    // ================================================================
    // SECTION 4: INDUSTRIAS
    // ================================================================
    console.log('\n=== SECTION 4: INDUSTRIAS ===');

    const industrySection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#FAFAF8',
            padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' }
        }
    });
    const industryId = industrySection?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: industryId,
        position: 'end',
        settings: {
            title: 'INDUSTRIAS QUE ATENDEMOS',
            header_size: 'h6',
            align: 'center',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 13, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: industryId,
        position: 'end',
        settings: { space: { size: 15, unit: 'px' } }
    });

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: industryId,
        position: 'end',
        settings: {
            title: 'Soluciones técnicas para cada sector',
            header_size: 'h2',
            align: 'center',
            title_color: '#1A2E35',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 42, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: industryId,
        position: 'end',
        settings: { space: { size: 50, unit: 'px' } }
    });

    // Industries grid
    const indGrid = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: industryId,
        position: 'end',
        settings: {
            flex_direction: 'row',
            content_width: 'full',
            gap: { size: 20, unit: 'px' },
            flex_wrap: 'wrap',
            justify_content: 'center'
        }
    });
    const indGridId = indGrid?.element_id;

    const industries = [
        { icon: 'fas fa-cogs', title: 'Manufactura e Industria', desc: 'MRO - Mantenimiento preventivo y correctivo. Reposición inmediata para no detener la producción.' },
        { icon: 'fas fa-hard-hat', title: 'Construcción y Montaje', desc: 'Mangueras y acoples para contratistas. Cumplimos cronogramas de obra con disponibilidad inmediata.' },
        { icon: 'fas fa-seedling', title: 'Agroindustria', desc: 'Sistemas de riego y fumigación. Reposición rápida para no perder productividad en campo.' },
        { icon: 'fas fa-gas-pump', title: 'Combustibles y Utilities', desc: 'Criterio cero fallas. Mangueras certificadas para seguridad y continuidad operativa.' },
        { icon: 'fas fa-fire-extinguisher', title: 'Seguridad Industrial', desc: 'Reemplazos inmediatos tras inspecciones o auditorías. Cumplimiento normativo garantizado.' }
    ];

    for (const ind of industries) {
        await tool('elementor-mcp-add-icon-box', {
            post_id: POST_ID,
            parent_id: indGridId,
            position: 'end',
            settings: {
                selected_icon: { value: ind.icon, library: 'fa-solid' },
                title_text: ind.title,
                description_text: ind.desc,
                position: 'left',
                title_color: '#1A2E35',
                primary_color: '#1B5E3B',
                icon_size: { size: 35, unit: 'px' },
                title_typography_typography: 'custom',
                title_typography_font_family: 'Outfit',
                title_typography_font_weight: '600'
            }
        });
    }
    console.log('  + 5 industry cards');

    // ================================================================
    // SECTION 5: DIFERENCIADORES — Por qué Indumec
    // ================================================================
    console.log('\n=== SECTION 5: DIFERENCIADORES ===');

    const diffSection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'row',
            background_background: 'classic',
            background_color: '#FFFFFF',
            padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' },
            gap: { size: 60, unit: 'px' },
            flex_wrap: 'wrap'
        }
    });
    const diffId = diffSection?.element_id;

    // Left column - text
    const diffLeft = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: diffId,
        position: 'end',
        settings: {
            flex_direction: 'column',
            width: { size: 50, unit: '%' },
            min_width: { size: 300, unit: 'px' },
            justify_content: 'center'
        }
    });
    const diffLeftId = diffLeft?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: diffLeftId,
        position: 'end',
        settings: {
            title: 'POR QUÉ INDUMEC',
            header_size: 'h6',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 13, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: diffLeftId,
        position: 'end',
        settings: { space: { size: 15, unit: 'px' } }
    });

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: diffLeftId,
        position: 'end',
        settings: {
            title: 'No somos un catálogo. Somos tu soporte técnico.',
            header_size: 'h2',
            title_color: '#1A2E35',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 36, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: diffLeftId,
        position: 'end',
        settings: { space: { size: 30, unit: 'px' } }
    });

    // Icon list for differentiators
    await tool('elementor-mcp-add-icon-list', {
        post_id: POST_ID,
        parent_id: diffLeftId,
        position: 'end',
        settings: {
            icon_list: [
                { text: 'Atención humana directa, no formularios', selected_icon: { value: 'fas fa-check-circle', library: 'fa-solid' } },
                { text: 'Te ayudamos a identificar por foto o plano', selected_icon: { value: 'fas fa-check-circle', library: 'fa-solid' } },
                { text: 'Alternativas seguras si no hay stock exacto', selected_icon: { value: 'fas fa-check-circle', library: 'fa-solid' } },
                { text: 'Transparencia total: NIT, dirección, procesos', selected_icon: { value: 'fas fa-check-circle', library: 'fa-solid' } },
                { text: 'Evitamos errores técnicos que cuestan dinero', selected_icon: { value: 'fas fa-check-circle', library: 'fa-solid' } }
            ],
            icon_color: '#1B5E3B',
            icon_size: { size: 18, unit: 'px' },
            space_between: { size: 15, unit: 'px' },
            text_color: '#2D2D2D'
        }
    });
    console.log('  + Differentiators list');

    // Right column - image placeholder
    const diffRight = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: diffId,
        position: 'end',
        settings: {
            flex_direction: 'column',
            width: { size: 45, unit: '%' },
            min_width: { size: 300, unit: 'px' },
            justify_content: 'center',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#F0F4F3',
            border_radius: { top: '16', right: '16', bottom: '16', left: '16', unit: 'px' },
            min_height: { size: 400, unit: 'px' }
        }
    });
    const diffRightId = diffRight?.element_id;

    await tool('elementor-mcp-add-image', {
        post_id: POST_ID,
        parent_id: diffRightId,
        position: 'end',
        settings: {
            image: { url: LOGO_URL, id: 68 },
            image_size: 'medium_large',
            align: 'center',
            width: { size: 80, unit: '%' }
        }
    });
    console.log('  + Logo image');

    // ================================================================
    // SECTION 6: STATS / CONTADORES
    // ================================================================
    console.log('\n=== SECTION 6: STATS ===');

    const statsSection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#0D1B1E',
            padding: { top: '80', right: '40', bottom: '80', left: '40', unit: 'px' }
        }
    });
    const statsId = statsSection?.element_id;

    const statsGrid = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: statsId,
        position: 'end',
        settings: {
            flex_direction: 'row',
            content_width: 'full',
            gap: { size: 30, unit: 'px' },
            flex_wrap: 'wrap',
            justify_content: 'center'
        }
    });
    const statsGridId = statsGrid?.element_id;

    const stats = [
        { num: 15, suffix: '+', title: 'Años de experiencia' },
        { num: 1000, suffix: '+', title: 'Clientes industriales' },
        { num: 30, suffix: ' min', title: 'Tiempo de respuesta' },
        { num: 98, suffix: '%', title: 'Tasa de resolución' }
    ];

    for (const s of stats) {
        await tool('elementor-mcp-add-counter', {
            post_id: POST_ID,
            parent_id: statsGridId,
            position: 'end',
            settings: {
                ending_number: s.num,
                suffix: s.suffix,
                title: s.title,
                number_color: '#FFFFFF',
                title_color: '#B0BEC5',
                typography_typography: 'custom',
                typography_font_family: 'Outfit',
                typography_font_weight: '700',
                typography_font_size: { size: 48, unit: 'px' }
            }
        });
    }
    console.log('  + 4 counters');

    // ================================================================
    // SECTION 7: FORMULARIO DE CONTACTO
    // ================================================================
    console.log('\n=== SECTION 7: CONTACT FORM ===');

    const contactSection = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#FAFAF8',
            padding: { top: '100', right: '40', bottom: '100', left: '40', unit: 'px' }
        }
    });
    const contactId = contactSection?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: {
            title: 'CONTACTO',
            header_size: 'h6',
            align: 'center',
            title_color: '#E87C5D',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 13, unit: 'px' },
            typography_letter_spacing: { size: 3, unit: 'px' },
            typography_text_transform: 'uppercase'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: { space: { size: 15, unit: 'px' } }
    });

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: {
            title: '¿Necesitas asesoría técnica?',
            header_size: 'h2',
            align: 'center',
            title_color: '#1A2E35',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 42, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: {
            editor: '<p style="text-align: center; color: #666; max-width: 600px; margin: 0 auto;">Déjanos tus datos y un asesor técnico te contactará en minutos. Sin compromisos.</p>',
            align: 'center'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: { space: { size: 40, unit: 'px' } }
    });

    // Contact form
    await tool('elementor-mcp-add-form', {
        post_id: POST_ID,
        parent_id: contactId,
        position: 'end',
        settings: {
            form_name: 'Contacto Indumec',
            form_fields: [
                { field_type: 'text', field_label: 'Nombre', placeholder: 'Tu nombre completo', required: 'true', width: '50' },
                { field_type: 'text', field_label: 'Empresa', placeholder: 'Nombre de tu empresa', width: '50' },
                { field_type: 'tel', field_label: 'Teléfono', placeholder: 'Tu número de contacto', required: 'true', width: '50' },
                { field_type: 'email', field_label: 'Email', placeholder: 'correo@empresa.com', width: '50' },
                { field_type: 'textarea', field_label: '¿Qué necesitas?', placeholder: 'Describe brevemente tu necesidad (tipo de manguera, medida, problema, etc.)', required: 'true', width: '100' }
            ],
            button_text: 'Solicitar Asesoría',
            button_size: 'md',
            button_color: '#FFFFFF',
            button_background_color: '#1B5E3B'
        }
    });
    console.log('  + Contact form');

    // ================================================================
    // SECTION 8: FOOTER CTA
    // ================================================================
    console.log('\n=== SECTION 8: FOOTER CTA ===');

    const footerCTA = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'column',
            align_items: 'center',
            background_background: 'classic',
            background_color: '#1B5E3B',
            padding: { top: '80', right: '40', bottom: '80', left: '40', unit: 'px' }
        }
    });
    const footerCTAId = footerCTA?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: footerCTAId,
        position: 'end',
        settings: {
            title: '¿Tu producción está detenida?',
            header_size: 'h2',
            align: 'center',
            title_color: '#FFFFFF',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 36, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: footerCTAId,
        position: 'end',
        settings: {
            editor: '<p style="text-align: center; color: rgba(255,255,255,0.85); font-size: 18px; max-width: 500px; margin: 0 auto;">Escríbenos ahora y te ayudamos a resolver en minutos. Atención humana 24/7.</p>'
        }
    });

    await tool('elementor-mcp-add-spacer', {
        post_id: POST_ID,
        parent_id: footerCTAId,
        position: 'end',
        settings: { space: { size: 30, unit: 'px' } }
    });

    await tool('elementor-mcp-add-button', {
        post_id: POST_ID,
        parent_id: footerCTAId,
        position: 'end',
        settings: {
            text: 'Cotizar por WhatsApp →',
            link: { url: WA_LINK, is_external: true },
            align: 'center',
            background_color: '#FFFFFF',
            button_text_color: '#1B5E3B',
            border_radius: { top: '8', right: '8', bottom: '8', left: '8', unit: 'px' },
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '700',
            typography_font_size: { size: 18, unit: 'px' },
            button_padding: { top: '18', right: '40', bottom: '18', left: '40', unit: 'px' }
        }
    });
    console.log('  + Footer CTA');

    // ================================================================
    // SECTION 9: FOOTER
    // ================================================================
    console.log('\n=== SECTION 9: FOOTER ===');

    const footer = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        position: 'end',
        settings: {
            content_width: 'boxed',
            flex_direction: 'row',
            background_background: 'classic',
            background_color: '#0D1B1E',
            padding: { top: '60', right: '40', bottom: '60', left: '40', unit: 'px' },
            gap: { size: 40, unit: 'px' },
            flex_wrap: 'wrap'
        }
    });
    const footerId = footer?.element_id;

    // Footer left - logo + info
    const footerLeft = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: footerId,
        position: 'end',
        settings: {
            flex_direction: 'column',
            width: { size: 40, unit: '%' },
            min_width: { size: 280, unit: 'px' }
        }
    });
    const footerLeftId = footerLeft?.element_id;

    await tool('elementor-mcp-add-image', {
        post_id: POST_ID,
        parent_id: footerLeftId,
        position: 'end',
        settings: {
            image: { url: LOGO_URL, id: 68 },
            image_size: 'medium',
            width: { size: 200, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: footerLeftId,
        position: 'end',
        settings: {
            editor: '<p style="color: #8899A4; font-size: 14px; line-height: 1.8;">Industria de Mecanizados y Accesorios S.A.S.<br>Bogotá, Colombia<br>NIT: 901.234.567-8</p>'
        }
    });

    // Footer center - links
    const footerCenter = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: footerId,
        position: 'end',
        settings: {
            flex_direction: 'column',
            width: { size: 25, unit: '%' },
            min_width: { size: 200, unit: 'px' }
        }
    });
    const footerCenterId = footerCenter?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: footerCenterId,
        position: 'end',
        settings: {
            title: 'Navegación',
            header_size: 'h6',
            title_color: '#FFFFFF',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 16, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: footerCenterId,
        position: 'end',
        settings: {
            editor: '<p style="color: #8899A4; font-size: 14px; line-height: 2.2;"><a href="#" style="color: #8899A4; text-decoration: none;">Inicio</a><br><a href="#" style="color: #8899A4; text-decoration: none;">Industrias</a><br><a href="#" style="color: #8899A4; text-decoration: none;">Servicios</a><br><a href="#contacto" style="color: #8899A4; text-decoration: none;">Contacto</a></p>'
        }
    });

    // Footer right - contact
    const footerRight = await tool('elementor-mcp-add-container', {
        post_id: POST_ID,
        parent_id: footerId,
        position: 'end',
        settings: {
            flex_direction: 'column',
            width: { size: 30, unit: '%' },
            min_width: { size: 250, unit: 'px' }
        }
    });
    const footerRightId = footerRight?.element_id;

    await tool('elementor-mcp-add-heading', {
        post_id: POST_ID,
        parent_id: footerRightId,
        position: 'end',
        settings: {
            title: 'Contacto',
            header_size: 'h6',
            title_color: '#FFFFFF',
            typography_typography: 'custom',
            typography_font_family: 'Outfit',
            typography_font_weight: '600',
            typography_font_size: { size: 16, unit: 'px' }
        }
    });

    await tool('elementor-mcp-add-text-editor', {
        post_id: POST_ID,
        parent_id: footerRightId,
        position: 'end',
        settings: {
            editor: '<p style="color: #8899A4; font-size: 14px; line-height: 2.2;">📞 +57 304 674 1878<br>📧 gcristian915@gmail.com<br>📍 Bogotá, Colombia</p>'
        }
    });

    await tool('elementor-mcp-add-social-icons', {
        post_id: POST_ID,
        parent_id: footerRightId,
        position: 'end',
        settings: {
            social_icon_list: [
                { social_icon: { value: 'fab fa-whatsapp', library: 'fa-brands' }, link: { url: WA_LINK, is_external: true } },
                { social_icon: { value: 'fab fa-instagram', library: 'fa-brands' }, link: { url: 'https://instagram.com/indumec', is_external: true } },
                { social_icon: { value: 'fab fa-facebook', library: 'fa-brands' }, link: { url: 'https://facebook.com/indumec', is_external: true } }
            ],
            icon_color: 'custom',
            icon_primary_color: '#1B5E3B',
            icon_secondary_color: '#FFFFFF'
        }
    });
    console.log('  + Footer complete');

    // ================================================================
    // SEO SETTINGS
    // ================================================================
    console.log('\n=== UPDATING PAGE SEO SETTINGS ===');

    await tool('elementor-mcp-update-page-settings', {
        post_id: POST_ID,
        settings: {
            post_title: 'Mangueras y Acoples Industriales en Bogotá | Indumec',
            post_status: 'publish'
        }
    });
    console.log('  + Page settings updated');

    console.log('\n========================================');
    console.log('HOME PAGE BUILD COMPLETE!');
    console.log('========================================');
}

main().catch(console.error);
