// Mock implementation for static export - AI features disabled
/**
 * @fileOverview Mock implementation for static export
 */

export type CitizenReportInput = {
  photoDataUri: string;
  ward: string;
  description?: string;
};

export type CitizenReportOutput = {
  cleanlinessScore: number;
  statusLabel: string;
};

export async function assessCleanliness(
  input: CitizenReportInput
): Promise<CitizenReportOutput> {
  // Mock response for static export
  return {
    cleanlinessScore: 0.8,
    statusLabel: 'Safe'
  };
}
