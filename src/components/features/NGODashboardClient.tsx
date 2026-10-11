'use client';

import { useState } from 'react';
import { 
  Heart, DollarSign, Users, Droplets, 
  TrendingUp, CheckCircle, Loader2, MapPin,
  AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  totalGrant: number;
  utilized: number;
  status: 'ACTIVE' | 'COMPLETED';
}

interface NGODashboardClientProps {
  initialData: {
    impactStats: { totalFundsDeployed: number; waterpointsFunded: number; peopleImpacted: number; activeGrants: number };
    activeProjects: Project[];
  };
}

export function NGODashboardClient({ initialData }: NGODashboardClientProps) {
  const { impactStats } = initialData;
  const [projects, setProjects] = useState<Project[]>(initialData.activeProjects);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const handleReleaseFunds = (id: string) => {
    setReleasingId(id);
    // Simulate API call
    setTimeout(() => {
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, utilized: Math.min(p.utilized + 5000, p.totalGrant) } : p
      ));
      setReleasingId(null);
      alert("💸 Funds Released Successfully!\n\n$5,000 has been disbursed to the County Treasury for immediate technician dispatch.");
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          NGO Partner Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Transparency, Impact, and Grant Utilization.</p>
      </div>

      {/* 1. Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Total Funds Deployed</p>
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(impactStats.totalFundsDeployed)}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Waterpoints Funded</p>
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{impactStats.waterpointsFunded}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">People Impacted</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{impactStats.peopleImpacted.toLocaleString()}</p>
        </div>
        <div className="bg-card border-2 border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground">Active Grants</p>
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{impactStats.activeGrants}</p>
        </div>
      </div>

      {/* 2. Active Projects & Funding Utilization */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          Funded Projects & Grant Utilization
        </h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          {projects.map((project, index) => {
            const percentage = Math.round((project.utilized / project.totalGrant) * 100);
            const isComplete = project.status === 'COMPLETED';
            
            return (
              <div key={project.id} className={`p-6 ${index !== projects.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{project.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${isComplete ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" /> {project.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Utilized</p>
                    <p className="font-bold text-foreground">{formatCurrency(project.utilized)} <span className="text-muted-foreground font-normal">/ {formatCurrency(project.totalGrant)}</span></p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${isComplete ? 'bg-success' : 'bg-primary'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Action Button */}
                {!isComplete && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleReleaseFunds(project.id)}
                      disabled={releasingId === project.id || percentage === 100}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {releasingId === project.id ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing Disbursement...</>
                      ) : (
                        <><DollarSign className="h-4 w-4" /> Release Next Tranche ($5,000)</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}