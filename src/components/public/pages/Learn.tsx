"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertCircle, Droplet, Wind, LifeBuoy } from 'lucide-react';

const educationalContent = [
  {
    title: 'Understanding pH Levels',
    icon: Droplet,
    content: "pH measures how acidic or alkaline water is on a scale of 0-14. For drinking water, a safe pH is between 6.5 and 8.5. Water outside this range can be corrosive to pipes and may have an unpleasant taste."
  },
  {
    title: 'What is Turbidity?',
    icon: Wind,
    content: "Turbidity is a measure of water's cloudiness, caused by suspended particles like silt, clay, or microorganisms. While not always a direct health threat, high turbidity can protect harmful bacteria from disinfection. Safe drinking water usually has a turbidity below 5 NTU (Nephelometric Turbidity Units)."
  },
  {
    title: 'Health Impacts of Unsafe Water',
    icon: AlertCircle,
    content: "Contaminated water can carry various pathogens, including bacteria (like E. coli), viruses, and protozoa, which can cause gastrointestinal illnesses such as diarrhea, cholera, and typhoid fever. Chemical contaminants can lead to long-term health issues."
  },
  {
    title: 'What To Do If Your Water Seems Unsafe',
    icon: LifeBuoy,
    content: "If your water is discolored, has a bad odor, or you suspect it's contaminated: 1) Do not drink it. 2) Use the 'Report Water' feature in this app to notify authorities immediately. 3) For immediate use, boil water vigorously for at least one minute to kill most pathogens. 4) Consider using a certified water filter."
  }
];

export default function LearnPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Water Safety Education Center</CardTitle>
                <CardDescription>Learn about water quality and how to stay safe.</CardDescription>
            </CardHeader>
        </Card>

        {educationalContent.map((item) => (
            <Card key={item.title}>
                <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-3">
                         <item.icon className="h-6 w-6 text-primary" />
                         {item.title}
                     </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{item.content}</p>
                </CardContent>
            </Card>
        ))}

        <Card>
            <CardHeader>
                <CardTitle>Quick Reference Guide</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is a 'Safe' rating?</AccordionTrigger>
                        <AccordionContent>
                        A 'Safe' rating means all key parameters (like pH and turbidity) are well within the nationally recommended limits for drinking water. This water is considered safe for consumption.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What does a 'Moderate' or 'Caution' rating mean?</AccordionTrigger>
                        <AccordionContent>
                        This indicates that one or more parameters are approaching the upper or lower limits of the safe range. While generally not an immediate danger, it's an issue we monitor closely. You may notice a slight change in taste or appearance.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What happens when a rating is 'Unsafe'?</AccordionTrigger>
                        <AccordionContent>
                        An 'Unsafe' rating means at least one parameter has exceeded the safe limits. An immediate alert is triggered in our system, and a team is dispatched to investigate the source of contamination. Public advisories may be issued.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
