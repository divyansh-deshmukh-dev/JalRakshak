"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplet, Wind, Thermometer, ShieldQuestion, Phone } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';

const { thresholds } = mockData.settings;

export default function LearnPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Water Safety Education</CardTitle>
                    <CardDescription>Understanding the key metrics of water quality and what they mean for your health.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">
                                <div className="flex items-center gap-2">
                                    <Droplet className="h-5 w-5 text-primary" /> pH Level
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pl-7 text-muted-foreground">
                                <p>pH measures how acidic or basic water is on a scale of 0-14. A pH of 7 is neutral.</p>
                                <p>Water that is too acidic or basic can be harmful to drink and can damage plumbing.</p>
                                <p className="font-semibold text-foreground">Safe Range in Indore: <span className="text-primary">{thresholds.ph.min} - {thresholds.ph.max}</span></p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">
                                <div className="flex items-center gap-2">
                                    <Wind className="h-5 w-5 text-primary" /> Turbidity (NTU)
                                </div>
                            </AccordionTrigger>
                             <AccordionContent className="space-y-2 pl-7 text-muted-foreground">
                                <p>Turbidity is a measure of water's cloudiness or haziness, caused by suspended particles.</p>
                                <p>High turbidity can indicate the presence of pollutants, bacteria, or other contaminants that can cause illness.</p>
                                <p className="font-semibold text-foreground">Safe Range in Indore: <span className="text-primary">Below {thresholds.turbidity.max} NTU</span></p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                             <AccordionTrigger className="text-lg">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-primary" /> Total Dissolved Solids (TDS)
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pl-7 text-muted-foreground">
                                <p>TDS represents the total concentration of dissolved substances in water, including minerals, salts, and metals.</p>
                                <p>While not always a direct health risk, very high TDS can give water an unpleasant taste and indicate potential contamination.</p>
                                <p className="font-semibold text-foreground">Guideline: Generally, TDS below 500 ppm is considered good for drinking water.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldQuestion className="h-6 w-6"/> What to Do If Your Water Seems Unsafe</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <p>If you notice your water is discolored, has a strange smell, or tastes unusual:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><span className="font-semibold text-foreground">Do not drink the water.</span> Use bottled water for drinking and cooking.</li>
                        <li>Submit a report through our <a href="/report-water" className="text-primary underline">citizen reporting portal</a>, including a photo if possible.</li>
                        <li>Contact the Indore Municipal Corporation water helpline immediately to report the issue directly.</li>
                    </ul>
                    <div className="pt-4">
                        <Button asChild>
                            <a href="tel:18001234567">
                                <Phone className="mr-2 h-4 w-4" /> Call Water Helpline
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
