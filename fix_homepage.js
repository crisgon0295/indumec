
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const WP_API = 'https://indumec.com.co/wp-json/wp/v2';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';
let sessionId = null;
let callId = 0;

async function mcpCall(method, params = {}) {
    callId++;
    const headers = { 'Authorization': auth, 'Content-Type': 'application/json' };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
    const res = await fetch(url, {
        method: 'POST', headers,
        body: JSON.stringify({ jsonrpc: "2.0", id: callId, method, params })
    });
    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;
    return res.json();
}

async function tool(name, args) {
    const r = await mcpCall('tools/call', { name, arguments: args });
    const content = r.result?.content?.[0]?.text;
    if (content) { try { return JSON.parse(content); } catch { return content; } }
    return r.result || r.error;
}

async function main() {
    // Init MCP session
    await mcpCall('initialize', {
        protocolVersion: "2024-11-05", capabilities: {},
        clientInfo: { name: "indumec-fixer", version: "1.0.0" }
    });

    // 1. Check current page structure
    console.log('=== Checking current page structure ===');
    const structure = await tool('elementor-mcp-get-page-structure', { post_id: 7 });
    console.log('Structure elements count:', JSON.stringify(structure).length);
    console.log('Structure:', JSON.stringify(structure, null, 2).substring(0, 500));

    // 2. Check WP settings
    console.log('\n=== Checking WP settings ===');
    const settingsRes = await fetch(`${WP_API}/settings`, {
        headers: { 'Authorization': auth }
    });
    if (settingsRes.ok) {
        const settings = await settingsRes.json();
        console.log('show_on_front:', settings.show_on_front);
        console.log('page_on_front:', settings.page_on_front);
    } else {
        console.log('Settings check failed:', settingsRes.status);
    }

    // 3. Check page 7 details
    console.log('\n=== Checking page 7 details ===');
    const pageRes = await fetch(`${WP_API}/pages/7`, {
        headers: { 'Authorization': auth }
    });
    if (pageRes.ok) {
        const page = await pageRes.json();
        console.log('Title:', page.title.rendered);
        console.log('Status:', page.status);
        console.log('Template:', page.template);
        console.log('Content length:', page.content.rendered.length);
        console.log('Content preview:', page.content.rendered.substring(0, 200));
        // Check elementor meta
        const metaRes = await fetch(`${WP_API}/pages/7?_fields=meta`, {
            headers: { 'Authorization': auth }
        });
        if (metaRes.ok) {
            const meta = await metaRes.json();
            console.log('Meta:', JSON.stringify(meta.meta));
        }
    }

    // 4. Fix: Set page as static front page
    console.log('\n=== Setting page 7 as static front page ===');
    const updateSettings = await fetch(`${WP_API}/settings`, {
        method: 'POST',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            show_on_front: 'page',
            page_on_front: 7
        })
    });
    if (updateSettings.ok) {
        const result = await updateSettings.json();
        console.log('Updated show_on_front:', result.show_on_front);
        console.log('Updated page_on_front:', result.page_on_front);
    } else {
        console.log('Failed:', await updateSettings.text());
    }

    // 5. Set Elementor page template
    console.log('\n=== Setting Elementor Canvas template ===');
    const templRes = await fetch(`${WP_API}/pages/7`, {
        method: 'POST',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            template: 'elementor_canvas'
        })
    });
    if (templRes.ok) {
        const tResult = await templRes.json();
        console.log('Template set to:', tResult.template);
    } else {
        console.log('Template update failed:', await templRes.text());
    }

    console.log('\n=== DONE ===');
}

main().catch(console.error);
