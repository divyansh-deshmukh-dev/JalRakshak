"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineTitle, TimelineIcon, TimelineDescription, TimelineTime } from "@/components/shared/Timeline";
import mockData from '@/data/mockWaterData.json';
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getResolutionTime(start: string, end: string | null) {
  if (!end) return null;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffHours = Math.abs(endTime - startTime) / 36e5;
  if (diffHours < 1) {
    return `${Math.round(diffHours * 60)} minutes`;
  }
  return `${Math.round(diffHours)} hours`;
}

export default function AlertsPage() {
  const sortedAlerts = [...mockData.alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Alert History</CardTitle>
        <CardDescription>A transparent log of all water quality alerts and their resolution status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Timeline>
          {sortedAlerts.map((alert, index) => {
            const isResolved = alert.status === 'Resolved';
            const resolutionTime = getResolutionTime(alert.timestamp, alert.resolutionTime);
            
            return (
              <TimelineItem key={alert.alertId}>
                <TimelineConnector isLast={index === sortedAlerts.length - 1} />
                <TimelineIcon>
                  {isResolved ? <CheckCircle className="h-4 w-4 text-green-500"/> : <AlertTriangle className="h-4 w-4 text-orange-500" />}
                </TimelineIcon>
                <TimelineHeader>
                  <div className="flex-1">
                    <TimelineTitle>{alert.ward}: {alert.description}</TimelineTitle>
                    <TimelineDescription>
                      <Badge variant={isResolved ? "outline" : "default"} className={
                        isResolved 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : alert.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'
                      }>
                        {alert.severity}
                      </Badge>
                    </TimelineDescription>
                  </div>
                  <div className="text-right">
                    <TimelineTime>{new Date(alert.timestamp).toLocaleDateString()}</TimelineTime>
                    {isResolved ? (
                      <Badge variant="secondary" className="mt-1 bg-gray-200 text-gray-600">Resolved</Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700">Ongoing</Badge>
                    )}
                  </div>
                </TimelineHeader>
                {isResolved && resolutionTime && (
                  <div className="ml-10 mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Resolved in approximately {resolutionTime}.
                  </div>
                )}
              </TimelineItem>
            )
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
}
