import type { PublicSummaryData, WardData, AdminMetric } from '@/lib/types';

export const publicSummaryData: PublicSummaryData = {
  avgPh: 7.2,
  avgTurbidity: 4.8,
  activeAlerts: 3,
  aiCleanlinessScore: 85,
};

export const wards: WardData[] = [
  { name: 'Ward 1', safetyLevel: 'safe', ph: 7.5, turbidity: 3.2 },
  { name: 'Ward 2', safetyLevel: 'moderate', ph: 6.8, turbidity: 6.1 },
  { name: 'Ward 3', safetyLevel: 'safe', ph: 7.1, turbidity: 4.5 },
  { name: 'Ward 4', safetyLevel: 'unsafe', ph: 8.5, turbidity: 10.3 },
  { name: 'Ward 5', safetyLevel: 'safe', ph: 7.3, turbidity: 2.8 },
  { name: 'Ward 18', safetyLevel: 'moderate', ph: 7.8, turbidity: 5.5 },
  { name: 'Ward 25', safetyLevel: 'safe', ph: 7.0, turbidity: 4.0 },
  { name: 'Ward 42', safetyLevel: 'unsafe', ph: 6.5, turbidity: 8.9 },
  { name: 'Ward 56', safetyLevel: 'moderate', ph: 6.9, turbidity: 7.2 },
  { name: 'Ward 73', safetyLevel: 'safe', ph: 7.4, turbidity: 3.5 },
];

export const wardNames = [
  "Sudama Nagar", "Rajendra Nagar", "Rau", "Annapurna", "Chhatribagh", 
  "Dravid Nagar", "Lokmanya Nagar", "Goma Ki Phel", "Sukhliya", "Vijay Nagar",
  "Palasia", "Old Palasia", "Tilak Nagar", "Manik Bagh", "Pipliyahana",
  "Scheme No. 78", "Scheme No. 54", "Bengali Square", "Geeta Bhawan", "Navlakha"
];

const generateTrendData = (points: number, initialValue: number, volatility: number, precision: number = 1) => {
  const data: { time: string; value: number }[] = [];
  let currentValue = initialValue;
  for (let i = 0; i < points; i++) {
    const date = new Date();
    if (points <= 24) {
      date.setHours(date.getHours() - (points - 1 - i));
      data.push({
        time: `${date.getHours()}:00`,
        value: parseFloat(currentValue.toFixed(precision)),
      });
    } else {
      date.setDate(date.getDate() - (points - 1 - i));
      data.push({
        time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(currentValue.toFixed(precision)),
      });
    }
    currentValue += (Math.random() - 0.5) * volatility;
    currentValue = Math.max(0, currentValue); // Ensure value is not negative
  }
  return data;
};

export const adminMetrics: AdminMetric[] = [
  {
    name: 'pH Level',
    value: '7.4',
    unit: '',
    status: 'safe',
    description: 'Optimal range: 6.5-8.5',
    trends: {
      '24h': generateTrendData(24, 7.4, 0.2),
      '7d': generateTrendData(7, 7.4, 0.4),
    },
  },
  {
    name: 'Turbidity',
    value: '5.2',
    unit: 'NTU',
    status: 'moderate',
    description: 'Safe < 5 NTU',
    trends: {
      '24h': generateTrendData(24, 5.2, 1.5),
      '7d': generateTrendData(7, 5.2, 2.5),
    },
  },
  {
    name: 'Temperature',
    value: '26',
    unit: '°C',
    status: 'safe',
    description: 'Ideal range: 20-30°C',
    trends: {
      '24h': generateTrendData(24, 26, 1, 0),
      '7d': generateTrendData(7, 26, 2, 0),
    },
  },
  {
    name: 'TDS',
    value: '350',
    unit: 'ppm',
    status: 'safe',
    description: 'Excellent < 300, Good < 600',
    trends: {
      '24h': generateTrendData(24, 350, 50, 0),
      '7d': generateTrendData(7, 350, 100, 0),
    },
  },
];
