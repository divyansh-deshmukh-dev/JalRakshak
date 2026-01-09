'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { wards } from '@/lib/data';
import type { SafetyLevel, WardData } from '@/lib/types';

const safetyLevelStyles: { [key in SafetyLevel]: string } = {
  safe: 'bg-green-500/20 text-green-400 border-green-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  unsafe: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const WardItem = ({ ward }: { ward: WardData }) => (
  <div className="flex items-center justify-between p-3 transition-colors hover:bg-muted/50 rounded-lg">
    <div className="flex flex-col">
      <span className="font-medium">{ward.name}</span>
      <span className="text-xs text-muted-foreground">pH: {ward.ph} | Turbidity: {ward.turbidity} NTU</span>
    </div>
    <Badge className={`capitalize ${safetyLevelStyles[ward.safetyLevel]}`}>{ward.safetyLevel}</Badge>
  </div>
);

export default function WardStatusList() {
    const [sortedWards] = useState([...wards].sort((a,b) => {
        const order = { unsafe: 0, moderate: 1, safe: 2 };
        return order[a.safetyLevel] - order[b.safetyLevel];
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ward-wise Status</CardTitle>
        <CardDescription>Live water quality status from different city wards.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          <div className="space-y-2">
            {sortedWards.map(ward => (
              <WardItem key={ward.name} ward={ward} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
