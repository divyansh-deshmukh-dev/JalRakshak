"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import Image from 'next/image';

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function ReportWaterPage() {
  const [selectedWard, setSelectedWard] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [aiResult, setAiResult] = useState({ score: 0, status: "" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWard || !imageFile) {
      alert("Please select a ward and upload an image.");
      return;
    }
    setStatus("submitting");
    // Simulate API call and AI analysis
    setTimeout(() => {
        const mockScore = Math.random();
        const mockStatus = mockScore > 0.8 ? "Safe" : mockScore > 0.5 ? "Moderate" : "Unsafe";
        setAiResult({ score: mockScore, status: mockStatus });
        setStatus("success");
    }, 2000);
  };

  const handleReset = () => {
    setSelectedWard("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setStatus("idle");
    setAiResult({ score: 0, status: "" });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Citizen Water Quality Report</CardTitle>
          <CardDescription>
            Help us monitor water quality by submitting a report. Upload a photo of your water.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="text-center space-y-4 p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto"/>
                <h2 className="text-2xl font-bold">Report Submitted Successfully!</h2>
                <p className="text-muted-foreground">Thank you for your contribution to keeping Indore's water safe.</p>
                <Card className="text-left">
                    <CardHeader>
                        <CardTitle>AI Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <p><strong>AI Cleanliness Score:</strong> {aiResult.score.toFixed(2)} / 1.00</p>
                        <p><strong>Estimated Status:</strong> {aiResult.status}</p>
                        <p className='text-xs text-muted-foreground pt-2'>This is a preliminary analysis. Our team will review your submission shortly.</p>
                    </CardContent>
                </Card>
                <Button onClick={handleReset}>Submit Another Report</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ward">Select Ward</Label>
                  <Select onValueChange={setSelectedWard} value={selectedWard} required>
                    <SelectTrigger id="ward">
                      <SelectValue placeholder="Select your ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.wards.map(ward => (
                        <SelectItem key={ward.id} value={ward.name}>{ward.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Water Photo</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                </div>
              </div>
              
              {imagePreview && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="w-full aspect-video relative rounded-md overflow-hidden border">
                      <Image src={imagePreview} alt="Water sample preview" layout="fill" objectFit="cover" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe any issues (e.g., color, smell, particles)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting & Analyzing...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
