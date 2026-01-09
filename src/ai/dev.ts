import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-citizen-reports.ts';
import '@/ai/flows/citizen-report-cleanliness-assessment.ts';