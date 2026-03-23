
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function test(method, extraHeaders = {}) {
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

    console.log(`\n--- Testing ${method} ---`);
    console.log(`Headers: ${JSON.stringify(extraHeaders)}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                ...extraHeaders
            },
            body: JSON.stringify(payload)
        });

        console.log(`HTTP Status: ${response.status}`);
        const data = await response.text();
        console.log(`Response Text: ${data}`);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

async function runTests() {
    await test('initialize');
    await test('initialize', { 'Mcp-Session-Id': 'test-session-123' });
}

runTests();
