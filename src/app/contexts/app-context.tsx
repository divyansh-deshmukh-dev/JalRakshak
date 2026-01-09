'use client';

import { createContext, useState, ReactNode, useMemo } from 'react';
import type { Role } from '@/lib/types';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('public');

  const contextValue = useMemo(() => ({
    role,
    setRole,
  }), [role]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
