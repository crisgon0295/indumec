
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';
const fs = require('fs');

let sessionId = null;

async function mcpCall(method, params = {}, id = 1) {
    const headers = { 'Authorization': auth, 'Content-Type': 'application/json' };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
    const res = await fetch(url, {
        method: 'POST', headers,
        body: JSON.stringify({ jsonrpc: "2.0", id, method, params })
    });
    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;
    return res.json();
}

async function toolCall(name, args, id) {
    const r = await mcpCall('tools/call', { name, arguments: args }, id);
    return r;
}

async function main() {
    // Init session
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-builder", version: "1.0.0" }
    });

    // Step 1: Delete existing content on Home page
    console.log('=== Clearing Home page content ===');
    const clear = await toolCall('elementor-mcp-delete-page-content', { post_id: 7 }, 2);
    console.log(JSON.stringify(clear.result || clear.error, null, 2));

    // Step 2: Set global colors
    console.log('\n=== Setting global colors ===');
    const colors = await toolCall('elementor-mcp-update-global-colors', {
        colors: [
            { id: "primary", color: "#1B5E3B", label: "Azul Electro" },
            { id: "secondary", color: "#2E8B57", label: "Verde Industrial" },
            { id: "accent", color: "#E87C5D", label: "Warm Coral" },
            { id: "text", color: "#2D2D2D", label: "Grafito" },
            { id: "text_secondary", color: "#808080", label: "Gris Acero" }
        ]
    }, 3);
    console.log(JSON.stringify(colors.result || colors.error, null, 2));

    // Step 3: Set global typography
    console.log('\n=== Setting global typography ===');
    const typo = await toolCall('elementor-mcp-update-global-typography', {
        typography: [
            {
                id: "primary",
                label: "Primary Headlines",
                typography_font_family: "Outfit",
                typography_font_weight: "700",
                typography_font_size: { size: 48, unit: "px" },
                typography_letter_spacing: { size: -0.5, unit: "px" }
            },
            {
                id: "secondary", 
                label: "Secondary Headlines",
                typography_font_family: "Outfit",
                typography_font_weight: "600",
                typography_font_size: { size: 32, unit: "px" }
            },
            {
                id: "text",
                label: "Body Text",
                typography_font_family: "Outfit",
                typography_font_weight: "400",
                typography_font_size: { size: 16, unit: "px" },
                typography_line_height: { size: 1.7, unit: "em" }
            },
            {
                id: "accent",
                label: "Accent Labels",
                typography_font_family: "Outfit",
                typography_font_weight: "600",
                typography_font_size: { size: 14, unit: "px" },
                typography_letter_spacing: { size: 2, unit: "px" },
                typography_text_transform: "uppercase"
            }
        ]
    }, 4);
    console.log(JSON.stringify(typo.result || typo.error, null, 2));

    console.log('\n=== Foundation complete ===');
}

main().catch(console.error);
