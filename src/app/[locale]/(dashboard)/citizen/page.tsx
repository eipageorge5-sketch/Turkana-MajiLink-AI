'use client';

import { useState } from 'react';
import { 
  MapPin, Droplets, AlertTriangle, CheckCircle, 
  Clock, ArrowRight, Smartphone, Send, FileText 
} from 'lucide-react';

export default function CitizenReportingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myReports, setMyReports] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    waterpoint: '',
    issueType: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newId = `ML-${Math.floor(1000 + Math.random() * 9000)}`;
      setTrackingId(newId);
      
      const newReport = {
        id: newId,
        waterpoint: formData.waterpoint,
        issueType: formData.issueType,
        status: 'Pending Verification',
        date: new Date().toLocaleDateString()
      };
      
      setMyReports(prev => [newReport, ...prev]);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Droplets className="h-8 w-8 text-primary" />
          Citizen Reporting Hub
        </h1>
        <p className="text-muted-foreground mt-1">Report issues and track their resolution in real-time.</p>
      </div>

      {myReports.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            My Reports
          </h2>
          <div className="space-y-3">
            {myReports.map((report) => (
              <div key={report.id} className="bg-card border-2 border-border rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                      {report.id}
                    </span>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                  <p className="font-semibold text-foreground">{report.issueType}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {report.waterpoint}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSubmitted ? (
        <div className="bg-card border-2 border-border rounded-xl p-6 space-y-6 shadow-sm">
          <div className="text-center space-y-3 py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Report Submitted!</h2>
            <p className="text-muted-foreground">Your report has been securely logged and sent to your local Village Committee.</p>
          </div>

          <div className="text-center pb-6 border-b border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Your Tracking ID</p>
            <p className="text-3xl font-mono font-bold text-primary">{trackingId}</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Live Status Timeline
            </h3>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="w-0.5 h-full bg-primary mt-1"></div>
              </div>
              <div className="pb-6">
                <p className="font-bold text-foreground">Report Received</p>
                <p className="text-sm text-muted-foreground">Just now</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground border-2 border-border flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="w-0.5 h-full bg-muted mt-1"></div>
              </div>
              <div className="pb-6">
                <p className="font-bold text-muted-foreground">Committee Verification</p>
                <p className="text-sm text-muted-foreground">Pending local leader approval</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground border-2 border-border flex items-center justify-center">
                  <Smartphone className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="font-bold text-muted-foreground">Technician Dispatched</p>
                <p className="text-sm text-muted-foreground">Awaiting verification</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setIsSubmitted(false); setFormData({ waterpoint: '', issueType: '', description: '' }); }}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" /> Report Another Issue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card border-2 border-border rounded-xl p-6 space-y-5 shadow-sm">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> New Report
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Waterpoint Location
            </label>
            <select 
              required
              value={formData.waterpoint}
              onChange={(e) => setFormData({...formData, waterpoint: e.target.value})}
              className="w-full h-11 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Select a waterpoint...</option>
              <option value="Community Borehole #4">Community Borehole #4 (Kakuma)</option>
              <option value="School Pump #2">School Pump #2 (Lodwar)</option>
              <option value="Market Square Tank">Market Square Tank (Lopei)</option>
              <option value="Other">Other / Not Listed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Type of Issue
            </label>
            <select 
              required
              value={formData.issueType}
              onChange={(e) => setFormData({...formData, issueType: e.target.value})}
              className="w-full h-11 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Select an issue...</option>
              <option value="No Water Flow">No Water Flow</option>
              <option value="Broken Handle/Mechanical">Broken Handle / Mechanical Failure</option>
              <option value="Leakage">Visible Leakage</option>
              <option value="Water Quality">Water Quality (Taste/Smell/Color)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Additional Details (Optional)</label>
            <textarea 
              rows={4}
              placeholder="Describe the problem in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.waterpoint || !formData.issueType}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting Report...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" /> Submit Report
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-muted-foreground">
            In low-network areas, this report will be queued and sent automatically when connectivity returns.
          </p>
        </form>
      )}
    </div>
  );
}