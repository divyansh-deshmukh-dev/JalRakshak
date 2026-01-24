"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

type Sensor = typeof mockData.sensors[0];

// Function to generate slightly varied mock data
const generateNewSensorData = (sensors: Sensor[]): Sensor[] => {
    return sensors.map(sensor => ({
        ...sensor,
        ph: parseFloat((sensor.ph + (Math.random() - 0.5) * 0.2).toFixed(2)),
        turbidity: parseFloat((sensor.turbidity + (Math.random() - 0.5) * 0.5).toFixed(2)),
        temp: parseFloat((sensor.temp + (Math.random() - 0.5) * 0.3).toFixed(2)),
        timestamp: new Date().toISOString(),
        status: sensor.ph > 8 || sensor.ph < 6.5 || sensor.turbidity > 7 ? 'Unsafe' : sensor.turbidity > 5 ? 'Moderate' : 'Safe'
    }));
};

export default function RealTimeMonitoringPage() {
    const [sensors, setSensors] = useState<Sensor[]>(mockData.sensors);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsRefreshing(true);
            setTimeout(() => {
                setSensors(prevSensors => generateNewSensorData(prevSensors));
                setIsRefreshing(false);
            }, 500);
        }, 5000); // Auto-refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <CardTitle className="text-lg sm:text-xl">Real-Time Sensor Monitoring</CardTitle>
                    <CardDescription className="text-sm">Live data feed from sensors across Indore.</CardDescription>
                </div>
                <RefreshCw className={cn("h-5 w-5 text-muted-foreground", isRefreshing && "animate-spin")} />
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-4 p-4">
                    {sensors.map(sensor => (
                        <Card key={sensor.sensorId} className={cn("p-4", isRefreshing && "opacity-50 transition-opacity")}>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-sm font-semibold">{sensor.sensorId}</span>
                                    <StatusBadge status={sensor.status} />
                                </div>
                                <div className="text-sm text-muted-foreground">{sensor.location}</div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <div className="font-medium">pH</div>
                                        <div>{sensor.ph}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium">Turbidity</div>
                                        <div>{sensor.turbidity} NTU</div>
                                    </div>
                                    <div>
                                        <div className="font-medium">Temp</div>
                                        <div>{sensor.temp}°C</div>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Last Update: {new Date(sensor.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[100px]">Sensor ID</TableHead>
                                <TableHead className="min-w-[150px]">Location</TableHead>
                                <TableHead className="min-w-[80px]">pH</TableHead>
                                <TableHead className="min-w-[120px]">Turbidity (NTU)</TableHead>
                                <TableHead className="min-w-[120px]">Temperature (°C)</TableHead>
                                <TableHead className="min-w-[100px]">Status</TableHead>
                                <TableHead className="min-w-[120px]">Last Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sensors.map(sensor => (
                                <TableRow key={sensor.sensorId} className={cn(isRefreshing && "opacity-50 transition-opacity")}>
                                    <TableCell className="font-mono">{sensor.sensorId}</TableCell>
                                    <TableCell>{sensor.location}</TableCell>
                                    <TableCell>{sensor.ph}</TableCell>
                                    <TableCell>{sensor.turbidity}</TableCell>
                                    <TableCell>{sensor.temp}</TableCell>
                                    <TableCell><StatusBadge status={sensor.status} /></TableCell>
                                    <TableCell>{new Date(sensor.timestamp).toLocaleTimeString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
