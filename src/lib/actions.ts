'use server';

import {
  assessCleanliness,
  type CitizenReportInput,
  type CitizenReportOutput,
} from '@/ai/flows/citizen-report-cleanliness-assessment';

export async function submitCitizenReport(
  data: CitizenReportInput
): Promise<{ success: true; data: CitizenReportOutput } | { success: false; error: string }> {
  try {
    const result = await assessCleanliness(data);
    if (!result) {
        throw new Error("AI assessment returned no result.");
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error assessing cleanliness:', error);
    return { success: false, error: 'Failed to assess cleanliness due to an internal error.' };
  }
}
