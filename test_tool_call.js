
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function runToolCall() {
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

        const callPayload = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: "elementor-mcp-list-pages",
                arguments: {}
            }
        };

        const callRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Mcp-Session-Id': sessionId
            },
            body: JSON.stringify(callPayload)
        });

        const callData = await callRes.json();
        console.log('Tool Call Response Status:', callRes.status);
        if (callData.result && callData.result.content) {
            console.log('Success! Result:', JSON.stringify(callData.result.content, null, 2));
        } else {
            console.log('Error:', JSON.stringify(callData.error || callData, null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}

runToolCall();
