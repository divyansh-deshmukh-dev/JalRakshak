"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Layers, MapPin, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

type Ward = typeof mockData.wards[0];

const riskColors = {
  Safe: "bg-green-500/80 border-green-700",
  Moderate: "bg-yellow-500/80 border-yellow-700",
  Unsafe: "bg-red-500/80 border-red-700",
};

const layerIcons = {
  Safe: <ShieldCheck className="h-4 w-4 text-green-600" />,
  Moderate: <ShieldAlert className="h-4 w-4 text-yellow-600" />,
  Unsafe: <Shield className="h-4 w-4 text-red-600" />,
};

export default function WardMapPage() {
  const [layers, setLayers] = useState({ safe: true, risk: true, complaints: false });
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };
  
  const wardTrend = mockData.trends.daily.map(d => ({...d, name: d.name.slice(-1)}));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="lg:col-span-3">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Interactive Ward Map</CardTitle>
                    <CardDescription>Visualize water quality and community reports across Indore.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-[16/10] w-full bg-gray-200 rounded-md overflow-hidden border">
                        <Image src="https://picsum.photos/seed/indoremap/1200/800" alt="Indore Map" layout="fill" objectFit="cover" data-ai-hint="city map" />
                        
                        {mockData.wards.map((ward, index) => {
                          const isVisible = (layers.safe && ward.status === 'Safe') || (layers.risk && (ward.status === 'Moderate' || ward.status === 'Unsafe'));
                          if (!isVisible) return null;
                          
                          return (
                            <div
                                key={ward.id}
                                className={cn(
                                    "absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/70 shadow-lg hover:scale-150 transition-transform",
                                    riskColors[ward.status as keyof typeof riskColors]
                                )}
                                style={{ top: `${(index * 5 + 10)}%`, left: `${(index * 6 + 15)}%`}}
                                onClick={() => setSelectedWard(ward)}
                                title={ward.name}
                            />
                          )
                        })}

                         {layers.complaints && mockData.citizenReports.slice(0,5).map((report, index) => (
                              <div
                                key={report.reportId}
                                className="absolute w-3 h-3 bg-purple-500 rounded-full border-2 border-white/50 animate-pulse"
                                style={{ top: `${(index * 12 + 20)}%`, left: `${(index * 15 + 10)}%`}}
                                title={`Complaint in ${report.ward}`}
                            />
                         ))}

                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-6">
             <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Layers className="h-5 w-5"/>
                    <div>
                        <CardTitle className="text-lg">Map Layers</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="safe" checked={layers.safe} onCheckedChange={() => toggleLayer('safe')} />
                        <Label htmlFor="safe" className="flex items-center gap-2 text-sm text-green-600 font-medium">Safe Zones</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="risk" checked={layers.risk} onCheckedChange={() => toggleLayer('risk')} />
                        <Label htmlFor="risk" className="flex items-center gap-2 text-sm text-red-600 font-medium">Risk Zones</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="complaints" checked={layers.complaints} onCheckedChange={() => toggleLayer('complaints')} />
                        <Label htmlFor="complaints" className="flex items-center gap-2 text-sm text-purple-600 font-medium">Complaint Density</Label>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Object.entries(layerIcons).map(([status, icon]) => (
                        <div key={status} className="flex items-center gap-2 text-sm">
                            {icon}
                            <span>{status} Zone</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

      <Drawer open={!!selectedWard} onOpenChange={(open) => !open && setSelectedWard(null)}>
        <DrawerContent>
            {selectedWard && (
                <div className="mx-auto w-full max-w-4xl py-8">
                    <DrawerHeader>
                        <div className="flex items-center gap-4">
                            <MapPin className="h-8 w-8 text-primary"/>
                            <div>
                                <DrawerTitle className="text-3xl">{selectedWard.name}</DrawerTitle>
                                <DrawerDescription>Public Water Quality Analytics</DrawerDescription>
                            </div>
                        </div>
                    </DrawerHeader>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Current Status</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Overall:</span> <StatusBadge status={selectedWard.status}/></div>
                                <div className="flex justify-between"><span>pH Level:</span> <span className="font-mono">{selectedWard.ph}</span></div>
                                <div className="flex justify-between"><span>Turbidity:</span> <span className="font-mono">{selectedWard.turbidity} NTU</span></div>
                                <div className="flex justify-between"><span>Risk Score:</span> <span className="font-mono">{selectedWard.riskScore}/100</span></div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>7-Day Mini Trend</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={wardTrend}>
                                        <XAxis dataKey="name" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip contentStyle={{fontSize: '12px', padding: '4px 8px'}}/>
                                        <Bar dataKey="ph" fill="hsl(var(--chart-1))" name="pH" />
                                        <Bar dataKey="turbidity" fill="hsl(var(--chart-2))" name="NTU" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="p-4 flex justify-end">
                        <Button onClick={() => setSelectedWard(null)}>Close</Button>
                    </div>
                </div>
            )}
        </DrawerContent>
      </Drawer>

    </div>
  );
}
