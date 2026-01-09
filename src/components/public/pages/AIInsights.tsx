"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cloudy, Palette, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export default function AiInsightsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Explainable AI: How We Analyze Water Quality</CardTitle>
                    <CardDescription>Our AI model helps analyze citizen-submitted photos to quickly identify potential issues. Here’s what it looks for.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg">
                        <Cloudy className="h-10 w-10 text-primary shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold">Cloudiness / Turbidity</h3>
                            <p className="text-muted-foreground">The AI assesses the transparency of the water. Cloudy or murky water can hide harmful bacteria and indicates suspended particles that may not be safe.</p>
                        </div>
                    </div>
                     <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg">
                        <Palette className="h-10 w-10 text-primary shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold">Color & Discoloration</h3>
                            <p className="text-muted-foreground">It checks for any color other than clear. Brown, yellow, or green tints can be signs of rust from pipes, organic material, or algal blooms.</p>
                        </div>
                    </div>
                     <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg">
                        <Sparkles className="h-10 w-10 text-primary shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold">Visible Particles</h3>
                            <p className="text-muted-foreground">The model scans for floating particles, sediment, or other foreign objects. Their presence is a clear indicator of contamination that needs investigation.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Clean vs. Contaminated Comparison</CardTitle>
                    <CardDescription>Visual examples of what the AI model is trained to distinguish.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <div className="aspect-video w-full relative rounded-md overflow-hidden border-2 border-green-500">
                                <Image src="https://picsum.photos/seed/cleanwater/400/300" alt="Clean water" layout="fill" objectFit="cover" data-ai-hint="clean water"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-green-500"/>
                                <h4 className="font-semibold text-lg">Clean Water</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Characterized by high transparency, no visible particles, and lack of color.</p>
                        </div>
                        <div className="space-y-2">
                             <div className="aspect-video w-full relative rounded-md overflow-hidden border-2 border-red-500">
                                <Image src="https://picsum.photos/seed/dirtywater/400/300" alt="Contaminated water" layout="fill" objectFit="cover" data-ai-hint="dirty water"/>
                            </div>
                             <div className="flex items-center gap-2">
                                <XCircle className="h-6 w-6 text-red-500"/>
                                <h4 className="font-semibold text-lg">Contaminated Water</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">May exhibit cloudiness, discoloration (yellow/brown), and visible floating matter.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
