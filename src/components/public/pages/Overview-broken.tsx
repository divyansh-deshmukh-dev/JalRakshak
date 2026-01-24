"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Droplet, Wind, AlertTriangle, Cpu, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, MapPin } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from "@/lib/utils";

const { citySummary, trends } = mockData;
const dailyTrends = trends.daily30.slice(-7);

const getOverallStatus = () => {
    if (citySummary.unsafeZonesCount > 2) return { text: "Unsafe", color: "text-red-600", Icon: ShieldAlert, bgColor: "bg-red-50" };
    if (citySummary.activeAlerts > 3) return { text: "Caution", color: "text-yellow-600", Icon: ShieldAlert, bgColor: "bg-yellow-50" };
    return { text: "Safe", color: "text-green-600", Icon: ShieldCheck, bgColor: "bg-green-50" };
}

export default function PublicOverviewPage() {
    const overallStatus = getOverallStatus();
    const yourWard = mockData.wards[0]; // Mocking "your" ward
    const wardRisk = yourWard.riskScore;

    const isImproving = yourWard.turbidity < citySummary.avgTurbidity;

    return (
        <>
            {/* DEBUG NAVIGATION BUTTON */}
            <div className="fixed top-20 right-4 z-[99999]">
                <button 
                    className="bg-red-500 text-white p-4 rounded-full shadow-lg border-4 border-yellow-400"
                    onClick={() => alert('DEBUG: Navigation button works on overview page!')}
                >
                    🍔 TEST NAV
                </button>
            </div>
            
            <div className="space-y-6" style={{ zIndex: 1, position: 'relative' }}>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>7-Day Water Quality Trend</CardTitle>
                        <CardDescription>pH and Turbidity levels over the last week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
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
            </div>
            </div>
        </>
    );
}
