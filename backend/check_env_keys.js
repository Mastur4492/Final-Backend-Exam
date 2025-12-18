const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const keys = lines.map(line => {
        const match = line.match(/^([^=]+)=/);
        return match ? match[1] : null;
    }).filter(Boolean);

    console.log('Keys in .env:', keys);
} catch (err) {
    console.error('Error reading .env:', err.message);
}
