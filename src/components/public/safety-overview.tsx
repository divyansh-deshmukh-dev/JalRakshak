import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicSummaryData } from '@/lib/data';
import { ShieldCheck, Droplets, Waves, AlertTriangle, Sparkles } from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, unit, colorClass }: { title: string, value: string | number, icon: React.ElementType, unit?: string, colorClass: string }) => (
  <Card className="flex-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

export default function SafetyOverview() {
  const isSafe = publicSummaryData.avgPh >= 6.5 && publicSummaryData.avgPh <= 8.5 && publicSummaryData.avgTurbidity < 5;

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${isSafe ? 'border-accent' : 'border-destructive'}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <ShieldCheck className={`h-12 w-12 shrink-0 ${isSafe ? 'text-accent' : 'text-destructive'}`} />
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">Is Your Water Safe Today?</h2>
              <p className="text-3xl font-bold sm:text-4xl">{isSafe ? 'Yes, Generally Safe' : 'Caution Advised'}</p>
              <p className="text-sm text-muted-foreground">Based on city-wide average sensor data. Check your specific ward for details.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-4">
        <SummaryCard title="Average pH" value={publicSummaryData.avgPh} icon={Droplets} colorClass="text-blue-500" />
        <SummaryCard title="Avg. Turbidity" value={publicSummaryData.avgTurbidity} icon={Waves} unit="NTU" colorClass="text-yellow-600" />
        <SummaryCard title="Active Alerts" value={publicSummaryData.activeAlerts} icon={AlertTriangle} colorClass="text-destructive" />
        <SummaryCard title="AI Cleanliness" value={`${publicSummaryData.aiCleanlinessScore}%`} icon={Sparkles} colorClass="text-purple-500" />
      </div>
    </div>
  );
}
