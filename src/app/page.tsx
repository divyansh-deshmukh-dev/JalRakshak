"use client";

import { useState, useEffect } from 'react';
import { User, LogOut, Menu, X, Droplets } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PublicOverviewPage from '@/components/public/pages/Overview';

const publicNavItems = [
  { href: '/', label: 'Overview' },
  { href: '/ward-map', label: 'Ward Map' },
  { href: '/trends', label: 'Trends' },
  { href: '/alerts', label: 'Alert History' },
  { href: '/report-water', label: 'Report Water' },
  { href: '/infrastructure', label: 'Infrastructure' },
  { href: '/learn', label: 'Learn' },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('citizenLoggedIn') === 'true');
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('citizenLoggedIn');
      setIsLoggedIn(false);
    }
    window.location.reload();
  };
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sky-50 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>JalSuraksha Indore</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-primary/10 font-semibold">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>
                Overview
              </a>
              <a href="/ward-map" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Ward Map
              </a>
              <a href="/trends" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Trends
              </a>
              <a href="/alerts" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                Alert History
              </a>
              <a href="/report-water" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Report Water
              </a>
              <a href="/infrastructure" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Infrastructure
              </a>
              <a href="/learn" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Learn
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-sky-500 text-white px-4 lg:h-[60px] lg:px-6">
          <button 
            className="lg:hidden shrink-0 border-2 border-white text-white hover:bg-white hover:text-sky-600 rounded p-2 shadow-lg flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[99999] lg:hidden">
              <div 
                className="fixed inset-0 bg-black/50" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-[99999]">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span>JalSuraksha Indore</span>
                  </Link>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="p-4 space-y-2">
                  {publicNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-primary hover:bg-primary/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg text-white">Indore Smart City Water Authority</h1>
          </div>
          <a href="/admin/login" className="h-9 px-4 border-2 border-white text-white rounded hover:bg-white hover:text-sky-600 bg-transparent flex items-center">
            Admin Portal
          </a>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full border w-8 h-8 bg-white text-sky-600 hover:bg-sky-50 flex items-center justify-center">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Toggle user menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuItem disabled>My Reports</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/citizen/login" className="h-9 px-4 bg-white text-sky-600 rounded hover:bg-sky-50 border-2 border-white flex items-center">
              Login
            </a>
          )}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-sky-50/30">
          <PublicOverviewPage />
        </main>
      </div>
    </div>
  );
}
