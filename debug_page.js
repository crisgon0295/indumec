
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
    return r;
}

async function main() {
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-debug", version: "1.0.0" }
    });

    // 1. Get page structure with full details
    console.log('=== Getting full page structure ===');
    const structure = await tool('elementor-mcp-get-page-structure', { post_id: 7 });
    const fs = require('fs');
    fs.writeFileSync('d:\\Indumec\\page_structure.json', JSON.stringify(structure, null, 2));
    console.log('Saved page structure to page_structure.json');
    
    // Check if Elementor sees elements
    const structuredContent = structure.result?.structuredContent;
    if (structuredContent) {
        const elCount = JSON.stringify(structuredContent).match(/"elType"/g)?.length || 0;
        console.log('Elements found:', elCount);
    }

    // 2. Get the build-page schema
    console.log('\n=== Getting build-page schema ===');
    const schema = await tool('elementor-mcp-get-widget-schema', { widget_type: 'build-page' });
    console.log('Schema:', JSON.stringify(schema).substring(0, 500));

    // 3. Export the page to check its actual data
    console.log('\n=== Exporting current page ===');
    const exported = await tool('elementor-mcp-export-page', { post_id: 7 });
    fs.writeFileSync('d:\\Indumec\\page_export.json', JSON.stringify(exported, null, 2));
    console.log('Exported page data saved');
}

main().catch(console.error);
