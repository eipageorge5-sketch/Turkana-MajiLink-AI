'use client';

import { useState } from 'react';
import { 
  Map, AlertOctagon, Trophy, Droplets, 
  Clock, TrendingDown, Medal, CheckCircle, Zap,
  FileText, Loader2, Mail
} from 'lucide-react';

interface Escalation {
  id: string;
  location: string;
  issue: string;
  priority: string;
  daysOpen: number;
  status: 'PENDING' | 'FUNDED';
}

interface CountyDashboardClientProps {
  initialData: {
    wardStats: { ward: string; totalPumps: number; brokenPumps: number; health: number }[];
    escalations: Escalation[];
    leaderboard: { rank: number; name: string; ward: string; resolved: number }[];
  };
}

export function CountyDashboardClient({ initialData }: CountyDashboardClientProps) {
  const { wardStats, leaderboard } = initialData;
  
  // State for interactive approvals
  const [escalations, setEscalations] = useState<Escalation[]>(
    initialData.escalations.map(e => ({ ...e, status: 'PENDING' }))
  );

  // State for the Report Generator
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'sent'>('idle');

  const handleApprove = (id: string) => {
    setEscalations(prev => 
      prev.map(e => e.id === id ? { ...e, status: 'FUNDED' } : e)
    );
  };

  const handleGenerateReport = () => {
    setReportState('generating');
    // Simulate a 1.5 second API call to generate the PDF
    setTimeout(() => {
      setReportState('sent');
      alert("📄 Monthly Report Generated!\n\n• 142 Waterpoints Analyzed\n• 85% Resolution Rate\n• 3 Critical Escalations Flagged\n\n Report successfully emailed to county@majilink.com and the Governor's office.");
      
      // Reset back to idle after 3 seconds so it can be clicked again
      setTimeout(() => setReportState('idle'), 3000);
    }, 1500);
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600 bg-green-100 border-green-200';
    if (health >= 85) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header with Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            County Oversight Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Regional performance and critical escalations.</p>
        </div>

        {/* The Magic Report Button */}
        <button
          onClick={handleGenerateReport}
          disabled={reportState !== 'idle'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer shadow-sm ${
            reportState === 'sent' 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : reportState === 'generating'
              ? 'bg-muted text-muted-foreground cursor-wait'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          {reportState === 'idle' && <><FileText className="h-4 w-4" /> Generate Monthly Report</>}
          {reportState === 'generating' && <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...</>}
          {reportState === 'sent' && <><CheckCircle className="h-4 w-4" /> Report Sent!</>}
        </button>
      </div>

      {/* 1. Ward Performance Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Droplets className="h-5 w-5 text-muted-foreground" />
          Ward Infrastructure Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wardStats.map((ward) => (
            <div key={ward.ward} className="bg-card border-2 border-border rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-foreground">{ward.ward}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getHealthColor(ward.health)}`}>
                  {ward.health}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Pumps: <span className="font-bold text-foreground">{ward.totalPumps}</span></p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-destructive" /> 
                  Broken: <span className="font-bold text-destructive">{ward.brokenPumps}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Escalation Queue */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-destructive" />
            Critical Escalations
          </h2>
          <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
            {escalations.map((esc, index) => (
              <div key={esc.id} className={`p-4 ${index !== escalations.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground text-sm">{esc.location}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    esc.status === 'FUNDED' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-destructive text-destructive-foreground'
                  }`}>
                    {esc.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{esc.issue}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-destructive font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    Unresolved for {esc.daysOpen} days
                  </div>
                  
                  {esc.status === 'PENDING' && (
                    <button
                      onClick={() => handleApprove(esc.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Approve & Dispatch
                    </button>
                  )}
                  
                  {esc.status === 'FUNDED' && (
                    <div className="flex items-center gap-1 text-xs text-green-700 font-bold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Technician Dispatched
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Technician Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Performing Technicians
          </h2>
          <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
            {leaderboard.map((tech) => (
              <div key={tech.rank} className="p-4 flex items-center gap-4 border-b border-border last:border-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  tech.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                  tech.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                  'bg-orange-100 text-orange-700'
                }`}>
                  {tech.rank === 1 ? <Medal className="h-5 w-5" /> : tech.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.ward} Ward</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg">{tech.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}