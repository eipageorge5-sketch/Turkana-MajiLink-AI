'use client';

import { useState } from 'react';
import { 
  Users, AlertCircle, CheckCircle2, MapPin, 
  Clock, ShieldCheck, Loader2, Droplets 
} from 'lucide-react';

interface Verification {
  id: string;
  citizenName: string;
  location: string;
  issue: string;
  reportedAt: string;
  status: 'PENDING' | 'VERIFIED';
}

interface CommitteeDashboardClientProps {
  initialData: {
    villageName: string;
    localStats: { totalWaterpoints: number; pendingReports: number; verifiedThisMonth: number };
    pendingVerifications: Verification[];
  };
}

export function CommitteeDashboardClient({ initialData }: CommitteeDashboardClientProps) {
  const { villageName, localStats } = initialData;
  
  // State to handle interactive verifications
  const [verifications, setVerifications] = useState<Verification[]>(initialData.pendingVerifications);

  const handleVerify = (id: string) => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? { ...v, status: 'VERIFIED' } : v)
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Community Committee Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Oversight for <span className="font-semibold text-foreground">{villageName}</span></p>
      </div>

      {/* 1. Localized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Local Waterpoints</p>
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{localStats.totalWaterpoints}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{verifications.filter(v => v.status === 'PENDING').length}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Verified This Month</p>
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{localStats.verifiedThisMonth}</p>
        </div>
      </div>

      {/* 2. Pending Verifications Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          Citizen Reports Awaiting Verification
        </h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          {verifications.map((report, index) => (
            <div key={report.id} className={`p-5 ${index !== verifications.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{report.id}</span>
                    <span className="text-sm font-semibold text-foreground">{report.citizenName}</span>
                  </div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {report.location}
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                    "{report.issue}"
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Reported {report.reportedAt}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-end gap-2 min-w-[160px]">
                  {report.status === 'PENDING' ? (
                    <button
                      onClick={() => handleVerify(report.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify & Dispatch
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200 font-bold text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified & Dispatched
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}