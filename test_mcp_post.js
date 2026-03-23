
const axios = require('axios');

const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function testMcp() {
    const payload = {
        jsonrpc: "2.0",
        id: "1",
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "example-client",
                version: "1.0.0"
            }
        }
    };

    try {
        console.log('Sending initialize request to MCP server...');
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        console.log('Status Code:', response.status);
        console.log('Response Body:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testMcp();
