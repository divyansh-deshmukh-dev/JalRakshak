"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Minus, Droplet, Wind, ShieldAlert } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';

const allWards = mockData.wards;
const cityAverage = {
    ph: mockData.citySummary.avgPh,
    turbidity: mockData.citySummary.avgTurbidity,
    riskScore: allWards.reduce((acc, ward) => acc + ward.riskScore, 0) / allWards.length,
};

const ComparisonStat = ({ label, value, average, higherIsBetter }: { label: string; value: number; average: number, higherIsBetter: boolean }) => {
    const isBetter = higherIsBetter ? value > average : value < average;
    const isSame = value === average;
    const Icon = isSame ? Minus : isBetter ? ArrowUp : ArrowDown;
    const color = isSame ? 'text-muted-foreground' : isBetter ? 'text-green-500' : 'text-red-500';

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{value.toFixed(1)}</span>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
        </div>
    );
};

export default function CompareWardsPage() {
    const [selectedWard1, setSelectedWard1] = useState<string | null>(allWards[0].id);
    const [selectedWard2, setSelectedWard2] = useState<string | null>(allWards[1].id);

    const ward1Data = allWards.find(w => w.id === selectedWard1);
    const ward2Data = allWards.find(w => w.id === selectedWard2);

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Ward Comparison Dashboard</CardTitle>
                    <CardDescription>Compare the water quality metrics of two different wards against each other and the city average.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <Select value={selectedWard1 ?? ''} onValueChange={v => setSelectedWard1(v)}>
                        <SelectTrigger><SelectValue placeholder="Select Ward 1" /></SelectTrigger>
                        <SelectContent>
                            {allWards.map(w => <SelectItem key={w.id} value={w.id} disabled={w.id === selectedWard2}>{w.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="font-bold text-muted-foreground">vs.</span>
                     <Select value={selectedWard2 ?? ''} onValueChange={v => setSelectedWard2(v)}>
                        <SelectTrigger><SelectValue placeholder="Select Ward 2" /></SelectTrigger>
                        <SelectContent>
                            {allWards.map(w => <SelectItem key={w.id} value={w.id} disabled={w.id === selectedWard1}>{w.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card>
                    <CardHeader>
                        <CardTitle>{ward1Data?.name ?? 'Select Ward'}</CardTitle>
                    </CardHeader>
                    {ward1Data && <CardContent className="space-y-4">
                        <div className="flex justify-center"><StatusBadge status={ward1Data.status} /></div>
                        <ComparisonStat label="pH Level" value={ward1Data.ph} average={cityAverage.ph} higherIsBetter={false} />
                        <ComparisonStat label="Turbidity (NTU)" value={ward1Data.turbidity} average={cityAverage.turbidity} higherIsBetter={false} />
                        <ComparisonStat label="Risk Score" value={ward1Data.riskScore} average={cityAverage.riskScore} higherIsBetter={false} />
                    </CardContent>}
                </Card>
                 <Card className="bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-center">City Average</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                            <Droplet className="h-6 w-6 text-primary mb-2"/>
                            <span className="text-sm text-muted-foreground">Avg. pH</span>
                            <span className="font-bold text-2xl">{cityAverage.ph.toFixed(1)}</span>
                        </div>
                         <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                            <Wind className="h-6 w-6 text-primary mb-2"/>
                            <span className="text-sm text-muted-foreground">Avg. Turbidity</span>
                            <span className="font-bold text-2xl">{cityAverage.turbidity.toFixed(1)}</span>
                        </div>
                         <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                            <ShieldAlert className="h-6 w-6 text-primary mb-2"/>
                            <span className="text-sm text-muted-foreground">Avg. Risk Score</span>
                            <span className="font-bold text-2xl">{cityAverage.riskScore.toFixed(1)}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-right">{ward2Data?.name ?? 'Select Ward'}</CardTitle>
                    </CardHeader>
                     {ward2Data && <CardContent className="space-y-4">
                        <div className="flex justify-center"><StatusBadge status={ward2Data.status} /></div>
                        <ComparisonStat label="pH Level" value={ward2Data.ph} average={cityAverage.ph} higherIsBetter={false} />
                        <ComparisonStat label="Turbidity (NTU)" value={ward2Data.turbidity} average={cityAverage.turbidity} higherIsBetter={false} />
                        <ComparisonStat label="Risk Score" value={ward2Data.riskScore} average={cityAverage.riskScore} higherIsBetter={false} />
                    </CardContent>}
                </Card>
            </div>
        </div>
    );
}
