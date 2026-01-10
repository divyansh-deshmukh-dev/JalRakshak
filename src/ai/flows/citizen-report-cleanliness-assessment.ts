
'use server';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * @fileOverview Assesses the cleanliness of a citizen-submitted water quality report using Gemini SDK.
 */

import { z } from 'zod';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Input Schema
const CitizenReportInputSchema = z.object({
  photoDataUri: z.string().describe("Base64 encoded data URI of the photo"),
  ward: z.string(),
  description: z.string().optional(),
});
export type CitizenReportInput = z.infer<typeof CitizenReportInputSchema>;

// Output Schema
export type CitizenReportOutput = {
  cleanlinessScore: number;
  statusLabel: string;
  estimatedPH: number;
  estimatedTurbidity: number;
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

export async function assessCleanliness(
  input: CitizenReportInput
): Promise<CitizenReportOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            cleanlinessScore: {
              type: SchemaType.NUMBER,
              description: 'Score 0-1 (1 is cleanest)',
            },
            statusLabel: {
              type: SchemaType.STRING,
              description: 'Safe, Moderate, or Unsafe',
            },
            estimatedPH: {
              type: SchemaType.NUMBER,
              description: 'Estimated pH (0-14)',
            },
            estimatedTurbidity: {
              type: SchemaType.NUMBER,
              description: 'Estimated Turbidity in NTU',
            },
          },
          required: ['cleanlinessScore', 'statusLabel', 'estimatedPH', 'estimatedTurbidity'],
        },
      },
    });

    const prompt = `
You are an AI assistant for water quality assessment.
Analyze the provided water sample photo, ward "${input.ward}", and description: "${input.description || ''}".

Based on visual cues (color, clarity, particles) and the context:
1. Estimate cleanliness score (0-1).
2. Assign a status label (Safe, Moderate, Unsafe).
3. ESTIMATE specific physical properties:
   - pH (0-14). Neutral is ~7. Acidic/Corrosive < 6.5. Basic/Soapy > 8.5.
   - Turbidity (NTU). Clear < 1. Cloudier means higher values (e.g., 5-10+).

Output valid JSON matching the schema.
    `;

    // Extract base64 from data URI
    // Data URI format: data:image/png;base64,iVBORw0KGgo...
    const base64Data = input.photoDataUri.split(',')[1];
    const mimeType = input.photoDataUri.split(';')[0].split(':')[1];

    if (!base64Data) {
      throw new Error("Invalid photo data URI");
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    return JSON.parse(responseText) as CitizenReportOutput;

  } catch (error) {
    console.error('Gemini Analysis Failed:', error);
    // Return a safe fallback or rethrow
    // For prototype, let's return a dummy fallback if AI fails, but let the user know by logging
    throw error;
  }
}
