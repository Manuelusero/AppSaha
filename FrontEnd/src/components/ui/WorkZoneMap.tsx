'use client';

import { useEffect, useRef, useState } from 'react';

interface WorkZoneMapProps {
  location: string;
  radiusKm: number;
}

// Simple Nominatim geocoding (free, no API key needed)
async function geocodeLocation(place: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = place.includes('Argentina') ? place : `${place}, Argentina`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=ar`,
      { headers: { 'User-Agent': 'SercoApp/1.0 (app-saha.vercel.app)' } }
    );
    const data = await res.json();
    if (data?.[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch { /* silent */ }
  return null;
}

export default function WorkZoneMap({ location, radiusKm }: WorkZoneMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const initializedRef = useRef(false);

  // Initialize map once the container is rendered
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const initMap = async () => {
      setLoading(true);
      try {
        const L = (await import('leaflet')).default;
        // Leaflet CSS loaded once
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Fix Leaflet default icon path issue in Next.js
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const coords = await geocodeLocation(location);
        if (!coords) { setError(true); setLoading(false); return; }

        const map = L.map(containerRef.current!, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false
        }).setView([coords.lat, coords.lng], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Custom pin icon
        const pinIcon = L.divIcon({
          className: '',
          html: `<div style="width:28px;height:28px;background:#244C87;border:3px solid white;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        });
        L.marker([coords.lat, coords.lng], { icon: pinIcon }).addTo(map);

        // Radius circle
        if (radiusKm > 0) {
          circleRef.current = L.circle([coords.lat, coords.lng], {
            radius: radiusKm * 1000,
            color: '#244C87',
            fillColor: '#244C87',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '8 5'
          }).addTo(map);
        }

        mapRef.current = map;
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    initMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update circle radius when prop changes
  useEffect(() => {
    if (!mapRef.current || !circleRef.current) return;
    circleRef.current.setRadius(radiusKm * 1000);
  }, [radiusKm]);

  // Invalidate map size when container resizes (expand/collapse)
  useEffect(() => {
    if (!mapRef.current) return;
    setTimeout(() => mapRef.current.invalidateSize(), 310);
  }, [expanded]);

  const height = expanded ? '380px' : '220px';

  return (
    <div>
      {/* Map container */}
      <div
        style={{
          width: '100%',
          height,
          transition: 'height 0.3s ease',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid #E5E7EB',
          position: 'relative',
          background: '#F3F4F6'
        }}
      >
        {/* Leaflet mounts here */}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', borderRadius: '20px' }}>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#9CA3AF' }}>Cargando mapa...</p>
          </div>
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', borderRadius: '20px' }}>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#9CA3AF' }}>No se pudo cargar el mapa</p>
          </div>
        )}

        {/* Radio badge */}
        {!loading && !error && radiusKm > 0 && (
          <div style={{
            position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
            background: 'white', padding: '6px 16px', borderRadius: '999px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'Maitree, serif', fontSize: '13px', color: '#1F2937',
            zIndex: 500, whiteSpace: 'nowrap', pointerEvents: 'none'
          }}>
            Radio: {radiusKm} km
          </div>
        )}
      </div>

      {/* Expand / Collapse button */}
      {!loading && !error && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px',
            borderRadius: '12px',
            border: '1.5px solid #E5E7EB',
            background: 'white',
            fontFamily: 'Maitree, serif',
            fontSize: '13px',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {expanded ? (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
              Contraer mapa
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              Expandir mapa
            </>
          )}
        </button>
      )}
    </div>
  );
}
