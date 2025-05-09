const fs = require('fs');
const crypto = require('crypto');

// Set a static encryption key (make sure you keep this safe)
const ENCRYPTION_KEY = Buffer.from('your-static-32-byte-key-here-your-static-32-byte-key-here', 'utf8'); // 256-bit key
const IV = crypto.randomBytes(16); // 128-bit IV

const envData = fs.readFileSync('.env', 'utf8');
const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);

let encrypted = cipher.update(envData, 'utf8', 'hex');
encrypted += cipher.final('hex');

fs.writeFileSync('.env.enc', JSON.stringify({ iv: IV.toString('hex'), content: encrypted }));
fs.writeFileSync('env.key', ENCRYPTION_KEY.toString('hex'));

fs.unlinkSync('.env');
console.log('✅ .env encrypted successfully. Key saved to env.key.');
