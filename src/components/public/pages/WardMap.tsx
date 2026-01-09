"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import mockData from '@/data/mockWaterData.json';
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Droplet, Wind, MapPin } from "lucide-react";

type Ward = typeof mockData.wards[0];

const statusColors = {
  Safe: "bg-green-500",
  Moderate: "bg-yellow-500",
  Unsafe: "bg-red-500",
};

export default function WardMapPage() {
  const [selectedWard, setSelectedWard] = useState<Ward | null>(mockData.wards[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Indore Water Quality Map</CardTitle>
            <CardDescription>Click on a ward to see detailed information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full bg-gray-200 rounded-md overflow-hidden">
                <Image src="https://picsum.photos/seed/indoremaplarge/1200/675" alt="Indore map" layout="fill" objectFit="cover" data-ai-hint="city map gis" />
                 {/* Mock ward pins */}
                {mockData.wards.map((ward, index) => (
                    <div 
                        key={ward.id}
                        className={cn(
                            "absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
                            statusColors[ward.status as keyof typeof statusColors],
                            selectedWard?.id === ward.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        )}
                        style={{ top: `${(index * 5 + 10)}%`, left: `${(index * 5 + 10)}%`}}
                        onClick={() => setSelectedWard(ward)}
                        title={ward.name}
                    >
                         <MapPin className="h-3 w-3 text-white"/>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ward Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWard ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{selectedWard.name}</h3>
                    <Badge className={cn(statusColors[selectedWard.status as keyof typeof statusColors], "text-white")}>{selectedWard.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Droplet size={16}/> pH Level</span>
                  <span>{selectedWard.ph}</span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Wind size={16}/> Turbidity</span>
                  <span>{selectedWard.turbidity} NTU</span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Temperature</span>
                  <span>{selectedWard.temp}°C</span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TDS</span>
                  <span>{selectedWard.tds} ppm</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a ward on the map to view details.</p>
            )}
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>All Wards Status</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                    {mockData.wards.map(ward => (
                        <li key={ward.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedWard(ward)}>
                            <span className="font-medium text-sm">{ward.name}</span>
                            <Badge className={cn(statusColors[ward.status as keyof typeof statusColors], "text-white")}>{ward.status}</Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
