"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mockData from '@/data/mockWaterData.json';

const monthlyData = mockData.trends.monthly;
const seasonalData = mockData.trends.seasonal;

export default function TrendsPage() {
    const [selectedMetric, setSelectedMetric] = useState<'ph' | 'turbidity'>('ph');

    const metricName = selectedMetric === 'ph' ? 'pH' : 'Turbidity';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Historical Trends (30-Day)</CardTitle>
                            <CardDescription>Daily average water quality metrics over the past month.</CardDescription>
                        </div>
                        <Select value={selectedMetric} onValueChange={(v: any) => setSelectedMetric(v)}>
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
                        <AreaChart data={mockData.trends.daily30}>
                            <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                            <Area type="monotone" dataKey={selectedMetric} stroke="hsl(var(--primary))" fill="url(#colorMetric)" name={metricName} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Seasonal Comparison</CardTitle>
                    <CardDescription>Average pH and Turbidity levels across different seasons.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="ph" fill="hsl(var(--chart-1))" name="Average pH" />
                            <Bar yAxisId="right" dataKey="turbidity" fill="hsl(var(--chart-2))" name="Average Turbidity (NTU)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
