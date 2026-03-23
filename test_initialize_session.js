
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function testInitializeWithSession() {
    const payload = {
        jsonrpc: "2.0",
        id: "4",
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Mcp-Session-Id': 'test-session-val'
            },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status}`);
        const data = await response.text();
        console.log(`Response: ${data}`);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

testInitializeWithSession();
