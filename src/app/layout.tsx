import type {Metadata} from 'next';
import './globals.css';
import { AppProvider } from '@/app/contexts/app-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'JalSuraksha: Indore Water Quality Monitoring',
  description: 'Monitor water quality, view safety levels, and submit citizen reports for Indore.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
