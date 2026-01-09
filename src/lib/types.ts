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

// New types based on mockWaterData.json
export type CitySummary = {
  avgPh: number;
  avgTurbidity: number;
  activeAlerts: number;
  unsafeZonesCount: number;
  systemHealth: string;
};

export type Ward = {
  id: string;
  name: string;
  status: 'Safe' | 'Moderate' | 'Unsafe';
  ph: number;
  turbidity: number;
  temp: number;
  tds: number;
};

export type Sensor = {
  sensorId: string;
  location: string;
  ph: number;
  turbidity: number;
  temp: number;
  status: 'Safe' | 'Moderate' | 'Unsafe';
  timestamp: string;
};

export type Alert = {
  alertId: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  ward: string;
  description: string;
  timestamp: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
};

export type CitizenReport = {
  reportId: string;
  ward: string;
  timestamp: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  aiScore: number;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export type WaterTank = {
  tankId: string;
  location: string;
  capacity: number;
  level: number;
  status: 'Operational' | 'Risk' | 'Maintenance';
};

export type Pipeline = {
  pipelineId: string;
  from: string;
  to: string;
  status: 'Operational' | 'Risk';
};

export type Settings = {
  thresholds: {
    ph: { min: number; max: number };
    turbidity: { max: number };
  };
};
