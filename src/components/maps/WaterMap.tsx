'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'; // Added Tooltip here
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { WaterPoint } from '@/db/schema';
import { WaterPointDetails } from './WaterPointDetails';
import { PublicReportModal } from '@/components/features/PublicReportModal';

// Fix for default marker icons in Next.js (prevents broken image icons)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Creates a custom HTML DivIcon based on the water point's health score.
 */
function createHealthIcon(healthScore: number) {
  let color = '#16a34a'; // Green (Healthy: 90-100)
  if (healthScore < 60) color = '#dc2626'; // Red (Critical: <60)
  else if (healthScore < 90) color = '#d97706'; // Amber (Warning: 60-89)

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

interface WaterMapProps {
  waterPoints: WaterPoint[];
}

export function WaterMap({ waterPoints }: WaterMapProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<WaterPoint | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default center for Turkana County, Kenya
  const center: [number, number] = [3.1197, 35.5968];

  if (!mounted) {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-xl border-2 border-border shadow-lg bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-medium text-sm">Loading Map Layout...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border-2 border-border shadow-lg bg-muted/20">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup>
          {waterPoints.map((point) => (
            <Marker
              key={point.waterpointId}
              position={[point.latitude, point.longitude]}
              icon={createHealthIcon(point.healthScore)}
              eventHandlers={{
                click: () => {
                  setSelectedPoint(point);
                  setIsReportModalOpen(false);
                },
              }}
            >
              {/* NEW: Tooltip shows on hover for desktop users */}
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="font-bold text-sm text-foreground">{point.name}</div>
                <div className="text-xs text-muted-foreground">Health: {point.healthScore}%</div>
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Details Panel Overlay (Opens on Click) */}
      {selectedPoint && (
        <WaterPointDetails 
          point={selectedPoint} 
          onClose={() => {
            setSelectedPoint(null);
            setIsReportModalOpen(false);
          }}
          onReport={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Public Report Modal Overlay */}
      {isReportModalOpen && selectedPoint && (
        <PublicReportModal 
          waterpointId={selectedPoint.waterpointId}
          waterpointName={selectedPoint.name}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}