'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Using a lazy loader completely cuts off server-side importing conflicts
const LazyWaterMap = dynamic(
  () => import('./WaterMap').then(mod => mod.WaterMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[550px] bg-muted/20 border-2 border-dashed rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Initializing Map Layers...</p>
        </div>
      </div>
    ),
  }
);

export default function WaterMapWrapper({ waterPoints }: { waterPoints: any[] }) {
  return <LazyWaterMap waterPoints={waterPoints} />;
}