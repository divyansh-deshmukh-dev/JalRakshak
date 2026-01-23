// Converted from server action to client-side function for static export

/**
 * @fileOverview Summarizes recent citizen reports to identify emerging water quality issues and understand community sentiment.
 *
 * - summarizeCitizenReports - A function that summarizes citizen reports.
 * - SummarizeCitizenReportsInput - The input type for the summarizeCitizenReports function.
 * - SummarizeCitizenReportsOutput - The return type for the summarizeCitizenReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCitizenReportsInputSchema = z.object({
  reports: z.array(
    z.object({
      ward: z.string().describe('The ward the report is from.'),
      photoDataUri: z
        .string()
        .describe(
          "A photo related to the report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      description: z.string().describe('The description of the issue reported.'),
    })
  ).describe('A list of recent citizen reports.'),
});
export type SummarizeCitizenReportsInput = z.infer<typeof SummarizeCitizenReportsInputSchema>;

const SummarizeCitizenReportsOutputSchema = z.object({
  summary: z.string().describe('A summary of the recent citizen reports.'),
});
export type SummarizeCitizenReportsOutput = z.infer<typeof SummarizeCitizenReportsOutputSchema>;

export async function summarizeCitizenReports(input: SummarizeCitizenReportsInput): Promise<SummarizeCitizenReportsOutput> {
  return summarizeCitizenReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCitizenReportsPrompt',
  input: {schema: SummarizeCitizenReportsInputSchema},
  output: {schema: SummarizeCitizenReportsOutputSchema},
  prompt: `You are an AI assistant helping to summarize citizen reports about water quality issues in Indore. You must identify emerging trends in citizen reports.

  Summarize the following reports:

  {{#each reports}}
  Ward: {{this.ward}}
  Description: {{this.description}}
  Photo: {{media url=this.photoDataUri}}
  {{/each}}
  `,
});

const summarizeCitizenReportsFlow = ai.defineFlow(
  {
    name: 'summarizeCitizenReportsFlow',
    inputSchema: SummarizeCitizenReportsInputSchema,
    outputSchema: SummarizeCitizenReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
