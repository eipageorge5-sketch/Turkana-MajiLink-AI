'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { createPublicIncidentAction } from '@/actions/incidents';
import { IssueTypes } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { saveReportOffline } from '@/lib/offline-queue';

interface PublicReportModalProps {
  waterpointId: string;
  waterpointName: string;
  onClose: () => void;
}

// Explicitly type the form state to avoid TypeScript literal union conflicts with e.target.value
interface ReportFormState {
  issueType: string;
  description: string;
}

export function PublicReportModal({ waterpointId, waterpointName, onClose }: PublicReportModalProps) {
  const t = useTranslations('report');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isOfflineSave, setIsOfflineSave] = useState(false); // NEW: Track if saved offline
  
  const [form, setForm] = useState<ReportFormState>({
    issueType: Object.values(IssueTypes)[0],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const reportData = {
      waterpointId,
      waterpointName,
      issueType: form.issueType,
      description: form.description,
    };

    // CHECK 1: Are we online?
    if (navigator.onLine) {
      const res = await createPublicIncidentAction(reportData);
      if (res.success) {
        setTrackingId(res.trackingId || '');
        setIsOfflineSave(false);
        setSuccess(true);
      } else {
        alert(res.message);
      }
    } 
    // CHECK 2: We are offline, save to IndexedDB
    else {
      try {
        await saveReportOffline(reportData);
        
        // Attempt to register background sync for Chrome/Android
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await ( registration as any) .sync.register('sync-majilink-reports');
        }

        // Generate a temporary pending tracking ID
        setTrackingId('PENDING-' + Math.floor(1000 + Math.random() * 9000));
        setIsOfflineSave(true);
        setSuccess(true);
      } catch (error) {
        console.error('Failed to save offline:', error);
        alert('Failed to save report locally. Please try again.');
      }
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="absolute inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
        <div className="bg-card border-2 border-border rounded-xl p-6 max-w-md w-full text-center space-y-4">
          
          {/* Conditional Icon based on online/offline status */}
          {isOfflineSave ? (
            <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
          ) : (
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
          )}
          
          {/* Conditional Title and Message */}
          <h3 className="text-xl font-bold text-foreground">
            {isOfflineSave ? t('savedOfflineTitle') : t('successTitle')}
          </h3>
          <p className="text-muted-foreground">
            {isOfflineSave ? t('savedOfflineMessage') : t('successMessage')}
          </p>
          
          <div className="bg-muted p-3 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase font-bold">{t('trackingId')}</p>
            <p className="text-2xl font-mono font-bold text-primary">{trackingId}</p>
          </div>
          
          <button onClick={onClose} className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90">
            {t('close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border-2 border-border rounded-xl max-w-md w-full flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-foreground">{t('title')}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <div className="bg-muted/50 p-3 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase font-bold">{t('reportingFor')}</p>
            <p className="font-semibold text-foreground">{waterpointName}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('issueType')}</label>
            <select 
              value={form.issueType} 
              onChange={(e) => setForm({ ...form, issueType: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring"
            >
              {Object.values(IssueTypes).map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('description')}</label>
            <textarea 
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring resize-none"
              placeholder={t('descriptionPlaceholder')}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 rounded-md bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}