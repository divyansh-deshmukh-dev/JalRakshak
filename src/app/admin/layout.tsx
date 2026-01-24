"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  Map,
  AlertTriangle,
  FileText,
  LineChart,
  HardHat,
  Cpu,
  Settings,
  Droplets,
  User,
  LogOut,
  Menu,
  X,
  Dot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import mockData from '@/data/mockWaterData.json';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/realtime', label: 'Real-Time Monitoring', icon: Clock },
  { href: '/admin/heatmap', label: 'Heatmap & GIS', icon: Map },
  { href: '/admin/alerts', label: 'Alerts Management', icon: AlertTriangle },
  { href: '/admin/citizen-reports', label: 'Citizen Reports', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/infrastructure', label: 'Infrastructure', icon: HardHat },
  { href: '/admin/ai-analysis', label: 'AI Analysis', icon: Cpu },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setIsCheckingAuth(false);
        return;
      }
      
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (loggedIn !== 'true') {
        router.replace('/admin/login');
        return;
      }
      setIsCheckingAuth(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
    }
    router.replace('/admin/login');
  };
  
  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading Admin Portal...</div>;
  }

  // Don't show admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const NavLink = ({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) => (
    <Link
        href={item.href}
        onClick={onClick}
        className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-primary hover:bg-primary/10",
        pathname === item.href && "bg-primary/10 text-primary font-semibold"
        )}
    >
        <item.icon className="h-4 w-4" />
        {item.label}
    </Link>
  );
  
  const sidebarContent = (
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-gray-800">
            <Droplets className="h-6 w-6 text-primary" />
            <span>JalSuraksha Admin</span>
            </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map(item => <NavLink key={item.href} item={item} />)}
            </nav>
        </div>
        </div>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
      <div className="hidden border-r bg-teal-50 lg:block">
        {sidebarContent}
      </div>
      
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-teal-600 text-white px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden shrink-0 border-white text-white hover:bg-white hover:text-teal-600">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                  <Droplets className="h-6 w-6 text-primary" />
                  <span>JalSuraksha Admin</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium p-4">
                {navItems.map((item) => (
                  <SheetTrigger key={item.href} asChild>
                    <NavLink item={item} />
                  </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm sm:text-base lg:text-lg text-white truncate">Indore Smart City Water Authority</h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs lg:text-sm font-medium text-emerald-100">
                <Dot className="h-4 w-4 lg:h-6 lg:w-6 animate-pulse" /> 
                <span className="hidden md:inline">System Status: {mockData.citySummary.systemHealth}</span>
                <span className="md:hidden">Online</span>
            </div>

            <Link href="/" className="hidden sm:block">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent border-2 h-8 lg:h-9 px-2 lg:px-4 text-xs lg:text-sm">Citizen Portal</Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8 border-white hover:bg-white hover:text-teal-600">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/">Citizen Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4 md:gap-6 md:p-6 bg-teal-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}
