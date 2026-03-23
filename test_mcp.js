
import axios from 'axios';

const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpSYXBjb21hbmRvLjEw';

async function testConnection() {
    try {
        console.log(`Testing connection to ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error connecting to MCP server:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testConnection();
