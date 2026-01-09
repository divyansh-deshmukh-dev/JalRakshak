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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (loggedIn !== 'true' && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [router, pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
    }
    router.push('/admin/login');
  };
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const NavLink = ({ item }: { item: typeof navItems[0]}) => (
    <Link
        href={item.href}
        className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100",
        pathname.startsWith(item.href) && "bg-gray-100 text-gray-900"
        )}
    >
        <item.icon className="h-4 w-4" />
        {item.label}
    </Link>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className={cn(
          "hidden border-r bg-gray-50/40 lg:block",
          !isSidebarOpen && "lg:hidden"
        )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
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
      </div>
      
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white px-6 sticky top-0 z-30">
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
               <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setIsSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                        <div className="flex px-4 pt-5 pb-2">
                            <Button variant="ghost" className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                         <div className="flex h-[60px] items-center border-b px-6">
                            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
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
                </div>
          )}
          
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Indore Smart City</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Dot className="h-6 w-6 animate-pulse" /> System Status: {mockData.citySummary.systemHealth}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-gray-50/40">
          {children}
        </main>
      </div>
    </div>
  );
}
