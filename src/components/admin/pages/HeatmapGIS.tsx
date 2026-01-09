"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layers, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

type Ward = typeof mockData.wards[0];

const statusColors = {
  Safe: "bg-green-500",
  Moderate: "bg-yellow-500",
  Unsafe: "bg-red-500",
};

export default function HeatmapGISPage() {
    const [layers, setLayers] = useState({ sensors: true, tanks: false, pipelines: false });
    const [selectedNode, setSelectedNode] = useState<Ward | null>(null);

    const toggleLayer = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 relative">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Heatmap & GIS View</CardTitle>
                            <CardDescription>Visualize water quality and infrastructure across the city.</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="sensors-layer" checked={layers.sensors} onCheckedChange={() => toggleLayer('sensors')} />
                                <Label htmlFor="sensors-layer">Sensors</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="tanks-layer" checked={layers.tanks} onCheckedChange={() => toggleLayer('tanks')} />
                                <Label htmlFor="tanks-layer">Tanks</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="pipelines-layer" checked={layers.pipelines} onCheckedChange={() => toggleLayer('pipelines')} />
                                <Label htmlFor="pipelines-layer">Pipelines</Label>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-[16/10] w-full bg-gray-200 rounded-md overflow-hidden">
                            <Image src="https://picsum.photos/seed/heatmap/1200/800" alt="Heatmap GIS" layout="fill" objectFit="cover" data-ai-hint="gis heatmap" />
                            {/* Sensor nodes */}
                            {layers.sensors && mockData.wards.map((ward, index) => (
                                <div
                                    key={ward.id}
                                    className={cn(
                                        "absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 border-2 border-white",
                                        statusColors[ward.status as keyof typeof statusColors]
                                    )}
                                    style={{ top: `${(index * 6 + 15)}%`, left: `${(index * 4 + 20)}%`}}
                                    onClick={() => setSelectedNode(ward)}
                                    title={ward.name}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                         <CardTitle>Node Details</CardTitle>
                         {selectedNode && <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}><X className="h-4 w-4" /></Button>}
                    </CardHeader>
                    <CardContent>
                        {selectedNode ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <StatusBadge status={selectedNode.status} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">pH Level</span>
                                        <span>{selectedNode.ph}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Turbidity</span>
                                        <span>{selectedNode.turbidity} NTU</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Temperature</span>
                                        <span>{selectedNode.temp}°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">TDS</span>
                                        <span>{selectedNode.tds} ppm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Linked Reports</span>
                                        <span>{mockData.citizenReports.filter(r => r.ward === selectedNode.name).length}</span>
                                    </div>
                                </div>
                                <Button className="w-full">View Full Analytics</Button>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-10">Click on a node on the map to see details.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
