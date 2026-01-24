"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, X } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';

const AdminMapClient = dynamic(() => import('../AdminMapClient'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

type Ward = typeof mockData.wards[0];

export default function HeatmapGISPage() {
    const [layers, setLayers] = useState({ sensors: true, tanks: false, pipelines: false });
    const [selectedNode, setSelectedNode] = useState<Ward | null>(null);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const [locationError, setLocationError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const indoreCenter: [number, number] = [22.7196, 75.8577];

    const wardLocations = mockData.wards.map((ward, index) => ({
        ...ward,
        lat: indoreCenter[0] + (Math.random() - 0.5) * 0.1,
        lng: indoreCenter[1] + (Math.random() - 0.5) * 0.1,
    }));

    const toggleLayer = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const getCurrentLocation = () => {
        setIsLoading(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation([latitude, longitude]);
                setIsLoading(false);
            },
            (error) => {
                setLocationError('Unable to retrieve your location.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 relative">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Ward Map & Infrastructure</CardTitle>
                            <CardDescription>Interactive map showing water quality and infrastructure across Indore.</CardDescription>
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
                    <CardContent className="p-0">
                        {locationError && (
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                                <p className="text-sm">{locationError}</p>
                            </div>
                        )}
                        <AdminMapClient 
                            currentLocation={currentLocation}
                            wardLocations={wardLocations}
                            onWardSelect={setSelectedNode}
                            showSensors={layers.sensors}
                        />
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
                            <div className="space-y-4">
                                <p className="text-center text-muted-foreground py-4">Click on a sensor marker to see details.</p>
                                <div className="text-sm">
                                    <h4 className="font-medium mb-2">Legend:</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                            <span>Safe Water Quality</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                                            <span>Moderate Quality</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                                            <span>Unsafe Water Quality</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                                            <span>Your Location</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}