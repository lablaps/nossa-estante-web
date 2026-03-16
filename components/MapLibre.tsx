
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MarkerPoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

interface MapLibreProps {
  lat: number;
  lng: number;
  zoom?: number;
  markers?: MarkerPoint[];
  onMarkerClick?: (marker: MarkerPoint) => void;
}

const MapLibre: React.FC<MapLibreProps> = ({ lat, lng, zoom = 13, markers = [], onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerRefs = useRef<maplibregl.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [lng, lat],
        zoom: zoom
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Only on mount

  // Update Center/Zoom
  useEffect(() => {
    if (map.current) {
      map.current.setCenter([lng, lat]);
      map.current.setZoom(zoom);
    }
  }, [lat, lng, zoom]);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markerRefs.current.forEach(m => m.remove());
    markerRefs.current = [];

    // Add new markers
    markers.forEach(point => {
      // Create a DOM element for the marker if we want a custom look or labels
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = '#13ec5b';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      
      if (point.label) {
        const labelEl = document.createElement('span');
        labelEl.innerText = point.label;
        labelEl.style.position = 'absolute';
        labelEl.style.top = '50%';
        labelEl.style.left = '50%';
        labelEl.style.transform = 'translate(-50%, -50%)';
        labelEl.style.color = '#000';
        labelEl.style.fontSize = '8px';
        labelEl.style.fontWeight = '900';
        el.appendChild(labelEl);
      }

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onMarkerClick?.(point);
      });

      markerRefs.current.push(m);
    });

    // If there's a single marker (from BookDetails logic where lat/lng is passed directly as center)
    if (markers.length === 0) {
      const m = new maplibregl.Marker({ color: '#13ec5b' })
        .setLngLat([lng, lat])
        .addTo(map.current);
      markerRefs.current.push(m);
    }

  }, [markers, onMarkerClick, lat, lng]);

  return <div ref={mapContainer} className="w-full h-full rounded-2xl md:rounded-3xl shadow-inner overflow-hidden" />;
};

export default MapLibre;
