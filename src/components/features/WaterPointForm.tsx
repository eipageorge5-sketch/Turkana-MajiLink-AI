'use client';

import { useState } from 'react';
import { createWaterPointAction } from '@/actions/waterpoints';
import { WaterPointTypes, OwnerTypes } from '@/lib/constants';
import { MapPin, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const WARDS = [
  { id: "ward-kanamkemer", name: "Kanamkemer" },
  { id: "ward-kerio", name: "Kerio Delta" },
  { id: "ward-kalokol", name: "Kalokol" },
  { id: "ward-lodwar", name: "Lodwar" },
  { id: "ward-kaeris", name: "Kaeris" },
  { id: "ward-kibish", name: "Kibish" },
  { id: "ward-kaputir", name: "Kaputir" },
  { id: "ward-lokichar", name: "Lokichar" },
  { id: "ward-kakuma", name: "Kakuma" },
  { id: "ward-lokitaung", name: "Lokitaung" },
];

export function WaterPointForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    type: Object.values(WaterPointTypes)[0],
    ownerType: Object.values(OwnerTypes)[0],
    latitude: '',
    longitude: '',
    wardId: WARDS[0].id,
  });

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setGpsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      (error) => {
        console.warn("Geolocation failed:", error.message);
        // FALLBACK: Default to Lodwar, Turkana coordinates if it fails or times out
        setForm(prev => ({
          ...prev,
          latitude: "3.1197",
          longitude: "35.5968",
        }));
        alert("Could not get exact location. Defaulted to Lodwar center. Please adjust manually if needed.");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: false, // Faster: uses Wi-Fi/IP instead of waiting for satellite GPS
        timeout: 5000, // Max 5 seconds wait
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await createWaterPointAction({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    });

    if (res.success) {
      setSuccess(true);
      setForm({ name: '', type: Object.values(WaterPointTypes)[0], ownerType: Object.values(OwnerTypes)[0], latitude: '', longitude: '', wardId: WARDS[0].id });
    } else {
      alert(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border-2 border-border rounded-xl space-y-5">
      <h3 className="text-lg font-bold text-foreground">Register New Water Point</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring" placeholder="e.g. Napetet Community Borehole" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring">
            {Object.values(WaterPointTypes).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Ownership</label>
          <select value={form.ownerType} onChange={e => setForm({...form, ownerType: e.target.value})} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring">
            {Object.values(OwnerTypes).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Ward</label>
          <select value={form.wardId} onChange={e => setForm({...form, wardId: e.target.value})} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring">
            {WARDS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">GPS Coordinates</label>
          <div className="flex gap-2">
            <input required type="number" step="any" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} className="w-1/2 h-10 px-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring" placeholder="Lat" />
            <input required type="number" step="any" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} className="w-1/2 h-10 px-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring" placeholder="Lng" />
            <button 
              type="button" 
              onClick={captureGPS} 
              disabled={gpsLoading} 
              className="h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
              title="Auto-detect location"
            >
              {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> 
            If auto-detect fails, it defaults to Lodwar. You can edit manually.
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-success/10 text-success border border-success/20 rounded-md text-sm font-semibold">
          <CheckCircle2 className="h-4 w-4" /> Water point registered and added to the map!
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full h-11 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Water Point"}
      </button>
    </form>
  );
}