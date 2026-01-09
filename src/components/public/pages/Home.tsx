"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Thermometer, Wind, ShieldCheck } from "lucide-react";
import mockData from '@/data/mockWaterData.json';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const { citySummary } = mockData;

const statusInfo = {
    isSafe: citySummary.unsafeZonesCount === 0,
    title: citySummary.unsafeZonesCount === 0 ? "Water is Safe Today" : "Caution: Water Quality Alert",
    description: citySummary.unsafeZonesCount === 0 ? "Water quality across Indore is currently stable and meets all safety standards." : `There are currently ${citySummary.unsafeZonesCount} wards with unsafe water quality readings.`,
    bgColor: citySummary.unsafeZonesCount === 0 ? "bg-green-100" : "bg-red-100",
    textColor: citySummary.unsafeZonesCount === 0 ? "text-green-800" : "text-red-800",
    borderColor: citySummary.unsafeZonesCount === 0 ? "border-green-200" : "border-red-200"
};

export default function PublicHomePage() {
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} ${statusInfo.textColor}`}>
        <div className="flex items-center gap-4">
          <ShieldCheck className="h-10 w-10"/>
          <div>
            <h1 className="text-2xl font-bold">{statusInfo.title}</h1>
            <p className="text-md">{statusInfo.description}</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average pH Level</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgPh}</div>
            <p className="text-xs text-muted-foreground">Optimal range: 6.5-8.5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Turbidity</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.avgTurbidity} NTU</div>
            <p className="text-xs text-muted-foreground">Safe: &lt; 5 NTU</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Across all wards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsafe Zones</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citySummary.unsafeZonesCount}</div>
            <p className="text-xs text-muted-foreground">Wards with critical readings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Check Your Ward</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">View a detailed map of Indore to see water quality status in your specific area.</p>
                <div className="relative aspect-video w-full rounded-md overflow-hidden mb-4">
                    <Image src="https://picsum.photos/seed/indoremap/800/450" alt="Indore Map" layout="fill" objectFit="cover" data-ai-hint="city map" />
                </div>
                <Link href="/ward-map">
                    <Button className="w-full">View Ward Map</Button>
                </Link>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Citizen Reporting</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Notice something wrong with your water? Submit a report to help us identify issues quickly.</p>
                 <div className="relative aspect-video w-full rounded-md overflow-hidden mb-4">
                    <Image src="https://picsum.photos/seed/waterreport/800/450" alt="Water reporting" layout="fill" objectFit="cover" data-ai-hint="water tap" />
                </div>
                <Link href="/report-water">
                    <Button className="w-full">Submit a Report</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
