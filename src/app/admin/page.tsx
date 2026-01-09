"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page just redirects to the dashboard.
// The layout will handle the auth check.
export default function AdminRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/dashboard');
    }, [router]);
    
    return null; // Or a loading spinner
}
