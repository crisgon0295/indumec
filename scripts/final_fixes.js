
const url = 'https://indumec.com.co/wp-json/mcp/elementor-mcp-server';
const WP_API = 'https://indumec.com.co/wp-json/wp/v2';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';
const pid = 76;

async function main() {
    console.log('Final Fixes for Page 76...');

    // 1. Update Post Title via WP API (not Elementor)
    console.log('Updating WP Post Title...');
    const title = 'Mangueras y Acoples Industriales en Bogotá | Entrega Inmediata — Indumec';
    await fetch(`${WP_API}/pages/${pid}`, {
        method: 'POST',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
    });

    // 2. Inject Robust WhatsApp Button (SVG)
    console.log('Injecting SVG WhatsApp Button...');
    const js = `
        (function() {
            // Remove existing if any
            const existing = document.querySelector('.wa-floating-btn');
            if (existing) existing.remove();

            const wa = document.createElement('a');
            wa.href = 'https://wa.me/573046741878?text=Hola%2C%20necesito%20asesor%C3%ADa%20t%C3%A9cnica%20industrial%20urgente';
            wa.className = 'wa-floating-btn';
            wa.target = '_blank';
            wa.style.cssText = 'position:fixed; bottom:30px; right:30px; width:60px; height:60px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:999999; animation: pulse 2s infinite;';
            wa.innerHTML = '<svg style="width:35px; height:35px; fill:white;" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.406c0 6.556-5.333 11.888-11.888 11.888-2.01 0-3.986-.51-5.742-1.477l-6.142 1.7zm6.056-4.047l.35.207c1.644.975 3.541 1.489 5.482 1.49 5.451 0 9.888-4.437 9.888-9.888 0-2.639-1.028-5.12-2.894-6.985s-4.347-2.894-6.986-2.894c-5.451 0-9.888 4.437-9.888 9.888 0 2.01.61 3.967 1.763 5.62l.228.327-.88 3.213 3.32-.871zm11.236-6.613c-.26-.13-1.541-.759-1.778-.845-.236-.088-.41-.131-.581.13-.172.261-.664.845-.814 1.018-.149.172-.298.194-.559.064-.26-.13-1.097-.404-2.09-1.288-.771-.689-1.291-1.541-1.442-1.799-.152-.26-.016-.401.114-.531.117-.117.26-.304.39-.456.129-.152.173-.261.26-.435.088-.174.044-.326-.021-.456-.065-.13-.581-1.399-.796-1.921-.21-.504-.423-.435-.581-.444-.149-.009-.321-.01-.493-.01-.172 0-.453.065-.69.321-.237.256-.906.885-.906 2.158 0 1.273.926 2.503 1.056 2.677.129.174 1.822 2.783 4.413 3.897.616.265 1.096.423 1.47.543.619.196 1.183.169 1.628.102.497-.074 1.541-.63 1.758-1.238.217-.608.217-1.129.152-1.238-.065-.11-.237-.172-.497-.302z"/></svg>';
            
            // Add pulse animation
            const style = document.createElement('style');
            style.innerHTML = \`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }
            \`;
            document.head.appendChild(style);
            document.body.appendChild(wa);
        })();
    `;

    // Inject JS via MCP
    const headers = { 'Authorization': auth, 'Content-Type': 'application/json' };
    await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            jsonrpc: "2.0", id: 999,
            method: 'tools/call',
            params: {
                name: 'elementor-mcp-add-custom-js',
                arguments: { post_id: pid, js: js, wrap_dom_ready: true }
            }
        })
    });

    console.log('Final fixes applied.');
}

main().catch(console.error);
