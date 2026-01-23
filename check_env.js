
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');

console.log('Checking environment configuration...');
console.log('Current Directory:', process.cwd());
console.log('Looking for .env.local at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file found!');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    const key = envConfig.GOOGLE_GENAI_API_KEY;

    if (key) {
        console.log('✅ GOOGLE_GENAI_API_KEY found in file.');
        console.log('Key length:', key.length);
        console.log('Key starts with:', key.substring(0, 4) + '...');
        if (key.includes('PLACEHOLDER')) {
            console.error('❌ ERROR: You still have the PLACEHOLDER key. Please edit .env.local!');
        } else {
            console.log('✅ Key looks valid (not a placeholder).');
        }
    } else {
        console.error('❌ ERROR: GOOGLE_GENAI_API_KEY is missing inside .env.local');
    }
} else {
    console.error('❌ ERROR: .env.local file NOT found!');
}
