"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle, Cloudy, Palette, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type AnalysisStatus = 'idle' | 'analyzing' | 'complete';
interface AnalysisResult {
    score: number;
    issues: {
        cloudiness: number;
        particles: number;
        discoloration: number;
    }
}

export default function AIAnalysisPage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setStatus('idle');
            setResult(null);
        }
    };

    const handleAnalyze = () => {
        if (!imageFile) return;
        setStatus('analyzing');
        setTimeout(() => {
            const cloudiness = Math.random();
            const particles = Math.random();
            const discoloration = Math.random();
            const score = 1 - (cloudiness + particles + discoloration) / 3;

            setResult({
                score: score * 100,
                issues: {
                    cloudiness: cloudiness * 100,
                    particles: particles * 100,
                    discoloration: discoloration * 100,
                }
            });
            setStatus('complete');
        }, 2500);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Image Analysis Panel</CardTitle>
                <CardDescription>Upload an image to get an AI-powered cleanliness analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-upload">Upload Water Sample Image</Label>
                            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Reference (Clean Water)</h4>
                                <div className="aspect-square w-full relative rounded-md overflow-hidden border">
                                    <Image src="https://picsum.photos/seed/cleanwater/300/300" alt="Clean water reference" layout="fill" objectFit="cover" data-ai-hint="clean water" />
                                </div>
                            </div>
                            <div>
                                 <h4 className="font-semibold mb-2 text-sm">Your Upload</h4>
                                <div className="aspect-square w-full relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Uploaded sample" layout="fill" objectFit="cover" />
                                    ) : (
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleAnalyze} disabled={!imageFile || status === 'analyzing'} className="w-full">
                            {status === 'analyzing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analyze Image
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Analysis Results</h3>
                        {status === 'idle' && <p className="text-muted-foreground text-center py-10">Upload an image to begin analysis.</p>}
                        {status === 'analyzing' && (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                <p className="font-medium">Analyzing image, please wait...</p>
                            </div>
                        )}
                        {status === 'complete' && result && (
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl">Final Cleanliness Rating</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-5xl font-bold text-primary">{result.score.toFixed(1)}%</div>
                                        <p className="text-sm text-muted-foreground">Higher score indicates better quality.</p>
                                    </CardContent>
                                </Card>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Cloudy className="h-5 w-5 text-muted-foreground" />
                                        <Label className="flex-1">Cloudiness / Turbidity</Label>
                                        <Progress value={result.issues.cloudiness} className="w-1/2" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-muted-foreground" />
                                        <Label className="flex-1">Visible Particles</Label>
                                        <Progress value={result.issues.particles} className="w-1/2" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-5 w-5 text-muted-foreground" />
                                        <Label className="flex-1">Discoloration</Label>
                                        <Progress value={result.issues.discoloration} className="w-1/2" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
