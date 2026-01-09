"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, Map, LineChart, AlertTriangle, Send, User, BrainCircuit, HardHat, ChevronsRight, GraduationCap, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const navItems = [
  { href: '/', label: 'Overview', icon: Droplets },
  { href: '/ward-map', label: 'Ward Map', icon: Map },
  { href: '/trends', label: 'Trends', icon: LineChart },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/report-water', label: 'Report Water', icon: Send },
  { href: '/my-reports', label: 'My Reports', icon: User },
  { href: '/ai-insights', label: 'AI Insights', icon: BrainCircuit },
  { href: '/infrastructure', label: 'Infrastructure', icon: HardHat },
  { href: '/compare-wards', label: 'Compare Wards', icon: ChevronsRight },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string, label: string, icon: React.ElementType, isMobile?: boolean }) => (
    <Link
      href={href}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-primary hover:bg-primary/10",
        pathname === href ? "bg-primary/10 text-primary font-semibold" : ""
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );

  const sidebarContent = (
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-[60px] items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-800">
            <Droplets className="h-7 w-7 text-primary" />
            <span>JalSuraksha Indore</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-base font-medium">
            {navItems.slice(0, 5).map(item => <NavLink key={item.href} {...item} isMobile={isMobileMenuOpen} />)}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="px-3 py-2 text-gray-600 hover:no-underline hover:text-primary font-medium text-base rounded-lg hover:bg-primary/10">More</AccordionTrigger>
                <AccordionContent className="pl-4">
                  <nav className="grid gap-1">
                  {navItems.slice(5).map(item => <NavLink key={item.href} {...item} isMobile={isMobileMenuOpen} />)}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
      </div>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
       <div className="hidden border-r bg-gray-50/75 lg:block">
        {sidebarContent}
      </div>
      
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-white px-6 sticky top-0 z-30 lg:justify-end">
            <Button variant="outline" size="icon" className="lg:hidden shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
            </Button>
            <div className='font-semibold text-lg text-gray-800'>Citizen Dashboard</div>
        </header>

         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                        <div className="flex px-4 pt-5 pb-2 justify-end">
                            <Button variant="ghost" className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        {sidebarContent}
                    </div>
            </div>
         )}
      
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-gray-50/75">
            {children}
        </main>
         <footer className="bg-white py-4 border-t mt-auto">
            <div className="container mx-auto text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Indore Municipal Corporation. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
