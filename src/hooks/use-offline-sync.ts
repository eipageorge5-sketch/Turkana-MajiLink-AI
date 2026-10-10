'use client';

import { useEffect } from 'react';
import { getPendingReports, clearPendingReports } from '@/lib/offline-queue';

export function useOfflineSync() {
  useEffect(() => {
    const syncReports = async () => {
      if (!navigator.onLine) return;

      const pending = await getPendingReports();
      if (pending.length === 0) return;

      console.log(`🔄 Found ${pending.length} offline reports. Syncing...`);

      try {
        const response = await fetch('/api/sync-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reports: pending }),
        });

        const result = await response.json();
        if (result.success) {
          await clearPendingReports();
          console.log('✅ Offline reports synced successfully!');
          
          // Optional: Show a subtle toast notification here in the future
        }
      } catch (error) {
        console.error('❌ Failed to sync offline reports:', error);
      }
    };

    // 1. Sync on initial load if online
    syncReports();

    // 2. Sync whenever the user comes back online
    window.addEventListener('online', syncReports);

    return () => {
      window.removeEventListener('online', syncReports);
    };
  }, []);
}