"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  User,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import React from 'react';

const publicNavItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/ward-map', label: 'Ward Map', icon: Map },
  { href: '/trends', label: 'Trends', icon: TrendingUp },
  { href: '/alerts', label: 'Alert History', icon: AlertTriangle },
  { href: '/report-water', label: 'Report Water', icon: Send },
  { href: '/infrastructure', label: 'Infrastructure', icon: Building },
  { href: '/learn', label: 'Learn', icon: BookOpen },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('citizenLoggedIn') === 'true');
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('citizenLoggedIn');
      setIsLoggedIn(false);
    }
    window.location.reload();
  };

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
      <div className="hidden border-r bg-sky-50 lg:block">
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
        <header className="flex h-14 items-center gap-2 sm:gap-4 border-b bg-sky-500 text-white px-2 sm:px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden shrink-0 border border-white text-white hover:bg-white hover:text-sky-600 rounded p-2 bg-transparent"
            onClick={() => {
              console.log('Mobile menu clicked, current state:', isMobileMenuOpen);
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="fixed inset-0 bg-black/50" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span>JalSuraksha Indore</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="p-4 space-y-2">
                  {publicNavItems.map((item) => (
                    <NavLink 
                      key={item.href} 
                      item={item} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>
              </div>
            </div>
          )}

          <div className="w-full flex-1 min-w-0">
             <h1 className="font-semibold text-sm sm:text-base lg:text-lg text-white truncate">Indore Smart City Water Authority</h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/admin/login" className="hidden sm:block">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-sky-600 bg-transparent border-2 h-8 lg:h-9 px-2 lg:px-4 text-xs lg:text-sm">Admin Portal</Button>
            </Link>
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8 bg-white text-sky-600 hover:bg-sky-50">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                  <DropdownMenuItem disabled>My Reports</DropdownMenuItem>
                  <DropdownMenuItem asChild className="sm:hidden">
                      <Link href="/admin/login">Admin Portal</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/citizen/login">
                  <Button className="bg-white text-sky-600 hover:bg-sky-50 border-2 border-white h-8 lg:h-9 px-2 lg:px-4 text-xs lg:text-sm">Login</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="sm:hidden">
                    <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8 border-white hover:bg-white hover:text-sky-600">
                      <User className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/admin/login">Admin Portal</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4 lg:gap-6 lg:p-6 bg-sky-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}