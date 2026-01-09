'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { adminMetrics } from '@/lib/data';
import type { AdminMetric } from '@/lib/types';
import { Thermometer, Waves, Droplets } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  'pH Level': Droplets,
  'Turbidity': Waves,
  'Temperature': Thermometer,
  'TDS': Waves,
};

const statusColors = {
  safe: 'text-accent',
  moderate: 'text-amber-500',
  unsafe: 'text-destructive',
};

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

const MetricCard = ({ metric }: { metric: AdminMetric }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const Icon = iconMap[metric.name] || Waves;
  const trendData = metric.trends[timeframe];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              {metric.name}
            </CardTitle>
            <CardDescription className="capitalize font-semibold pt-1">
              <span className={statusColors[metric.status]}>{metric.status}</span>
            </CardDescription>
          </div>
          <div className="text-right">
             <p className="text-3xl font-bold">{metric.value}<span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span></p>
             <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                accessibilityLayer
                data={trendData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  tickFormatter={(value) => timeframe === '24h' ? value.split(':')[0] : value.split('/')[1]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <defs>
                  <linearGradient id={`fill-${metric.name.replace(' ','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="natural"
                  fill={`url(#fill-${metric.name.replace(' ','')})`}
                  stroke="var(--color-value)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
        </div>
        <div className="flex justify-end gap-2 mt-2">
            <Button size="xs" variant={timeframe === '24h' ? 'secondary' : 'ghost'} onClick={() => setTimeframe('24h')}>24h</Button>
            <Button size="xs" variant={timeframe === '7d' ? 'secondary' : 'ghost'} onClick={() => setTimeframe('7d')}>7d</Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default function RealTimeMetrics() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Real-time Monitoring</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <MetricCard key={metric.name} metric={metric} />
        ))}
      </div>
    </div>
  );
}
