'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { Layers, MapPin } from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const heatmapImage = PlaceHolderImages.find(img => img.id === 'heatmap_view');

export default function HeatmapView() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>City Heatmap & GIS View</CardTitle>
                <CardDescription>Visualize water quality data across Indore.</CardDescription>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                    <Switch id="tanks-layer" disabled/>
                    <Label htmlFor="tanks-layer" className="text-sm text-muted-foreground">Water Tanks</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="pipelines-layer" disabled/>
                    <Label htmlFor="pipelines-layer" className="text-sm text-muted-foreground">Pipelines</Label>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {heatmapImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={heatmapImage.imageUrl}
              alt={heatmapImage.description}
              fill
              className="object-cover"
              data-ai-hint={heatmapImage.imageHint}
            />
            <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <h3 className="font-bold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Selected Node: P-78B</h3>
                <div className="text-sm mt-2 space-y-1">
                    <p><strong>Status:</strong> <span className="text-accent font-semibold">Safe</span></p>
                    <p><strong>pH:</strong> 7.3</p>
                    <p><strong>TDS:</strong> 280 ppm</p>
                    <p><strong>Linked Reports:</strong> 0</p>
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
