"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

interface WardMapClientProps {
  currentLocation: [number, number] | null;
  filteredWards: any[];
  onWardSelect: (ward: any) => void;
}

export default function WardMapClient({ currentLocation, filteredWards, onWardSelect }: WardMapClientProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [createCustomIcon, setCreateCustomIcon] = useState<any>(null);
  const [currentLocationIcon, setCurrentLocationIcon] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const initLeaflet = async () => {
      const leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix for default markers
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setL(leaflet.default);
      
      // Custom icons
      const customIconFn = (status: string) => {
        const color = status === 'Safe' ? '#10b981' : status === 'Moderate' ? '#f59e0b' : '#ef4444';
        return leaflet.default.divIcon({
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-div-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
      };
      
      const locationIcon = leaflet.default.divIcon({
        html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
        className: 'current-location-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      
      setCreateCustomIcon(() => customIconFn);
      setCurrentLocationIcon(locationIcon);
    };
    
    initLeaflet();
  }, []);

  const indoreCenter: [number, number] = [22.7196, 75.8577];

  if (!isClient || !L || !createCustomIcon || !currentLocationIcon) {
    return <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-[600px] w-full relative">
      <MapContainer
        center={currentLocation || indoreCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        className="rounded-b-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker position={currentLocation} icon={currentLocationIcon} />
        
        {filteredWards.map((ward) => (
          <Marker
            key={ward.id}
            position={[ward.lat, ward.lng]}
            icon={createCustomIcon(ward.status)}
            eventHandlers={{
              click: () => onWardSelect(ward),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{ward.name}</h3>
                <div className="text-xs space-y-1 mt-2">
                  <div>Status: <span className={`font-medium ${
                    ward.status === 'Safe' ? 'text-green-600' : 
                    ward.status === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{ward.status}</span></div>
                  <div>pH: {ward.ph}</div>
                  <div>Turbidity: {ward.turbidity} NTU</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// Component to handle map centering
function LocationMarker({ position, icon }: { position: [number, number] | null; icon: any }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return position ? (
    <Marker position={position} icon={icon}>
      <Popup>Your current location</Popup>
    </Marker>
  ) : null;
}