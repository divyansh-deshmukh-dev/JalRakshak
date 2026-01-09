import type { PublicSummaryData, WardData, AdminMetric } from '@/lib/types';

export const publicSummaryData: PublicSummaryData = {
  avgPh: 7.2,
  avgTurbidity: 4.8,
  activeAlerts: 3,
  aiCleanlinessScore: 85,
};

export const wards: WardData[] = [
    { name: 'Sudama Nagar', safetyLevel: 'safe', ph: 7.5, turbidity: 3.2 },
    { name: 'Rajendra Nagar', safetyLevel: 'moderate', ph: 6.8, turbidity: 6.1 },
    { name: 'Rau', safetyLevel: 'safe', ph: 7.1, turbidity: 4.5 },
    { name: 'Annapurna', safetyLevel: 'unsafe', ph: 8.5, turbidity: 10.3 },
    { name: 'Chhatribagh', safetyLevel: 'safe', ph: 7.3, turbidity: 2.8 },
    { name: 'Dravid Nagar', safetyLevel: 'moderate', ph: 7.8, turbidity: 5.5 },
    { name: 'Lokmanya Nagar', safetyLevel: 'safe', ph: 7.0, turbidity: 4.0 },
    { name: 'Goma Ki Phel', safetyLevel: 'unsafe', ph: 6.5, turbidity: 8.9 },
    { name: 'Sukhliya', safetyLevel: 'moderate', ph: 6.9, turbidity: 7.2 },
    { name: 'Vijay Nagar', safetyLevel: 'safe', ph: 7.4, turbidity: 3.5 },
    { name: 'Palasia', safetyLevel: 'safe', ph: 7.2, turbidity: 3.8 },
    { name: 'Old Palasia', safetyLevel: 'moderate', ph: 7.0, turbidity: 5.9 },
    { name: 'Tilak Nagar', safetyLevel: 'safe', ph: 7.6, turbidity: 2.5 },
    { name: 'Manik Bagh', safetyLevel: 'unsafe', ph: 6.7, turbidity: 9.5 },
    { name: 'Pipliyahana', safetyLevel: 'safe', ph: 7.3, turbidity: 4.1 },
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
