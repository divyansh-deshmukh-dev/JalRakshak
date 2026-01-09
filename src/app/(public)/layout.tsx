"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  AlertTriangle,
  Send,
  ClipboardList,
  Cpu,
  Building,
  GitCompare,
  BookOpen,
  Menu,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

const publicNavItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/ward-map', label: 'Ward Map', icon: Map },
  { href: '/trends', label: 'Trends', icon: TrendingUp },
  { href: '/alerts', label: 'Alert History', icon: AlertTriangle },
  { href: '/report-water', label: 'Report Water', icon: Send },
  { href: '/my-reports', label: 'My Reports', icon: ClipboardList },
  { href: '/ai-insights', label: 'AI Insights', icon: Cpu },
  { href: '/infrastructure', label: 'Infrastructure', icon: Building },
  { href: '/compare-wards', label: 'Compare Wards', icon: GitCompare },
  { href: '/learn', label: 'Learn', icon: BookOpen },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NavLink = ({ item, onClick }: { item: typeof publicNavItems[0]; onClick?: () => void }) => (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-primary hover:bg-primary/10",
        pathname === item.href && "bg-primary/10 text-primary font-semibold"
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-50/75 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="">JalSuraksha Indore</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {publicNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Droplets className="h-6 w-6 text-primary" />
                  <span className="">JalSuraksha Indore</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium p-4">
                 {publicNavItems.map((item) => (
                    <SheetTrigger key={item.href} asChild>
                        <NavLink item={item} />
                    </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
             <h1 className="font-semibold text-lg text-gray-800">Indore Smart City Water Authority</h1>
          </div>
          <Link href="/admin/login">
            <Button variant="outline">Admin Portal</Button>
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/75">
          {children}
        </main>
      </div>
    </div>
  );
}
