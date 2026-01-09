'use server';
/**
 * @fileOverview Assesses the cleanliness of a citizen-submitted water quality report using AI.
 *
 * - assessCleanliness - A function that assesses the cleanliness of a water quality report.
 * - CitizenReportInput - The input type for the assessCleanliness function.
 * - CitizenReportOutput - The return type for the assessCleanliness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CitizenReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the water sample, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  ward: z.string().describe('The ward in Indore where the sample was taken.'),
  description: z.string().optional().describe('Optional description of the water sample.'),
});
export type CitizenReportInput = z.infer<typeof CitizenReportInputSchema>;

const CitizenReportOutputSchema = z.object({
  cleanlinessScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the cleanliness of the water, with 1 being the cleanest.'
    ),
  statusLabel: z
    .string()
    .describe(
      'A label indicating the status of the water quality (e.g., Safe, Moderate, Unsafe).'
    ),
});
export type CitizenReportOutput = z.infer<typeof CitizenReportOutputSchema>;

export async function assessCleanliness(
  input: CitizenReportInput
): Promise<CitizenReportOutput> {
  return assessCleanlinessFlow(input);
}

const assessCleanlinessPrompt = ai.definePrompt({
  name: 'assessCleanlinessPrompt',
  input: {schema: CitizenReportInputSchema},
  output: {schema: CitizenReportOutputSchema},
  prompt: `You are an AI assistant that assesses the cleanliness of water samples based on citizen reports.

You will be provided with a photo of the water sample, the ward where the sample was taken, and an optional description.

Based on this information, combined with your knowledge of potential pollution sources in Indore wards and historical reporting data, you will generate a cleanliness score (0-1) and a status label (Safe, Moderate, Unsafe).

Photo: {{media url=photoDataUri}}
Ward: {{{ward}}}
Description: {{{description}}}

Consider the following factors when assessing cleanliness:

*   Visual appearance of the water in the photo (color, turbidity, visible particles).
*   Known pollution sources in the specified ward.
*   Historical water quality reports from the specified ward.
*   Any details provided in the description.

Output the cleanlinessScore and statusLabel fields using the schema descriptions provided.`,
});

const assessCleanlinessFlow = ai.defineFlow(
  {
    name: 'assessCleanlinessFlow',
    inputSchema: CitizenReportInputSchema,
    outputSchema: CitizenReportOutputSchema,
  },
  async input => {
    const {output} = await assessCleanlinessPrompt(input);
    return output!;
  }
);
