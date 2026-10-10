'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function OfflineIndicator() {
  const t = useTranslations('common');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-warning text-warning-foreground py-2 px-4 text-sm font-bold shadow-md border-b-2 border-warning-foreground/20">
      <WifiOff className="h-4 w-4" />
      <span>{t('offline')}</span>
    </div>
  );
}