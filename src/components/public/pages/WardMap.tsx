"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, X, Droplet, Wind, Shield } from 'lucide-react';
import Image from 'next/image';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Ward = typeof mockData.wards[0];
type ViewMode = 'risk' | 'ph' | 'turbidity';

const getStatusColor = (ward: Ward, mode: ViewMode): string => {
  let value: number;
  let thresholds: { moderate: number, unsafe: number };

  switch (mode) {
    case 'ph':
      value = ward.ph;
      thresholds = { moderate: 7.8, unsafe: 8.5 }; // Example: high pH is bad
       if (value < 6.5) return "bg-red-500";
       if (value < 7.0) return "bg-yellow-500";
      return "bg-green-500";
    case 'turbidity':
      value = ward.turbidity;
      thresholds = { moderate: 5, unsafe: 8 };
      if (value > thresholds.unsafe) return "bg-red-500";
      if (value > thresholds.moderate) return "bg-yellow-500";
      return "bg-green-500";
    case 'risk':
    default:
      value = ward.riskScore;
      thresholds = { moderate: 50, unsafe: 80 };
      if (value > thresholds.unsafe) return "bg-red-500";
      if (value > thresholds.moderate) return "bg-yellow-500";
      return "bg-green-500";
  }
};


export default function WardMapPage() {
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('risk');

    return (
      <Card className="h-full">
        <Drawer open={!!selectedWard} onOpenChange={(isOpen) => !isOpen && setSelectedWard(null)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Interactive Ward Map</CardTitle>
              <CardDescription>Visualize water quality data across Indore.</CardDescription>
            </div>
            <RadioGroup defaultValue="risk" onValueChange={(value: string) => setViewMode(value as ViewMode)} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="risk" id="risk" />
                <Label htmlFor="risk">Combined Risk</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ph" id="ph" />
                <Label htmlFor="ph">pH Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="turbidity" id="turbidity" />
                <Label htmlFor="turbidity">Turbidity</Label>
              </div>
            </RadioGroup>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[16/10] w-full bg-gray-200 rounded-md overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1712697235813-67e2567b3eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2l0eSUyMG1hcCUyMHdhdGVyfGVufDB8fHx8MTc2Nzk4MzI5OXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Indore Map" layout="fill" objectFit="cover" data-ai-hint="city map water" />
              {mockData.wards.map((ward, index) => (
                <div
                  key={ward.id}
                  className={cn(
                    "absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/50 transition-colors duration-300 hover:scale-150 hover:border-white",
                    getStatusColor(ward, viewMode)
                  )}
                  style={{ top: `${(index * 6 + 15)}%`, left: `${(index * 4 + 20)}%` }}
                  onClick={() => setSelectedWard(ward)}
                  title={ward.name}
                />
              ))}
            </div>
          </CardContent>
          <DrawerContent>
            <div className="mx-auto w-full max-w-2xl">
              {selectedWard && (
                <>
                  <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2 text-2xl">
                      <MapPin className="h-6 w-6 text-primary" /> {selectedWard.name}
                    </DrawerTitle>
                    <DrawerDescription>Detailed water quality analytics for this ward.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="flex items-center gap-1"><Shield className="h-4 w-4"/> Status</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <StatusBadge status={selectedWard.status} />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="flex items-center gap-1"><Droplet className="h-4 w-4"/> pH Level</CardDescription>
                        </CardHeader>
                        <CardContent><p className="text-2xl font-bold">{selectedWard.ph}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="flex items-center gap-1"><Wind className="h-4 w-4"/> Turbidity</CardDescription>
                        </CardHeader>
                        <CardContent><p className="text-2xl font-bold">{selectedWard.turbidity} <span className="text-sm text-muted-foreground">NTU</span></p></CardContent>
                      </Card>
                       <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="flex items-center gap-1"><AlertTriangle className="h-4 w-4"/> Risk Score</CardDescription>
                        </CardHeader>
                        <CardContent><p className="text-2xl font-bold">{selectedWard.riskScore}/100</p></CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </Card>
    );
}
