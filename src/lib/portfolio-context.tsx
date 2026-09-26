import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

interface PortfolioDataContextValue extends ReturnType<typeof usePortfolioData> {}

const PortfolioDataContext = createContext<PortfolioDataContextValue | undefined>(undefined);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const data = usePortfolioData();
  return (
    <PortfolioDataContext.Provider value={data}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioDataProvider');
  return ctx;
}
