import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue with module bundlers like esm.sh
// This ensures the marker images can be found and displayed.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface PrayerTimesMapProps {
    onMapClick: (lat: number, lng: number) => void;
    position: [number, number] | null;
}

const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
    const map = useMapEvents({
        click(e) {
            map.flyTo(e.latlng, map.getZoom());
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const PrayerTimesMap: React.FC<PrayerTimesMapProps> = ({ onMapClick, position }) => {
    return (
        <MapContainer 
          center={[24.7136, 46.6753]} // Default center on Riyadh
          zoom={4} 
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
          aria-label="Interactive world map for selecting a location"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={onMapClick} />
            {position && <Marker position={position} aria-hidden="true"></Marker>}
        </MapContainer>
    );
};

export default PrayerTimesMap;
