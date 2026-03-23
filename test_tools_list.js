
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function runListTools() {
    const initPayload = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" }
        }
    };

    try {
        const initRes = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
            body: JSON.stringify(initPayload)
        });

        const sessionId = initRes.headers.get('mcp-session-id');
        console.log(`Session: ${sessionId}`);

        const listPayload = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list", // Correct method name
            params: {}
        };

        const listRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Mcp-Session-Id': sessionId
            },
            body: JSON.stringify(listPayload)
        });

        console.log(`HTTP Status: ${listRes.status}`);
        const listData = await listRes.json();
        if (listData.result && listData.result.tools) {
            console.log(`Success! Found ${listData.result.tools.length} tools.`);
            console.log('Tools discovered:', listData.result.tools.map(t => t.name).join(', '));
        } else {
            console.log('Error:', JSON.stringify(listData, null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}

runListTools();
