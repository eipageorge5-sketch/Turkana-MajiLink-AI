'use client';

import { useOfflineSync } from '@/hooks/use-offline-sync';

export function OfflineSyncActivator() {
  useOfflineSync();
  return null;
}