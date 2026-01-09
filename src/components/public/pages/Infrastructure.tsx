"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HardHat, MapPin, Droplet } from "lucide-react";
import StatusBadge from '@/components/shared/StatusBadge';
import mockData from '@/data/mockWaterData.json';

const nearbyTanks = mockData.infrastructure.tanks.slice(0, 3);

export default function InfrastructurePage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Water Infrastructure Transparency</CardTitle>
                <CardDescription>Information about the water supply infrastructure in your area.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This is a read-only view of major infrastructure assets. Data is updated periodically.</p>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyTanks.map(tank => (
                <Card key={tank.tankId}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>{tank.location}</CardTitle>
                                <CardDescription>Tank ID: {tank.tankId}</CardDescription>
                            </div>
                            <StatusBadge status={tank.status} />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Supply Source</span>
                            <span className="font-semibold">{tank.supplySource}</span>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><HardHat className="h-4 w-4"/>Last Maintenance</span>
                            <span>{new Date(tank.lastMaintenance).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Droplet className="h-4 w-4"/>Current Level</span>
                            <Badge variant="secondary">{(tank.level * 100).toFixed(0)}% Full</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
         <Card>
            <CardHeader>
                <CardTitle>Main Pipeline Sections</CardTitle>
                <CardDescription>Status of major pipelines supplying water to various zones.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Pipeline ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockData.infrastructure.pipelines.map(pipeline => (
                                <TableRow key={pipeline.pipelineId}>
                                    <TableCell className="font-medium">{pipeline.from} → {pipeline.to}</TableCell>
                                    <TableCell><StatusBadge status={pipeline.status} /></TableCell>
                                    <TableCell className="text-right font-mono">{pipeline.pipelineId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            </CardContent>
        </Card>
    </div>
  );
}
