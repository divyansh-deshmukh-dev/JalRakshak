'use client';
import { useContext } from 'react';
import { AppContext } from '@/app/contexts/app-context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Droplets } from 'lucide-react';

export default function Header() {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }
  
  const { role, setRole } = context;

  const handleRoleChange = (isChecked: boolean) => {
    setRole(isChecked ? 'admin' : 'public');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Droplets className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            JalSuraksha
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="role-switch" className="text-sm font-medium text-muted-foreground">
            Public
          </Label>
          <Switch
            id="role-switch"
            checked={role === 'admin'}
            onCheckedChange={handleRoleChange}
            aria-label="Toggle between public and admin view"
          />
          <Label htmlFor="role-switch" className="text-sm font-medium">
            Admin
          </Label>
        </div>
      </div>
    </header>
  );
}
