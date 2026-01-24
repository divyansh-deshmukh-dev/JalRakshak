"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, Wind, AlertTriangle, Cpu, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

const getOverallStatus = (citySummary: any) => {
    if (citySummary.unsafeZonesCount > 2) return { text: "Unsafe", color: "text-red-600", Icon: ShieldAlert, bgColor: "bg-red-50" };
    if (citySummary.activeAlerts > 3) return { text: "Caution", color: "text-yellow-600", Icon: ShieldAlert, bgColor: "bg-yellow-50" };
    return { text: "Safe", color: "text-green-600", Icon: ShieldCheck, bgColor: "bg-green-50" };
}

export default function PublicOverviewPage() {
    const [mockData, setMockData] = useState<any>(null);

    useEffect(() => {
        import('@/data/mockWaterData.json').then((data) => {
            setMockData(data.default);
        });
    }, []);

    if (!mockData) {
        return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    const { citySummary, trends } = mockData;
    const dailyTrends = trends.daily30.slice(-7);
    const overallStatus = getOverallStatus(citySummary);
    const yourWard = mockData.wards[0]; // Mocking "your" ward
    const wardRisk = yourWard.riskScore;
    const isImproving = yourWard.turbidity < citySummary.avgTurbidity;

    return (
        <div className="relative">
            <Tabs defaultValue="dashboard" className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">City Overview</h2>
                    <TabsList>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>
                </div>

            <TabsContent value="dashboard" className="space-y-6">
            <Card className={cn("border-2", overallStatus.bgColor)}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <overallStatus.Icon className={cn("h-10 w-10", overallStatus.color)} />
                    <div>
                        <CardTitle className={cn("text-2xl", overallStatus.color)}>
                            City Water Status: {overallStatus.text}
                        </CardTitle>
                        <CardDescription className="font-medium">
                            Based on real-time data from across Indore.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4"/>Your Ward's Risk</CardTitle>
                        <div className={cn(
                            "w-4 h-4 rounded-full",
                            wardRisk > 75 ? "bg-red-500" : wardRisk > 50 ? "bg-yellow-500" : "bg-green-500"
                        )}></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{wardRisk}<span className="text-sm font-normal">/100</span></div>
                        <p className="text-xs text-muted-foreground">{yourWard.name}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{citySummary.activeAlerts}</div>
                        <p className="text-xs text-muted-foreground">Across the city</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Cleanliness Score</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{citySummary.aiCleanlinessScore}%</div>
                        <p className="text-xs text-muted-foreground">Based on citizen reports</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
                        {isImproving ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-xl font-bold", isImproving ? "text-green-600" : "text-red-600")}>
                            {isImproving ? "Improving" : "Degrading"}
                        </div>
                        <p className="text-xs text-muted-foreground">Compared to city average</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Quick Overview</CardTitle>
                    <CardDescription>At-a-glance city water quality summary</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-green-600">{mockData.wards.filter(w => w.status === 'Safe').length}</div>
                            <div className="text-sm text-muted-foreground">Safe Zones</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-yellow-600">{mockData.wards.filter(w => w.status === 'Moderate').length}</div>
                            <div className="text-sm text-muted-foreground">Moderate Risk</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-red-600">{mockData.wards.filter(w => w.status === 'Unsafe').length}</div>
                            <div className="text-sm text-muted-foreground">High Risk</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4"/>Your Ward's Risk</CardTitle>
                            <div className={cn(
                                "w-4 h-4 rounded-full",
                                wardRisk > 75 ? "bg-red-500" : wardRisk > 50 ? "bg-yellow-500" : "bg-green-500"
                            )}></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{wardRisk}<span className="text-sm font-normal">/100</span></div>
                            <p className="text-xs text-muted-foreground">{yourWard.name}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{citySummary.activeAlerts}</div>
                            <p className="text-xs text-muted-foreground">Across the city</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">AI Cleanliness Score</CardTitle>
                            <Cpu className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{citySummary.aiCleanlinessScore}%</div>
                            <p className="text-xs text-muted-foreground">Based on citizen reports</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
                            {isImproving ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-xl font-bold", isImproving ? "text-green-600" : "text-red-600")}>
                                {isImproving ? "Improving" : "Degrading"}
                            </div>
                            <p className="text-xs text-muted-foreground">Compared to city average</p>
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>7-Day Water Quality Trend</CardTitle>
                        <CardDescription>pH and Turbidity levels over the last week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={dailyTrends}>
                                <defs>
                                <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                                </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tickFormatter={(val) => `Day ${val}`} />
                                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                                <Area yAxisId="left" type="monotone" dataKey="ph" stroke="hsl(var(--chart-1))" fill="url(#colorPh)" name="pH" />
                                <Area yAxisId="right" type="monotone" dataKey="turbidity" stroke="hsl(var(--chart-2))" fill="url(#colorTurbidity)" name="Turbidity" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Today vs. Yesterday</CardTitle>
                        <CardDescription>A quick comparison of key metrics.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Average pH</h4>
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-muted-foreground">Yesterday</span>
                                <div className="h-4 bg-gray-200 rounded-full flex-1"><div className="h-4 bg-primary/30 rounded-full" style={{width: `${(trends.daily[5].ph / 14) * 100}%`}}></div></div>
                                <span className="font-bold">{trends.daily[5].ph}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-muted-foreground">Today</span>
                                <div className="h-4 bg-gray-200 rounded-full flex-1"><div className="h-4 bg-primary rounded-full" style={{width: `${(trends.daily[6].ph / 14) * 100}%`}}></div></div>
                                <span className="font-bold">{trends.daily[6].ph}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Average Turbidity (NTU)</h4>
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-muted-foreground">Yesterday</span>
                                <div className="h-4 bg-gray-200 rounded-full flex-1"><div className="h-4 bg-accent/30 rounded-full" style={{width: `${(trends.daily[5].turbidity / 15) * 100}%`}}></div></div>
                                <span className="font-bold">{trends.daily[5].turbidity}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-muted-foreground">Today</span>
                                <div className="h-4 bg-gray-200 rounded-full flex-1"><div className="h-4 bg-accent rounded-full" style={{width: `${(trends.daily[6].turbidity / 15) * 100}%`}}></div></div>
                                <span className="font-bold">{trends.daily[6].turbidity}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ward Performance</CardTitle>
                            <CardDescription>Top and bottom performing wards</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-green-600 mb-2">Best Performing</h4>
                                    {mockData.wards.filter(w => w.status === 'Safe').slice(0, 3).map((ward, i) => (
                                        <div key={i} className="flex justify-between text-sm py-1">
                                            <span>{ward.name}</span>
                                            <span className="font-mono">{ward.riskScore}/100</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-red-600 mb-2">Needs Attention</h4>
                                    {mockData.wards.filter(w => w.status !== 'Safe').slice(0, 3).map((ward, i) => (
                                        <div key={i} className="flex justify-between text-sm py-1">
                                            <span>{ward.name}</span>
                                            <span className="font-mono">{ward.riskScore}/100</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>City Statistics</CardTitle>
                            <CardDescription>Overall city water quality stats</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Wards</span>
                                    <span className="font-bold">{mockData.wards.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Safe Zones</span>
                                    <span className="font-bold text-green-600">{mockData.wards.filter(w => w.status === 'Safe').length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Moderate Risk</span>
                                    <span className="font-bold text-yellow-600">{mockData.wards.filter(w => w.status === 'Moderate').length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">High Risk</span>
                                    <span className="font-bold text-red-600">{mockData.wards.filter(w => w.status === 'Unsafe').length}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t">
                                    <span className="text-muted-foreground">Avg pH</span>
                                    <span className="font-mono">{citySummary.avgPh}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Avg Turbidity</span>
                                    <span className="font-mono">{citySummary.avgTurbidity} NTU</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
        </div>
    );
}