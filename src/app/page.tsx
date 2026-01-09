'use client';
import { useContext } from 'react';
import { AppContext } from '@/app/contexts/app-context';
import PublicDashboard from '@/components/public/public-dashboard';
import AdminDashboard from '@/components/admin/admin-dashboard';
import Header from '@/components/shared/header';

export default function Home() {
  const context = useContext(AppContext);

  if (!context) {
    return null; // or a loading spinner
  }

  const { role } = context;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {role === 'public' ? <PublicDashboard /> : <AdminDashboard />}
      </main>
      <footer className="text-center p-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} JalSuraksha Indore. All rights reserved.</p>
      </footer>
    </div>
  );
}
