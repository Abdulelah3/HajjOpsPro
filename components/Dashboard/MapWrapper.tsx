'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet icon issue
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

import { Location } from '@/lib/types'

interface MapWrapperProps {
  locations: Location[]
}

export default function MapWrapper({ locations }: MapWrapperProps) {
  const center: [number, number] = [21.4225, 39.8262]

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Real Locations Markers */}
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
          <Popup>
            <div className="text-right font-bold space-y-1">
              <p className="text-[var(--color-primary)]">{loc.name}</p>
              <p className="text-xs text-gray-500">{loc.company}</p>
              <p className="text-xs bg-gray-100 p-1 rounded">الحجاج: {loc.pilgrimsCount}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Default Center Marker if no locations */}
      {locations.length === 0 && (
        <Marker position={center} icon={customIcon}>
          <Popup>
            <div className="text-right font-bold">فندق هوليداي إن مكة</div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
