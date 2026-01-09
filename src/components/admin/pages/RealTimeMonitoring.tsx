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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Real-Time Sensor Monitoring</CardTitle>
                    <CardDescription>Live data feed from sensors across Indore.</CardDescription>
                </div>
                <RefreshCw className={cn("h-5 w-5 text-muted-foreground", isRefreshing && "animate-spin")} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sensor ID</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>pH</TableHead>
                            <TableHead>Turbidity (NTU)</TableHead>
                            <TableHead>Temperature (°C)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Update</TableHead>
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
            </CardContent>
        </Card>
    );
}
