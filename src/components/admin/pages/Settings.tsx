"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Save, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import mockData from '@/data/mockWaterData.json';

export default function SettingsPage() {
    const { toast } = useToast();
    const [phThreshold, setPhThreshold] = useState<[number, number]>([mockData.settings.thresholds.ph.min, mockData.settings.thresholds.ph.max]);
    const [turbidityThreshold, setTurbidityThreshold] = useState<[number]>([mockData.settings.thresholds.turbidity.max]);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
    });

    const handleSave = () => {
        // In a real app, this would make an API call.
        console.log("Saving settings:", { phThreshold, turbidityThreshold, notifications });
        toast({
            title: "Settings Saved",
            description: "Your new configuration has been applied.",
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Threshold Settings</CardTitle>
                    <CardDescription>Configure the min/max values for water quality parameters to trigger alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label>pH Level (Safe Range)</Label>
                        <Slider
                            value={phThreshold}
                            onValueChange={(value) => setPhThreshold(value as [number, number])}
                            min={0}
                            max={14}
                            step={0.1}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Min: {phThreshold[0]}</span>
                            <span>Max: {phThreshold[1]}</span>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <Label>Turbidity (Max NTU)</Label>
                        <Slider
                            value={turbidityThreshold}
                            onValueChange={(value) => setTurbidityThreshold(value as [number])}
                            min={0}
                            max={20}
                            step={0.1}
                        />
                        <div className="text-sm text-muted-foreground">
                            Max: {turbidityThreshold[0]} NTU
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you receive alerts and system notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <Switch id="email-notif" checked={notifications.email} onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} />
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-lg border">
                        <Label htmlFor="sms-notif">SMS Notifications</Label>
                        <Switch id="sms-notif" checked={notifications.sms} onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})} />
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-lg border">
                        <Label htmlFor="push-notif">Push Notifications</Label>
                        <Switch id="push-notif" checked={notifications.push} onCheckedChange={(checked) => setNotifications({...notifications, push: checked})} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>
        </div>
    );
}
