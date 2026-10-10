'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state based on browser
    setIsOnline(typeof window !== 'undefined' ? navigator.onLine : true);

    // Listen for network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If online, render nothing
  if (isOnline) return null;

  // If offline, render a bright, impossible-to-miss red banner
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-3 px-4 flex items-center justify-center gap-2 shadow-md">
      <WifiOff className="h-5 w-5" />
      <p className="text-sm font-bold">
        You are offline. Reports will save locally and sync automatically.
      </p>
    </div>
  );
}