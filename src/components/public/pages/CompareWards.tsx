"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';

const { wards, citySummary } = mockData;
const userWard = wards[0]; // Mock user's ward

export default function CompareWardsPage() {
  const [selectedWardNames, setSelectedWardNames] = useState<string[]>([wards[1].name, wards[2].name]);
  const selectedWards = wards.filter(w => selectedWardNames.includes(w.name));

  const comparisonData = [userWard, ...selectedWards].map(ward => ({
    name: ward.name,
    pH: ward.ph,
    Turbidity: ward.turbidity,
    'Risk Score': ward.riskScore,
  }));
  
  const cityAverageData = {
    name: 'City Average',
    pH: citySummary.avgPh,
    Turbidity: citySummary.avgTurbidity,
    'Risk Score': wards.reduce((acc, w) => acc + w.riskScore, 0) / wards.length,
  }

  const chartData = [...comparisonData, cityAverageData];

  const getImprovement = (ward: typeof userWard) => {
    const change = (Math.random() - 0.5) * 5; // Mock change
    if (change > 1) return { text: "Improving", Icon: ArrowUp, color: "text-green-600" };
    if (change < -1) return { text: "Degrading", Icon: ArrowDown, color: "text-red-600" };
    return { text: "Stable", Icon: Minus, color: "text-gray-500" };
  }

  const { text: improvementText, Icon: ImprovementIcon, color: improvementColor } = getImprovement(userWard);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ward Comparison Dashboard</CardTitle>
          <CardDescription>Compare your ward's water quality against other wards and the city average.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg">Your Ward: {userWard.name}</CardTitle>
                    <div className={`flex items-center text-sm font-semibold ${improvementColor}`}>
                        <ImprovementIcon className="h-4 w-4 mr-1" />
                        {improvementText}
                    </div>
                </CardHeader>
            </Card>
            <Select onValueChange={(val) => setSelectedWardNames([val, selectedWardNames[1]])} defaultValue={selectedWardNames[0]}>
                <SelectTrigger><SelectValue placeholder="Select a ward to compare..." /></SelectTrigger>
                <SelectContent>
                    {wards.filter(w => w.id !== userWard.id).map(w => <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select onValueChange={(val) => setSelectedWardNames([selectedWardNames[0], val])} defaultValue={selectedWardNames[1]}>
                <SelectTrigger><SelectValue placeholder="Select another ward..." /></SelectTrigger>
                <SelectContent>
                     {wards.filter(w => w.id !== userWard.id).map(w => <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>pH Level Comparison</CardTitle>
                <CardDescription>Normal range is 6.5 - 8.5.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[6, 9]}/>
                        <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        <Legend />
                        <Bar dataKey="pH" fill="hsl(var(--chart-1))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Turbidity Comparison (NTU)</CardTitle>
                <CardDescription>Lower is better. Safe is generally &lt; 5 NTU.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                        <Legend />
                        <Bar dataKey="Turbidity" fill="hsl(var(--chart-2))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Overall Risk Score Comparison</CardTitle>
                <CardDescription>A combined score (0-100) indicating potential risk. Lower is better.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                        <Legend />
                        <Bar dataKey="Risk Score" fill="hsl(var(--chart-5))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
