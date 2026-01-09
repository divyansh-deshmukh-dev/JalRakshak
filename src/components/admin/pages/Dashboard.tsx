"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Droplet, Wind, AlertTriangle, MapPin, Activity } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from "@/lib/utils";

const { citySummary, alerts } = mockData;

const chartData24h = [
  { time: '12 AM', ph: 7.2, turbidity: 5.5 }, { time: '3 AM', ph: 7.1, turbidity: 5.8 },
  { time: '6 AM', ph: 7.3, turbidity: 5.2 }, { time: '9 AM', ph: 7.4, turbidity: 5.1 },
  { time: '12 PM', ph: 7.3, turbidity: 5.6 }, { time: '3 PM', ph: 7.2, turbidity: 6.0 },
  { time: '6 PM', ph: 7.1, turbidity: 6.2 }, { time: '9 PM', ph: 7.0, turbidity: 5.9 },
];

const chartData7d = [
  { day: 'Mon', ph: 7.0, turbidity: 6.5 }, { day: 'Tue', ph: 7.2, turbidity: 6.1 },
  { day: 'Wed', ph: 7.3, turbidity: 5.8 }, { day: 'Thu', ph: 7.1, turbidity: 6.2 },
  { day: 'Fri', ph: 7.4, turbidity: 5.5 }, { day: 'Sat', ph: 7.5, turbidity: 5.3 },
  { day: 'Sun', ph: 7.2, turbidity: 5.9 },
];

const alertSeverityColors = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
};

export default function AdminDashboardPage() {
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. pH Level</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgPh}</div>
            <p className="text-xs text-muted-foreground">City-wide average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Turbidity</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgTurbidity} <span className="text-sm text-muted-foreground">NTU</span></div>
            <p className="text-xs text-muted-foreground">City-wide average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Incidents requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsafe Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.unsafeZonesCount}</div>
            <p className="text-xs text-muted-foreground">Wards with critical status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Trends</CardTitle>
            <CardDescription>pH and Turbidity levels over the last day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData24h}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="ph" stroke="var(--color-chart-1)" fill="url(#colorPh)" />
                <Area yAxisId="right" type="monotone" dataKey="turbidity" stroke="var(--color-chart-2)" fill="url(#colorTurbidity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>7-Day Trends</CardTitle>
            <CardDescription>pH and Turbidity levels over the last week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               <AreaChart data={chartData7d}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="ph" stroke="var(--color-chart-1)" fill="url(#colorPh)" />
                <Area yAxisId="right" type="monotone" dataKey="turbidity" stroke="var(--color-chart-2)" fill="url(#colorTurbidity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>A summary of the most recent alerts across the city.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map(alert => (
                <TableRow key={alert.alertId}>
                  <TableCell>
                    <Badge className={cn(alertSeverityColors[alert.severity as keyof typeof alertSeverityColors], "text-white")}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell>{alert.ward}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{alert.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
