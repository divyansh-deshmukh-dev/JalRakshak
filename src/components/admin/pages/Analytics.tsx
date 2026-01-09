"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';

const historicalData = {
    ph: [
        { month: 'Jan', avg: 7.1 }, { month: 'Feb', avg: 7.0 }, { month: 'Mar', avg: 6.9 },
        { month: 'Apr', avg: 7.2 }, { month: 'May', avg: 7.4 }, { month: 'Jun', avg: 7.3 },
        { month: 'Jul', avg: 7.1 },
    ],
    turbidity: [
        { month: 'Jan', avg: 5.2 }, { month: 'Feb', avg: 5.5 }, { month: 'Mar', avg: 6.1 },
        { month: 'Apr', avg: 5.8 }, { month: 'May', avg: 5.4 }, { month: 'Jun', avg: 6.3 },
        { month: 'Jul', avg: 5.8 },
    ],
};

const areaComparisonData = mockData.wards
    .sort(() => 0.5 - Math.random()) // Shuffle for variety
    .slice(0, 5)
    .map(ward => ({
        name: ward.name,
        ph: ward.ph,
        turbidity: ward.turbidity,
    }));

const recurringZones = mockData.wards
    .filter(w => w.status === 'Unsafe' || w.status === 'Moderate')
    .map(w => ({ ...w, incidentCount: Math.floor(Math.random() * 10) + 1 }))
    .sort((a, b) => b.incidentCount - a.incidentCount);

export default function AnalyticsPage() {
    const [selectedMetric, setSelectedMetric] = useState('ph');

    const data = historicalData[selectedMetric as keyof typeof historicalData];
    const metricName = selectedMetric === 'ph' ? 'pH' : 'Turbidity';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Historical Trends</CardTitle>
                            <CardDescription>Monthly average water quality metrics.</CardDescription>
                        </div>
                        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ph">pH Level</SelectItem>
                                <SelectItem value="turbidity">Turbidity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="avg" fill="var(--color-chart-1)" name={`Average ${metricName}`} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Area-wise Comparison</CardTitle>
                        <CardDescription>Current water quality metrics for selected wards.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={areaComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="var(--color-chart-1)" />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--color-chart-2)" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="ph" fill="var(--color-chart-1)" name="pH" />
                                <Bar yAxisId="right" dataKey="turbidity" fill="var(--color-chart-2)" name="Turbidity" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recurring Contamination Zones</CardTitle>
                        <CardDescription>Wards with the highest number of incidents this year.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ward</TableHead>
                                    <TableHead>Current Status</TableHead>
                                    <TableHead className="text-right">Incidents</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recurringZones.slice(0, 5).map(zone => (
                                    <TableRow key={zone.id}>
                                        <TableCell>{zone.name}</TableCell>
                                        <TableCell><StatusBadge status={zone.status} /></TableCell>
                                        <TableCell className="text-right">{zone.incidentCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
