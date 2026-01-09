"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Link as LinkIcon } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import StatusBadge from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function CitizenReportsPage() {
    const [reports, setReports] = useState(mockData.citizenReports);

    const handleStatusChange = (reportId: string, status: 'Approved' | 'Rejected') => {
        setReports(reports.map(r => r.reportId === reportId ? { ...r, status } : r));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Citizen Reports Review</CardTitle>
                <CardDescription>Review and manage water quality reports submitted by citizens.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map(report => (
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
                                
                                <p className="text-sm text-muted-foreground italic">"{report.description}"</p>
                                
                                <div className="text-sm">
                                    <strong>AI Cleanliness Score:</strong>
                                    <span className="font-mono ml-2">{report.aiScore.toFixed(2)} / 1.00</span>
                                </div>

                                {report.status === 'Pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusChange(report.reportId, 'Approved')}>
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" className="w-full" onClick={() => handleStatusChange(report.reportId, 'Rejected')}>
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <LinkIcon className="mr-2 h-4 w-4" /> Link
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
