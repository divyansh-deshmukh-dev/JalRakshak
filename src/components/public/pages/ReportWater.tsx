"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { submitCitizenReport } from '@/lib/actions';
import { Progress } from '@/components/ui/progress';
import mockData from '@/data/mockWaterData.json';

type Status = 'idle' | 'submitting' | 'success' | 'error';
interface Result {
  cleanlinessScore: number;
  statusLabel: string;
}

export default function ReportWaterPage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ward, setWard] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<Status>('idle');
    const [result, setResult] = useState<Result | null>(null);
    const { toast } = useToast();

    const uniqueWards = [...new Set(mockData.wards.map(w => w.name))];

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

    const handleSubmit = async () => {
        if (!imageFile || !ward) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please upload an image and select a ward.',
            });
            return;
        }

        setStatus('submitting');
        
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async () => {
            const photoDataUri = reader.result as string;
            const response = await submitCitizenReport({ photoDataUri, ward, description });

            if (response.success) {
                setResult(response.data);
                setStatus('success');
                toast({
                    title: 'Report Submitted Successfully',
                    description: `Your report for ${ward} has been received.`,
                });
            } else {
                setStatus('error');
                 toast({
                    variant: 'destructive',
                    title: 'Submission Failed',
                    description: response.error,
                });
            }
        };
        reader.onerror = () => {
            setStatus('error');
             toast({
                variant: 'destructive',
                title: 'Error Reading File',
                description: 'Could not process the uploaded image.',
            });
        };
    };

    const isSubmitting = status === 'submitting';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit a Water Quality Report</CardTitle>
                <CardDescription>Help us monitor water quality in Indore by submitting a report.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ward-select">Select Your Ward</Label>
                             <Select value={ward} onValueChange={setWard} disabled={isSubmitting}>
                                <SelectTrigger id="ward-select"><SelectValue placeholder="Choose a ward..." /></SelectTrigger>
                                <SelectContent>
                                    {uniqueWards.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="image-upload">Upload Water Sample Image</Label>
                            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
                        </div>
                        <div className="aspect-video w-full relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Uploaded sample" layout="fill" objectFit="cover" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="h-8 w-8 mx-auto mb-2" />
                                    <p>Image Preview</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea 
                                id="description" 
                                placeholder="e.g., Water is cloudy, has a strange smell, etc." 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <Button onClick={handleSubmit} disabled={isSubmitting || !imageFile || !ward} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Report
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">AI Analysis Results</h3>
                        <div className="flex flex-col items-center justify-center h-full space-y-4 border rounded-lg p-6 bg-gray-50/50">
                            {status === 'idle' && <p className="text-muted-foreground text-center">Your AI analysis will appear here after submission.</p>}
                            {status === 'submitting' && (
                                <>
                                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                    <p className="font-medium">Analyzing your report...</p>
                                </>
                            )}
                            {status === 'error' && (
                                <div className="text-center text-destructive">
                                    <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                                    <p className="font-medium">Analysis Failed</p>
                                    <p className="text-sm">Please try submitting again.</p>
                                </div>
                            )}
                            {status === 'success' && result && (
                                <div className="w-full text-center space-y-4">
                                     <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                    <h4 className="text-xl font-bold">Report Submitted!</h4>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>AI Cleanliness Score</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-5xl font-bold text-primary">{(result.cleanlinessScore * 100).toFixed(0)}%</div>
                                            <Progress value={result.cleanlinessScore * 100} className="w-full mt-2" />
                                            <p className="text-muted-foreground mt-2 text-lg font-semibold">{result.statusLabel}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
