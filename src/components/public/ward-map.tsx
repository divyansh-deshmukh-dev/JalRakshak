'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { WardData } from '@/lib/types';
import { wards } from '@/lib/data';

const mapImage = PlaceHolderImages.find(img => img.id === 'indore_map');

const safetyColors = {
  safe: 'bg-green-500',
  moderate: 'bg-amber-500',
  unsafe: 'bg-red-500',
};

export default function WardMap() {
  const [view, setView] = useState<'combined' | 'ph' | 'turbidity'>('combined');
  const [selectedWard, setSelectedWard] = useState<WardData | null>(wards[1]);

  const getSafetyLevel = (ward: WardData): WardData['safetyLevel'] => {
    if (view === 'ph') {
      if (ward.ph < 6.5 || ward.ph > 8.5) return 'unsafe';
      if (ward.ph < 7 || ward.ph > 8) return 'moderate';
      return 'safe';
    }
    if (view === 'turbidity') {
      if (ward.turbidity > 8) return 'unsafe';
      if (ward.turbidity > 5) return 'moderate';
      return 'safe';
    }
    return ward.safetyLevel;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ward-wise Water Safety</CardTitle>
        <CardDescription>Click on a ward to see details. Colors indicate safety levels.</CardDescription>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button size="sm" variant={view === 'combined' ? 'default' : 'outline'} onClick={() => setView('combined')}>Combined</Button>
            <Button size="sm" variant={view === 'ph' ? 'default' : 'outline'} onClick={() => setView('ph')}>pH</Button>
            <Button size="sm" variant={view === 'turbidity' ? 'default' : 'outline'} onClick={() => setView('turbidity')}>Turbidity</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative md:col-span-2">
          {mapImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
               <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-cover"
                data-ai-hint={mapImage.imageHint}
              />
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-2 gap-2 p-2">
                {wards.map((ward) => (
                   <div key={ward.name}
                     onClick={() => setSelectedWard(ward)}
                     className={`rounded-md transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-lg ${safetyColors[getSafetyLevel(ward)]} ${selectedWard?.name === ward.name ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : 'opacity-70'}`}
                     title={ward.name}
                   ></div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{selectedWard?.name || "Select a Ward"}</CardTitle>
                {selectedWard && <CardDescription className="capitalize font-semibold" style={{color: `var(--${getSafetyLevel(selectedWard) === 'safe' ? 'accent' : getSafetyLevel(selectedWard) === 'moderate' ? 'amber-500' : 'destructive'})`}}>
                   {getSafetyLevel(selectedWard)}
                </CardDescription>}
              </CardHeader>
              {selectedWard && <CardContent>
                <div className="space-y-2 text-sm">
                    <p><strong>pH Level:</strong> {selectedWard.ph}</p>
                    <p><strong>Turbidity:</strong> {selectedWard.turbidity} NTU</p>
                </div>
              </CardContent>}
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Safe</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-500"></div> Moderate</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div> Unsafe</div>
              </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
