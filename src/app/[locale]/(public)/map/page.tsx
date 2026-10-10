import { getWaterPointsForMap } from '@/actions/waterpoints';
import WaterMapWrapper from '@/components/maps/WaterMapWrapper';
import { Loader2, Droplets } from 'lucide-react';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';

export default async function PublicMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('map');
  const { locale } = await params;
  // Safely calls your server action data payload array
  const response = await getWaterPointsForMap();
  const waterPoints = response?.success && response?.data ? response.data : [];

  return (
    <main className="flex flex-col h-screen bg-background" suppressHydrationWarning>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b-2 border-border bg-card z-10">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Droplets className="h-6 w-6" />
          {t('title')}
        </h1>
        <div className="flex items-center gap-4">
          {/* Legend - Hidden on very small screens to save space */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-success border border-white shadow"></span> 
              {t('legendHealthy')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-warning border border-white shadow"></span> 
              {t('legendWarning')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive border border-white shadow"></span> 
              {t('legendCritical')}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative p-2 sm:p-4">
        {/* Swapped out to the secure browser wrapper to completely stop the window crash */}
       <WaterMapWrapper key={locale} waterPoints={waterPoints} />
      </div>
    </main>
  );
}