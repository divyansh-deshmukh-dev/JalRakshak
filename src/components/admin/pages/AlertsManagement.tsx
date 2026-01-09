"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, CheckCircle, MoreHorizontal, Filter } from 'lucide-react';
import mockData from '@/data/mockWaterData.json';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

const alertSeverityColors = {
  Critical: "text-red-600",
  High: "text-orange-500",
  Medium: "text-yellow-500",
  Low: "text-blue-500",
};

export default function AlertsManagementPage() {
    const [alerts, setAlerts] = useState(mockData.alerts);
    const [filters, setFilters] = useState({ severity: 'all', ward: 'all', status: 'all' });
    const criticalAlerts = alerts.filter(a => a.severity === 'Critical' && a.status === 'New');

    const handleStatusChange = (alertId: string, status: string) => {
        setAlerts(alerts.map(a => a.alertId === alertId ? { ...a, status } : a));
    };

    const filteredAlerts = alerts.filter(alert => {
        return (filters.severity === 'all' || alert.severity === filters.severity) &&
               (filters.ward === 'all' || alert.ward === filters.ward) &&
               (filters.status === 'all' || alert.status === filters.status);
    });

    const uniqueWards = [...new Set(mockData.alerts.map(a => a.ward))];

    return (
        <div className="space-y-6">
            {criticalAlerts.length > 0 && (
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-red-600"/>
                        <div>
                            <CardTitle className="text-red-800">CRITICAL ALERTS REQUIRE IMMEDIATE ATTENTION</CardTitle>
                            <CardDescription className="text-red-700">
                                There are {criticalAlerts.length} new critical alerts.
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Alerts & Incident Management</CardTitle>
                    <CardDescription>View, manage, and resolve water quality alerts.</CardDescription>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlerts.map(alert => (
                                <TableRow key={alert.alertId}>
                                    <TableCell>
                                        <Badge className={cn(
                                            "font-semibold text-white",
                                            alert.severity === 'Critical' && "bg-red-500",
                                            alert.severity === 'High' && "bg-orange-500",
                                            alert.severity === 'Medium' && "bg-yellow-500 text-gray-800",
                                            alert.severity === 'Low' && "bg-blue-500",
                                        )}>
                                            {alert.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{alert.ward}</TableCell>
                                    <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                                    <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                                    <TableCell><StatusBadge status={alert.status} /></TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusChange(alert.alertId, 'Acknowledged')}>
                                                    Acknowledge
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(alert.alertId, 'Resolved')}>
                                                    Mark as Resolved
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
