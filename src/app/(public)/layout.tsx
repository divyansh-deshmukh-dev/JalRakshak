"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, Map, AlertTriangle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Droplets },
  { href: '/ward-map', label: 'Ward Map', icon: Map },
  { href: '/report-water', label: 'Report Water', icon: Send },
  { href: '/public-alerts', label: 'Public Alerts', icon: AlertTriangle },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">JalSuraksha Indore</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    pathname === item.href ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="md:hidden">
              {/* Mobile Menu can be added here */}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer className="bg-white mt-8 py-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Indore Municipal Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
