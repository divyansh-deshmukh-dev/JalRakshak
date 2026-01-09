"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import mockData from '@/data/mockWaterData.json';
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";

export default function InfrastructurePage() {
    const { tanks, pipelines } = mockData.infrastructure;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Water Tanks Monitoring</CardTitle>
                    <CardDescription>Live status and levels of main water tanks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tank ID</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Fill Level</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanks.map(tank => (
                                <TableRow key={tank.tankId}>
                                    <TableCell className="font-mono">{tank.tankId}</TableCell>
                                    <TableCell>{tank.location}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={tank.level * 100} className="w-24"/>
                                            <span>{(tank.level * 100).toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><StatusBadge status={tank.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pipeline Sections</CardTitle>
                    <CardDescription>Status of major water pipeline sections.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pipeline ID</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pipelines.map(pipeline => (
                                <TableRow key={pipeline.pipelineId}>
                                    <TableCell className="font-mono">{pipeline.pipelineId}</TableCell>
                                    <TableCell>{pipeline.from} → {pipeline.to}</TableCell>
                                    <TableCell><StatusBadge status={pipeline.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
