'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mapImage = PlaceHolderImages.find(img => img.id === 'indore_map');

export default function MapCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Water Quality Map</CardTitle>
        <CardDescription>An overview of water quality across Indore.</CardDescription>
      </CardHeader>
      <CardContent>
        {mapImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={1200}
                height={800}
                className="object-cover w-full h-full"
                data-ai-hint={mapImage.imageHint}
                />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
