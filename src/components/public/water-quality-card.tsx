'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { publicSummaryData } from '@/lib/data';

const MetricDisplay = ({ value, label, unit, valueClassName }: { value: string | number, label: string, unit?: string, valueClassName?: string }) => (
    <div className="text-center">
        <div className={`text-4xl font-bold font-headline tracking-tighter ${valueClassName}`}>
            {value}
            {unit && <span className="text-xl ml-1">{unit}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
    </div>
);

export default function WaterQualityCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Indore Water Quality Overview</CardTitle>
                <CardDescription>A real-time snapshot of the city's water safety.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-foreground">
                    <MetricDisplay value={publicSummaryData.avgPh} label="Average pH Level" />
                    <MetricDisplay value={publicSummaryData.avgTurbidity} label="Average Turbidity" unit="NTU" />
                    <MetricDisplay 
                        value={`${publicSummaryData.aiCleanlinessScore}%`} 
                        label="AI Cleanliness Score"
                        valueClassName="text-green-400" 
                    />
                </div>
                <div className="mt-6 flex items-center justify-center space-x-4">
                     <p className="text-sm">
                        <span className="font-bold text-destructive">{publicSummaryData.activeAlerts}</span> Active Alerts
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
