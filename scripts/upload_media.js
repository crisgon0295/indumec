
const fs = require('fs');
const path = require('path');

const WP_URL = 'https://indumec.com.co';
const auth = 'Basic Z2NyaXN0aWFuOTE1QGdtYWlsLmNvbTpQd0I0IHI1RVogVWVwUyBmWklZIEZ1aE8gS09yNw==';

async function uploadMedia(filePath) {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    
    const mimeTypes = {
        '.mp4': 'video/mp4',
        '.webp': 'image/webp',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.png': 'image/png'
    };
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    console.log(`Uploading ${fileName} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)...`);

    const response = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': mimeType
        },
        body: fileBuffer
    });

    const data = await response.json();
    if (response.ok) {
        console.log(`Uploaded: ${data.source_url}`);
        return data;
    } else {
        console.error(`Error: ${JSON.stringify(data)}`);
        return null;
    }
}

async function main() {
    // Upload video
    const video = await uploadMedia('d:\\Indumec\\Components_placed_one_202603220857.mp4');
    if (video) {
        console.log('\nVideo URL:', video.source_url);
        console.log('Video ID:', video.id);
    }

    // Upload logo
    const logo = await uploadMedia('d:\\Indumec\\Logo\\Logo indumec.jpeg');
    if (logo) {
        console.log('\nLogo URL:', logo.source_url);
        console.log('Logo ID:', logo.id);
    }

    // Save URLs for reference
    const urls = {
        video: video ? { url: video.source_url, id: video.id } : null,
        logo: logo ? { url: logo.source_url, id: logo.id } : null
    };
    fs.writeFileSync('d:\\Indumec\\media_urls.json', JSON.stringify(urls, null, 2));
    console.log('\nSaved to media_urls.json');
}

main().catch(console.error);
