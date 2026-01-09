"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, Droplet, TestTube, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const aiChecks = [
  {
    icon: TestTube,
    title: 'Cloudiness & Turbidity',
    description: 'The AI measures how much particulate matter is suspended in the water, which affects its clarity. High turbidity can indicate contaminants.'
  },
  {
    icon: Droplet,
    title: 'Color & Hue',
    description: 'The model analyzes the water for any discoloration (yellow, brown, or green tints), which can be a sign of organic matter or chemical pollution.'
  },
  {
    icon: Sparkles,
    title: 'Visible Particles',
    description: 'The system scans for floating debris, sediment, or other visible impurities that should not be present in clean drinking water.'
  }
];

export default function AIInsightsPage() {
  const [comparisonValue, setComparisonValue] = useState([50]);

  const cleanImageOpacity = comparisonValue[0] / 100;
  const dirtyImageOpacity = 1 - cleanImageOpacity;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Water Quality Insights</CardTitle>
          <CardDescription>Understanding how our AI assesses water sample images for cleanliness.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {aiChecks.map(check => (
              <div key={check.title} className="p-4 bg-gray-50 rounded-lg border">
                <check.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{check.title}</h3>
                <p className="text-sm text-muted-foreground">{check.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Comparison</CardTitle>
          <CardDescription>Slide to compare a clean water sample with a contaminated one.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed">
                <Image
                    src="https://picsum.photos/seed/cleanwater/600/400"
                    alt="Clean Water"
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300"
                    style={{ opacity: cleanImageOpacity }}
                    data-ai-hint="clean water"
                />
                <Image
                    src="https://picsum.photos/seed/dirtywater/600/400"
                    alt="Contaminated Water"
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300"
                    style={{ opacity: dirtyImageOpacity }}
                    data-ai-hint="dirty water"
                />
            </div>
            <div className="space-y-4">
              <Slider
                value={comparisonValue}
                onValueChange={setComparisonValue}
                max={100}
                step={1}
              />
              <div className="flex justify-between font-semibold">
                <span className="text-red-600">Contaminated</span>
                <span className="text-green-600">Clean</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This tool helps visualize the differences our AI detects. The contaminated sample on the left shows high turbidity and discoloration, which would result in a low cleanliness score.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Why a Report Might Be Marked "Unsafe"</CardTitle>
          <CardDescription>Common reasons for a low AI cleanliness score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
                <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0"/>
                <div>
                    <h4 className="font-semibold">High Turbidity</h4>
                    <p className="text-sm text-muted-foreground">The water is cloudy or murky, preventing light from passing through. This suggests suspended solids are present.</p>
                </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
                <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0"/>
                <div>
                    <h4 className="font-semibold">Noticeable Discoloration</h4>
                    <p className="text-sm text-muted-foreground">Any color other than clear (e.g., yellow, brown, green) indicates the presence of dissolved organic or inorganic material.</p>
                </div>
            </div>
            <Separator />
             <div className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/>
                <div>
                    <h4 className="font-semibold">What "Safe" Looks Like</h4>
                    <p className="text-sm text-muted-foreground">Safe water is perfectly clear, colorless, and free of any visible particles or debris. Our AI is trained on thousands of images to recognize this ideal state.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
