
async function run() {
    try {
        console.log('Importing genkit core...');
        const { genkit } = await import('genkit');
        console.log('Genkit core imported:', typeof genkit);
    } catch (e) {
        console.error('Failed to import genkit:', e);
    }

    try {
        console.log('Importing google-genai plugin...');
        const { googleAI } = await import('@genkit-ai/google-genai');
        console.log('Plugin imported:', typeof googleAI);
    } catch (e) {
        console.error('Failed to import google-genai:', e);
    }
}

run();
