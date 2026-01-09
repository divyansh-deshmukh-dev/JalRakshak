"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, CheckCircle, Clock } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { differenceInHours, parseISO } from 'date-fns';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(mockData.alerts.map(a => ({
        ...a,
        resolutionTime: a.status === 'Resolved' && a.resolutionTime ? differenceInHours(parseISO(a.resolutionTime), parseISO(a.timestamp)) : null
    })));

    const [filters, setFilters] = useState({ severity: 'all', ward: 'all', status: 'all' });

    const filteredAlerts = alerts.filter(alert => {
        return (filters.severity === 'all' || alert.severity === filters.severity) &&
               (filters.ward === 'all' || alert.ward === filters.ward) &&
               (filters.status === 'all' || alert.status === filters.status);
    });

    const uniqueWards = [...new Set(mockData.alerts.map(a => a.ward))];

    const SeverityBadge = ({ severity }: { severity: string }) => (
         <Badge className={cn(
            "font-semibold text-white",
            severity === 'Critical' && "bg-red-500",
            severity === 'High' && "bg-orange-500",
            severity === 'Medium' && "bg-yellow-500 text-gray-800",
            severity === 'Low' && "bg-blue-500",
        )}>
            {severity}
        </Badge>
    );
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert & Resolution History</CardTitle>
                <CardDescription>A transparent log of all water quality alerts and the actions taken.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                    <Filter className="h-5 w-5 text-muted-foreground"/>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select value={filters.severity} onValueChange={v => setFilters({...filters, severity: v})}>
                            <SelectTrigger><SelectValue placeholder="Filter by severity..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severities</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.ward} onValueChange={v => setFilters({...filters, ward: v})}>
                            <SelectTrigger><SelectValue placeholder="Filter by ward..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Wards</SelectItem>
                                {uniqueWards.map(ward => <SelectItem key={ward} value={ward}>{ward}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Select value={filters.status} onValueChange={v => setFilters({...filters, status: v})}>
                            <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Severity</TableHead>
                            <TableHead>Ward</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Resolution Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAlerts.map(alert => (
                            <TableRow key={alert.alertId}>
                                <TableCell><SeverityBadge severity={alert.severity} /></TableCell>
                                <TableCell className="font-medium">{alert.ward}</TableCell>
                                <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                                <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                                <TableCell><StatusBadge status={alert.status} /></TableCell>
                                <TableCell>
                                    {alert.status === 'Resolved' && alert.resolutionTime !== null ? (
                                        <div className="flex items-center gap-1 text-green-600 font-medium">
                                            <CheckCircle className="h-4 w-4" />
                                            {alert.resolutionTime} hrs
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            -
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
