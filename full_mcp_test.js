
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const authConfigs = [
    { label: '.mcp_config.json (Rapcomando.10)', auth: 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpSYXBjb21hbmRvLjEw' },
    { label: '.mcp.json (Application Password)', auth: 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==' }
];

async function runFullTest() {
    for (const config of authConfigs) {
        console.log(`\n=== Testing Connection with ${config.label} ===`);
        
        // 1. Initialize
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
            console.log('Sending initialize...');
            const initRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': config.auth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(initPayload)
            });

            console.log(`HTTP Status: ${initRes.status}`);
            if (initRes.status === 401) {
                console.log('Error: 401 Unauthorized. This credential might be incorrect or not an Application Password.');
                continue;
            }

            const initData = await initRes.json();
            console.log('Initialize Response Body:', JSON.stringify(initData, null, 2));

            const sessionId = initRes.headers.get('mcp-session-id');
            if (!sessionId) {
                console.log('Warning: No mcp-session-id found in response headers.');
                // Some implementations might not use it if not configured, but let's see.
            } else {
                console.log(`Session established: ${sessionId}`);
            }

            // 2. List Tools
            console.log('\nSending list_tools...');
            const listPayload = {
                jsonrpc: "2.0",
                id: 2,
                method: "list_tools",
                params: {}
            };

            const headers = {
                'Authorization': config.auth,
                'Content-Type': 'application/json'
            };
            if (sessionId) {
                headers['Mcp-Session-Id'] = sessionId;
            }

            const listRes = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(listPayload)
            });

            console.log(`HTTP Status: ${listRes.status}`);
            const listData = await listRes.json();
            if (listData.result && listData.result.tools) {
                console.log(`Success! Found ${listData.result.tools.length} tools.`);
                console.log('First 5 tools:', listData.result.tools.slice(0, 5).map(t => t.name).join(', '));
            } else {
                console.log('Error in list_tools:', JSON.stringify(listData, null, 2));
            }

        } catch (e) {
            console.error(`Error during test: ${e.message}`);
        }
    }
}

runFullTest();
