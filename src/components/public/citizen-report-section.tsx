'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitCitizenReport } from '@/lib/actions';
import { wardNames } from '@/lib/data';
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import type { CitizenReportOutput } from '@/ai/flows/citizen-report-cleanliness-assessment';

const formSchema = z.object({
  ward: z.string().min(1, 'Please select a ward.'),
  description: z.string().optional(),
  photo: z
    .any()
    .refine((files) => files?.length === 1, 'Photo is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
});

export default function CitizenReportSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CitizenReportOutput | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ward: '',
      description: '',
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const file = values.photo[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const photoDataUri = reader.result as string;

      const response = await submitCitizenReport({
        ward: values.ward,
        description: values.description,
        photoDataUri: photoDataUri,
      });

      setIsLoading(false);
      if (response.success) {
        setResult(response.data);
        toast({
          title: 'Report Submitted!',
          description: 'AI assessment completed successfully.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: response.error,
          variant: 'destructive',
        });
      }
    };
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>
          Spotted a water quality problem? Let us know.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Photo</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Input
                        type="file"
                        accept="image/*"
                        className="pl-12"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handlePhotoChange(e);
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {photoPreview && (
                    <div className="mt-2 w-full aspect-video relative overflow-hidden rounded-md">
                      <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your ward" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wardNames.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Water is cloudy and has a strange smell."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                'Submit Report & Get AI Analysis'
              )}
            </Button>
          </form>
        </Form>
        
        {result && (
            <Card className="mt-6 bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="text-primary"/> AI Cleanliness Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Cleanliness Score</p>
                        <p className="text-3xl font-bold text-primary">
                            {(result.cleanlinessScore * 100).toFixed(0)}%
                        </p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                         <div className="flex items-center gap-2 text-2xl font-bold">
                            {result.statusLabel === 'Safe' && <CheckCircle className="text-accent" />}
                            {result.statusLabel === 'Moderate' && <AlertTriangle className="text-amber-500" />}
                            {result.statusLabel === 'Unsafe' && <AlertTriangle className="text-destructive" />}
                            <span>{result.statusLabel}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
