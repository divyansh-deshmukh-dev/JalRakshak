'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { wardNames } from '@/lib/data';
import { submitCitizenReport } from '@/lib/actions';
import { Loader2, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import type { CitizenReportOutput } from '@/ai/flows/citizen-report-cleanliness-assessment';

const formSchema = z.object({
  ward: z.string().min(1, 'Ward is required.'),
  description: z.string().optional(),
  photo: z.any().refine(file => file instanceof File, 'Photo is required.'),
});

type FormData = z.infer<typeof formSchema>;

export default function CitizenReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<CitizenReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ward: '',
      description: '',
    },
  });
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      form.setValue('photo', e.target.files[0]);
      form.clearErrors('photo');
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSubmissionResult(null);

    try {
      const photoDataUri = await toBase64(data.photo);
      const result = await submitCitizenReport({
          ward: data.ward,
          description: data.description,
          photoDataUri: photoDataUri,
      });

      if (result.success) {
        setSubmissionResult(result.data);
        toast({
          title: 'Report Submitted Successfully',
          description: 'Thank you for your contribution to water safety.',
        });
        form.reset();
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: err.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Citizen Report</CardTitle>
        <CardDescription>Spotted a water quality issue? Let us know.</CardDescription>
      </CardHeader>
      <CardContent>
        {submissionResult ? (
          <div className="text-center p-4 bg-muted rounded-lg">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-semibold">AI Assessment Complete</h3>
            <p className="mt-1 text-muted-foreground">
              Status: <span className="font-bold text-foreground">{submissionResult.statusLabel}</span>
            </p>
            <p className="text-muted-foreground">
              Cleanliness Score: <span className="font-bold text-foreground">{Math.round(submissionResult.cleanlinessScore * 100)}%</span>
            </p>
            <Button onClick={() => setSubmissionResult(null)} className="mt-4">
              Submit Another Report
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ward" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wardNames.map(wardName => (
                          <SelectItem key={wardName} value={wardName}>
                            {wardName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Photo</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            disabled={isSubmitting}
                            className="file:text-foreground"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Water looks cloudy, strange smell..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : 'Submit Report'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
