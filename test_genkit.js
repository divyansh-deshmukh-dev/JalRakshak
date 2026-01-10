
const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');

console.log('genkit:', typeof genkit);
console.log('googleAI:', typeof googleAI);

try {
    const ai = genkit({
        plugins: [googleAI()],
        model: 'googleai/gemini-2.0-flash-exp',
    });
    console.log('Genkit initialized successfully');
} catch (error) {
    console.error('Error initializing Genkit:', error);
}
