export type Role = 'public' | 'admin';

export type PublicSummaryData = {
  avgPh: number;
  avgTurbidity: number;
  activeAlerts: number;
  aiCleanlinessScore: number;
};

export type WardData = {
  name: string;
  safetyLevel: 'safe' | 'moderate' | 'unsafe';
  ph: number;
  turbidity: number;
};

export type SafetyLevel = 'safe' | 'moderate' | 'unsafe';

export type TrendDataPoint = {
  time: string;
  value: number;
};

export type AdminMetric = {
  name: string;
  value: string;
  unit: string;
  status: SafetyLevel;
  description: string;
  trends: {
    '24h': TrendDataPoint[];
    '7d': TrendDataPoint[];
  };
};
