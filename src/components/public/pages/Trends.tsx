"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mockData from '@/data/mockWaterData.json';

const { trends } = mockData;

// Mock contamination frequency
const contaminationFrequency = mockData.wards.map(ward => ({
    name: ward.name,
    incidents: Math.floor(Math.random() * ward.riskScore / 5),
})).sort((a,b) => b.incidents - a.incidents).slice(0, 7);


export default function TrendsPage() {
  return (
    <Tabs defaultValue="monthly" className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Water Quality Trends</h2>
            <TabsList>
                <TabsTrigger value="monthly">Last 30 Days</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
                <TabsTrigger value="frequency">Frequency</TabsTrigger>
            </TabsList>
        </div>
      
        <TabsContent value="monthly" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>30-Day pH Level Trend</CardTitle>
                    <CardDescription>Daily average pH level across the city. Safe range is 6.5 to 8.5.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={trends.daily30}>
                             <defs>
                                <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[6, 9]}/>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Area type="monotone" dataKey="ph" stroke="hsl(var(--chart-1))" fill="url(#colorPh)" name="pH" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>30-Day Turbidity Trend (NTU)</CardTitle>
                    <CardDescription>Daily average turbidity. Lower is better, safe is generally &lt; 5 NTU.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={trends.daily30}>
                             <defs>
                                <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Area type="monotone" dataKey="turbidity" stroke="hsl(var(--chart-2))" fill="url(#colorTurbidity)" name="Turbidity" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="seasonal" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seasonal Water Quality Comparison</CardTitle>
                    <CardDescription>Average pH and Turbidity across different seasons.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trends.seasonal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" domain={[6,8]}/>
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Legend />
                            <Bar yAxisId="left" dataKey="ph" fill="hsl(var(--chart-1))" name="Average pH" />
                            <Bar yAxisId="right" dataKey="turbidity" fill="hsl(var(--chart-2))" name="Average Turbidity" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="frequency" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contamination Incident Frequency</CardTitle>
                    <CardDescription>Wards with the highest number of 'Unsafe' or 'Moderate' incidents this year.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={contaminationFrequency}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Bar dataKey="incidents" fill="hsl(var(--chart-5))" name="Incidents"/>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
