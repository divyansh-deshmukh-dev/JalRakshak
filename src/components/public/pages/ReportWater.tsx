"use client";

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Loader2, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { submitCitizenReport } from '@/lib/actions';
import mockData from '@/data/mockWaterData.json';

const reportSchema = z.object({
  ward: z.string().min(1, 'Please select your ward.'),
  description: z.string().optional(),
  photo: z.any().refine(file => file instanceof File, 'Please upload an image.'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface AIResult {
  cleanlinessScore: number;
  statusLabel: string;
}

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export default function ReportWaterPage() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setStatus('submitting');
    setAiResult(null);

    const photoDataUri = await toBase64(data.photo);
    
    const result = await submitCitizenReport({
        photoDataUri,
        ward: data.ward,
        description: data.description,
    });

    if (result.success) {
      setAiResult(result.data);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Water Quality Report</CardTitle>
        <CardDescription>Help us keep Indore's water safe. If you see an issue, report it here.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'idle' || status === 'submitting' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                   <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Your Ward</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your ward..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockData.wards.map(ward => (
                              <SelectItem key={ward.id} value={ward.name}>{ward.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., The water is brown and has a strange smell." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Photo</FormLabel>
                      <FormControl>
                        <div
                          className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Upload className="mx-auto h-10 w-10 mb-2" />
                              <p>Click to upload an image</p>
                              <p className="text-xs">PNG, JPG, or GIF</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={status === 'submitting'} className="w-full md:w-auto">
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : status === 'success' && aiResult ? (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="text-2xl font-bold">Report Submitted Successfully!</h3>
              <p className="text-muted-foreground">Thank you for your contribution. Here is the initial AI analysis.</p>
              <Card className="max-w-sm mx-auto text-left">
                  <CardHeader>
                    <CardTitle>AI Cleanliness Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <div className="flex justify-between mb-1">
                              <span className="font-semibold">Cleanliness Score</span>
                              <span className="font-bold text-primary">{(aiResult.cleanlinessScore * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={aiResult.cleanlinessScore * 100} />
                      </div>
                      <Alert className={aiResult.statusLabel === 'Unsafe' ? 'border-red-500/50 text-red-500' : 'border-green-500/50 text-green-500'}>
                          <AlertTitle>AI Status: {aiResult.statusLabel}</AlertTitle>
                      </Alert>
                  </CardContent>
              </Card>
              <Button onClick={() => setStatus('idle')}>Submit Another Report</Button>
            </div>
        ) : (
            <div className="text-center space-y-4 py-8">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
              <h3 className="text-2xl font-bold">Submission Failed</h3>
              <p className="text-muted-foreground">We couldn't process your report at this time. Please try again later.</p>
              <Button variant="destructive" onClick={() => setStatus('idle')}>Try Again</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
