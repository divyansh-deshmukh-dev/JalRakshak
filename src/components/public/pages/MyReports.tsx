"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusBadge from '@/components/shared/StatusBadge';
import { List, ThumbsUp, ThumbsDown, Hourglass, Map } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import mockData from '@/data/mockWaterData.json';

// Session-based mock reports
const myReports = mockData.citizenReports.slice(0, 2).map(r => ({...r, isOwner: true}));
const communityReports = mockData.citizenReports.slice(2, 4).map(r => ({...r, isOwner: false}));
const allReports = [...myReports, ...communityReports];

const wardLeaderboard = mockData.wards.map(ward => ({
    name: ward.name,
    score: Math.random() * 20 + 80 // Mock high scores
})).sort((a,b) => b.score - a.score).slice(0,5);

const statusIcons = {
    Pending: <Hourglass className="h-4 w-4 mr-2" />,
    Approved: <ThumbsUp className="h-4 w-4 mr-2" />,
    Rejected: <ThumbsDown className="h-4 w-4 mr-2" />
};

export default function MyReportsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Submitted Reports</CardTitle>
                    <CardDescription>Track the status of water quality reports you've submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    {myReports.length > 0 ? (
                        <div className="space-y-4">
                            {myReports.map(report => (
                                <Card key={report.reportId} className="flex flex-col md:flex-row items-start gap-4 p-4">
                                    <Image src={report.imageUrl} alt={report.description} width={150} height={100} className="rounded-md border aspect-video object-cover" data-ai-hint={report.imageHint}/>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-muted-foreground">{report.ward} - <span className="text-xs">{new Date(report.timestamp).toLocaleString()}</span></p>
                                            <StatusBadge status={report.status} />
                                        </div>
                                        <p className="text-sm italic my-2">"{report.description}"</p>
                                        <Badge>AI Score: {(report.aiScore * 100).toFixed(0)}/100</Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">You have not submitted any reports yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Community Reports Leaderboard</CardTitle>
                    <CardDescription>Wards with the highest average AI cleanliness scores from citizen reports.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={wardLeaderboard} layout="vertical" margin={{left: 20}}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Bar dataKey="score" fill="hsl(var(--chart-1))" background={{ fill: '#eee' }} unit="%" radius={[4, 4, 4, 4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
