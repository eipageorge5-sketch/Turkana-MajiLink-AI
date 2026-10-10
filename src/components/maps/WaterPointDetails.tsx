'use client';

import { WaterPoint } from '@/db/schema';
import { X, Droplets, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WaterPointDetailsProps {
  point: WaterPoint;
  onClose: () => void;
  onReport: () => void;
}

export function WaterPointDetails({ point, onClose, onReport }: WaterPointDetailsProps) {
  const t = useTranslations('map');

  const getStatusColor = (score: number) => {
    if (score < 60) return 'text-destructive bg-destructive/10 border-destructive/20';
    if (score < 90) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-success bg-success/10 border-success/20';
  };

  const getStatusLabel = (score: number) => {
    if (score < 60) return t('statusCritical');
    if (score < 90) return t('statusWarning');
    return t('statusHealthy');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-96 bg-card border-2 border-border shadow-2xl z-[1000] flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-muted/50">
        <h2 className="text-lg font-bold text-foreground truncate pr-2">{point.name}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Close details"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Health Score Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-sm ${getStatusColor(point.healthScore)}`}>
          <AlertTriangle className="h-4 w-4" />
          {point.healthScore}% - {getStatusLabel(point.healthScore)}
        </div>

        {/* Details List */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('type')}</p>
              <p className="text-sm font-medium text-foreground">{t(`types.${point.type}`)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('owner')}</p>
              <p className="text-sm font-medium text-foreground">{t(`owners.${point.ownerType}`)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('incidents')}</p>
              <p className="text-sm font-medium text-foreground">{point.incidentCount} {t('reportedIssues')}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
    onClick={onReport}
    className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-3 text-base font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
  >
    <AlertTriangle className="h-4 w-4" />
    {t('reportIssueHere')}
  </button>
      </div>
    </div>
  );
}