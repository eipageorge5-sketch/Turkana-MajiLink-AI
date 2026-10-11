'use client';

import { 
  Droplets, Users, AlertTriangle, TrendingUp, 
  BrainCircuit, MapPin, Clock, Activity 
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialData: {
    stats: { totalWaterpoints: number; activeTechnicians: number; openIncidents: number; resolutionRate: number };
    aiAlert: { title: string; message: string };
    recentReports: { id: string; location: string; issue: string; time: string; status: string; priority: string }[];
  };
}

export function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
  const { stats, aiAlert, recentReports } = initialData;

  const getPriorityColor = (p: string) => {
    if (p === 'HIGH') return 'text-red-600 bg-red-100 border-red-200';
    if (p === 'MEDIUM') return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-blue-600 bg-blue-100 border-blue-200';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Droplets className="h-8 w-8 text-primary" />
          System Command Center
        </h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Turkana water infrastructure.</p>
      </div>

      {/* 1. System Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Total Waterpoints</p>
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.totalWaterpoints}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Active Technicians</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.activeTechnicians}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Open Incidents</p>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.openIncidents}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.resolutionRate}%</p>
        </div>
      </div>

      {/* 2. AI-Powered Insights (The "Wow" Factor) */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {aiAlert.title}
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/30">LIVE</span>
            </h3>
            <p className="text-white/90 mt-1 text-sm md:text-base">{aiAlert.message}</p>
            <button className="mt-3 text-xs font-semibold bg-white text-purple-600 px-3 py-1.5 rounded-md hover:bg-white/90 transition-colors">
              View AI Analysis
            </button>
          </div>
        </div>
      </div>

      {/* 3. Global Incident Feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Global Incident Feed
        </h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          {recentReports.map((report, index) => (
            <div key={report.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== recentReports.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="bg-muted p-2 rounded-lg h-fit">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{report.location}</h4>
                  <p className="text-sm text-muted-foreground">{report.issue}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(report.priority)}`}>
                  {report.priority}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {report.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}