'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- ADDED: To refresh the UI after update
import { Incident } from '@/db/schema';
import { updateIncidentStatusAction } from '@/actions/incidents';
import { AlertTriangle, Clock, MapPin, CheckCircle2, Loader2, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IncidentStatuses } from '@/lib/constants';

interface IncidentCardProps {
  incident: any; // Changed to 'any' to prevent TS errors from our demo mock data missing DB fields
  technicianId: string;
}

export function IncidentCard({ incident, technicianId }: IncidentCardProps) {
  const t = useTranslations('technician');
  const router = useRouter(); // <-- ADDED
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'HIGH': return 'bg-warning/10 text-warning border-warning/30';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    alert(`BUTTON CLICKED! Trying to update to: ${newStatus}`); 
    console.log("Button clicked! Updating to:", newStatus); // <-- ADDED: For debugging
    setIsUpdating(true);
    const resolvedAt = newStatus === IncidentStatuses.RESOLVED ? new Date().toISOString() : undefined;
    
    const res = await updateIncidentStatusAction(
      incident.incidentId,
      newStatus,
      technicianId,
      resolvedAt
    );

    if (res.success) {
      router.refresh(); // <-- ADDED: This is the magic! It tells Next.js to re-fetch the updated data
    } else {
      alert(res.message || "Failed to update status");
    }
    setIsUpdating(false);
  };

  const timeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-card border-2 border-border rounded-xl p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Priority & Time */}
      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityStyles(incident.priority)}`}>
          {incident.priority}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <Clock className="h-3.5 w-3.5" />
          {timeAgo(incident.createdAt)}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          {incident.waterpointId.replace('WATERPOINT#', '').substring(0, 8)}... 
        </h3>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {incident.issueType.replace('_', ' ')}
        </p>
        {incident.description && (
          <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg border border-border">
            "{incident.description}"
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {t('tracking')}: <span className="font-mono font-bold text-foreground">{incident.trackingId}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        {incident.status === IncidentStatuses.OPEN && (
          <button
            onClick={() => handleStatusUpdate(IncidentStatuses.IN_PROGRESS)}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
            {t('acceptJob')}
          </button>
        )}

        {incident.status === IncidentStatuses.IN_PROGRESS && (
          <button
            onClick={() => handleStatusUpdate(IncidentStatuses.RESOLVED)}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground font-bold text-sm hover:bg-success/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {t('markResolved')}
          </button>
        )}

        {incident.status === IncidentStatuses.RESOLVED && (
          <div className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-muted text-muted-foreground font-bold text-sm border border-border">
            <CheckCircle2 className="h-4 w-4 text-success" />
            {t('resolved')}
          </div>
        )}
      </div>
    </div>
  );
}