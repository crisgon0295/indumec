
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function testListTools() {
    const payload = {
        jsonrpc: "2.0",
        id: "2",
        method: "list_tools",
        params: {}
    };

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
        const data = await response.text();
        console.log(`Response: ${data}`);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

testListTools();
