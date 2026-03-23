
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';
const fs = require('fs');

let sessionId = null;

async function mcpCall(method, params = {}, id = 1) {
    const headers = {
        'Authorization': auth,
        'Content-Type': 'application/json'
    };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ jsonrpc: "2.0", id, method, params })
    });

    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;

    return res.json();
}

async function main() {
    const init = await mcpCall('initialize', {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
    });

    // List pages
    const pages = await mcpCall('tools/call', {
        name: 'elementor-mcp-list-pages',
        arguments: {}
    }, 2);

    // Page structure
    const structure = await mcpCall('tools/call', {
        name: 'elementor-mcp-get-page-structure',
        arguments: { post_id: 7 }
    }, 3);

    // Tools list
    const tools = await mcpCall('tools/list', {}, 4);

    const output = {
        pages: pages.result,
        structure: structure.result,
        toolNames: tools.result?.tools?.map(t => t.name) || []
    };

    fs.writeFileSync('d:\\Indumec\\elementor_state.json', JSON.stringify(output, null, 2));
    console.log('Saved to elementor_state.json');
    console.log('Tool count:', output.toolNames.length);
}

main();
