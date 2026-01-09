"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import mockData from '@/data/mockWaterData.json';
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const severityInfo = {
  Critical: {
    icon: AlertTriangle,
    badgeClass: "bg-red-500 hover:bg-red-500",
    textClass: "text-red-800",
    bgClass: "bg-red-50",
    borderClass: "border-red-200"
  },
  High: {
    icon: AlertTriangle,
    badgeClass: "bg-orange-500 hover:bg-orange-500",
    textClass: "text-orange-800",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-200"
  },
  Medium: {
    icon: Info,
    badgeClass: "bg-yellow-500 hover:bg-yellow-500",
    textClass: "text-yellow-800",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200"
  },
   Low: {
    icon: Info,
    badgeClass: "bg-blue-500 hover:bg-blue-500",
    textClass: "text-blue-800",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200"
  }
};

export default function PublicAlertsPage() {
    const activeAlerts = mockData.alerts.filter(alert => alert.status !== "Resolved");

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Public Water Quality Alerts</CardTitle>
          <CardDescription>
            Current active alerts regarding water quality in Indore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {activeAlerts.length > 0 ? (
                activeAlerts.map(alert => {
                    const info = severityInfo[alert.severity as keyof typeof severityInfo];
                    const Icon = info.icon;
                    return (
                        <div key={alert.alertId} className={cn("p-4 rounded-lg border flex items-start gap-4", info.bgClass, info.borderClass)}>
                            <Icon className={cn("h-6 w-6 mt-1", info.textClass)} />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className={cn("font-bold", info.textClass)}>{alert.ward}</h3>
                                    <Badge className={cn(info.badgeClass, "text-white")}>{alert.severity}</Badge>
                                </div>
                                <p className={cn("text-sm", info.textClass)}>{alert.description}</p>
                                <p className={cn("text-xs mt-2", info.textClass, "opacity-70")}>
                                    Issued: {new Date(alert.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold">No Active Alerts</h3>
                    <p className="text-muted-foreground">Water quality is stable across all monitored zones.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
