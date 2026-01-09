"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Droplet, Wind, AlertTriangle, Cpu, CheckCircle } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';

const { citySummary, trends } = mockData;

const chartData7d = trends.daily.map(d => ({ name: d.name, ph: d.ph, turbidity: d.turbidity }));

export default function PublicOverviewPage() {
  return (
    <div className="space-y-6">
       <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
                <CheckCircle className="h-8 w-8 text-primary"/>
                <div>
                    <CardTitle className="text-primary">City-Wide Water Quality: Safe</CardTitle>
                    <p className="text-primary/80">
                        Overall water quality is within safe parameters. Active alerts are being monitored.
                    </p>
                </div>
            </CardHeader>
        </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. pH Level</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgPh}</div>
            <p className="text-xs text-muted-foreground">City-wide average (7-day)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Turbidity</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgTurbidity} <span className="text-sm text-muted-foreground">NTU</span></div>
            <p className="text-xs text-muted-foreground">City-wide average (7-day)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Incidents across the city</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>7-Day pH Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData7d}>
                 <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                <Area type="monotone" dataKey="ph" stroke="hsl(var(--primary))" fill="url(#colorPh)" name="pH" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>7-Day Turbidity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
               <AreaChart data={chartData7d}>
                 <defs>
                  <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                <Area type="monotone" dataKey="turbidity" stroke="hsl(var(--accent))" fill="url(#colorTurbidity)" name="Turbidity" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
