'use client';

import { useState } from 'react';
import { IncidentCard } from '@/components/features/IncidentCard';
import { ClipboardList, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IncidentStatuses } from '@/lib/constants';

export function TechnicianDashboardClient({ 
  initialIncidents, 
  technicianId 
}: { 
  initialIncidents: any[]; 
  technicianId: string; 
}) {
  const t = useTranslations('technician');
  
  // Hold the incidents in local state so we can update them instantly
  const [incidents, setIncidents] = useState(initialIncidents);

  // This function is called by the IncidentCard when a button is clicked
  const handleStatusChange = (incidentId: string, newStatus: string) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(inc => 
        inc.incidentId === incidentId ? { ...inc, status: newStatus } : inc
      )
    );
  };

  // Calculate stats based on the LIVE local state
  const openCount = incidents.filter((i: any) => i.status === 'OPEN').length;
  const inProgressCount = incidents.filter((i: any) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = incidents.filter((i: any) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-4 text-center">
          <AlertTriangle className="h-6 w-6 mx-auto text-destructive mb-2" />
          <p className="text-2xl font-bold text-foreground">{openCount}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase">{t('statOpen')}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-4 text-center">
          <Wrench className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase">{t('statProgress')}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-4 text-center">
          <CheckCircle2 className="h-6 w-6 mx-auto text-success mb-2" />
          <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase">{t('statResolved')}</p>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          {t('assignedJobs')}
        </h2>

        {incidents.length === 0 ? (
          <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded-xl">
            <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-lg font-semibold text-foreground">{t('noJobs')}</p>
            <p className="text-sm text-muted-foreground">{t('noJobsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <IncidentCard 
                key={incident.incidentId} 
                incident={incident} 
                technicianId={technicianId}
                onStatusChange={handleStatusChange} // <-- This connects the card to the parent stats!
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}