
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth1 = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpSYXBjb21hbmRvLjEw'; // From .mcp_config.json
const auth2 = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw=='; // From .mcp.json

async function testRequest(auth, label, method = 'initialize') {
    const payload = {
        jsonrpc: "2.0",
        id: "1",
        method: method,
        params: (method === 'initialize') ? {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" }
        } : {}
    };

    console.log(`[${label}] Testing ${method}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

async function runTests() {
    await testRequest(auth1, 'Auth Token 1 (Rapcomando.10)');
    console.log('---');
    await testRequest(auth2, 'Auth Token 2 (PwB4 r5EZ UepS fZIY FuhO KOr7)');
    console.log('---');
    await testRequest(auth2, 'Auth Token 2 - Trying list_tools', 'list_tools');
}

runTests();
