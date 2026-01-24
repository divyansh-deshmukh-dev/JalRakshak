"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Layers, MapPin, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';

const WardMapClient = dynamic(() => import('./WardMapClient'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

type Ward = typeof mockData.wards[0];

const layerIcons = {
  Safe: <ShieldCheck className="h-4 w-4 text-green-600" />,
  Moderate: <ShieldAlert className="h-4 w-4 text-yellow-600" />,
  Unsafe: <Shield className="h-4 w-4 text-red-600" />,
};

export default function WardMapPage() {
  const [layers, setLayers] = useState({ safe: true, risk: true, complaints: false });
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
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
  
  const wardTrend = mockData.trends.daily.map(d => ({...d, name: d.name.slice(-1)}));

  const filteredWards = wardLocations.filter(ward => {
    return (layers.safe && ward.status === 'Safe') || (layers.risk && (ward.status === 'Moderate' || ward.status === 'Unsafe'));
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="lg:col-span-3">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Interactive Ward Map</CardTitle>
                    <CardDescription>Visualize water quality across Indore wards.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {locationError && (
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                            <p className="text-sm">{locationError}</p>
                        </div>
                    )}
                    <WardMapClient 
                        currentLocation={currentLocation}
                        filteredWards={filteredWards}
                        onWardSelect={setSelectedWard}
                    />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            {selectedWard ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <CardTitle>{selectedWard.name}</CardTitle>
                        </div>
                        <CardDescription>Ward Water Quality Details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <StatusBadge status={selectedWard.status} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">pH Level</span>
                                <span className="font-mono">{selectedWard.ph}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Turbidity</span>
                                <span className="font-mono">{selectedWard.turbidity} NTU</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Temperature</span>
                                <span className="font-mono">{selectedWard.temp}°C</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">TDS</span>
                                <span className="font-mono">{selectedWard.tds} ppm</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Risk Score</span>
                                <span className="font-mono">{selectedWard.riskScore}/100</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">7-Day Trend</h4>
                            <ResponsiveContainer width="100%" height={150}>
                                <BarChart data={wardTrend}>
                                    <XAxis dataKey="name" fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip contentStyle={{fontSize: '12px', padding: '4px 8px'}}/>
                                    <Bar dataKey="ph" fill="hsl(var(--chart-1))" name="pH" />
                                    <Bar dataKey="turbidity" fill="hsl(var(--chart-2))" name="NTU" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Ward Information</CardTitle>
                        <CardDescription>Click on a ward marker to view details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground py-8">Select a ward on the map to see detailed information.</p>
                    </CardContent>
                </Card>
            )}
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
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                        <span>Your Location</span>
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}