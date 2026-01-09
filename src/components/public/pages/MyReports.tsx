"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatusBadge from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import mockData from '@/data/mockWaterData.json';
import { Frown, Meh, Smile } from 'lucide-react';

// Assuming some reports are "yours" by mocking a user ID or similar
const myReportIds = ["CR001", "CR004"];
const myReports = mockData.citizenReports.filter(report => myReportIds.includes(report.reportId));

export default function MyReportsPage() {
    
    if (myReports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Card className="p-8">
                    <CardTitle>No Reports Found</CardTitle>
                    <CardDescription>You haven't submitted any water quality reports yet.</CardDescription>
                </Card>
            </div>
        )
    }

    const ScoreIcon = ({ score }: { score: number }) => {
        if (score < 0.4) return <Frown className="h-6 w-6 text-red-500" />;
        if (score < 0.7) return <Meh className="h-6 w-6 text-yellow-500" />;
        return <Smile className="h-6 w-6 text-green-500" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Submitted Reports</CardTitle>
                <CardDescription>Here is a history of the water quality reports you've submitted.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myReports.map(report => (
                        <Card key={report.reportId}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{report.ward}</CardTitle>

                                        <CardDescription>{new Date(report.timestamp).toLocaleString()}</CardDescription>
                                    </div>
                                    <StatusBadge status={report.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="aspect-video w-full relative rounded-md overflow-hidden cursor-pointer">
                                            <Image src={report.imageUrl} alt={`Report ${report.reportId}`} layout="fill" objectFit="cover" data-ai-hint={report.imageHint}/>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Image Preview: {report.ward}</DialogTitle>
                                            <DialogDescription>{report.description}</DialogDescription>
                                        </DialogHeader>
                                        <div className="relative aspect-video">
                                            <Image src={report.imageUrl} alt={`Report ${report.reportId}`} layout="fill" objectFit="contain" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                
                                <p className="text-sm text-muted-foreground italic h-10 overflow-hidden">"{report.description}"</p>
                                
                                <Card className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">AI Cleanliness Score</div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{(report.aiScore * 100).toFixed(0)}%</span>
                                            <ScoreIcon score={report.aiScore} />
                                        </div>
                                    </div>
                                </Card>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
