"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';

const historicalData = {
    ph: mockData.trends.monthly.map(d => ({ month: d.name, avg: d.ph })),
    turbidity: mockData.trends.monthly.map(d => ({ month: d.name, avg: d.turbidity })),
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
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                            <Legend />
                            <Bar dataKey="avg" fill="hsl(var(--chart-1))" name={`Average ${metricName}`} />
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
                                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="ph" fill="hsl(var(--chart-1))" name="pH" />
                                <Bar yAxisId="right" dataKey="turbidity" fill="hsl(var(--chart-2))" name="Turbidity" />
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
                                        <TableCell className="font-medium">{zone.name}</TableCell>
                                        <TableCell><StatusBadge status={zone.status} /></TableCell>
                                        <TableCell className="text-right font-mono">{zone.incidentCount}</TableCell>
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
