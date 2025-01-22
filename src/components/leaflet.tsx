import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { FaMapMarkerAlt, FaMusic, FaTheaterMasks, FaGraduationCap, FaBuilding } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'

interface Event {
  id: number
  name: string
  location: [number, number]
  type: 'music' | 'theater' | 'education' | 'business' | 'other'
  address: string
  date: string
}

const eventData: Event[] = [
  { id: 1, name: "Open Mic - Laughter Club 2024", location: [12.9716, 77.6446], type: "theater", address: "24/1, Vittal Mallya Rd, KG Halli, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001, India", date: "Fri, 09 Aug 2024 - Sun, 11 Aug 2024 (3 days)" },
  { id: 2, name: "Music Festival", location: [12.9784, 77.6366], type: "music", address: "Cubbon Park, Bengaluru", date: "Sat, 10 Aug 2024" },
  { id: 3, name: "Tech Conference", location: [12.9769, 77.6117], type: "education", address: "Palace Grounds, Bengaluru", date: "Mon, 12 Aug 2024 - Tue, 13 Aug 2024" },
  { id: 4, name: "Business Expo", location: [12.9580, 77.6446], type: "business", address: "Koramangala Indoor Stadium, Bengaluru", date: "Wed, 14 Aug 2024" },
]

const eventIcons = {
  music: <FaMusic className="text-purple-600" />,
  theater: <FaTheaterMasks className="text-green-600" />,
  education: <FaGraduationCap className="text-blue-600" />,
  business: <FaBuilding className="text-orange-600" />,
  other: <FaMapMarkerAlt className="text-red-600" />
}

const createPulsingIcon = (color: string) => {
  return new Icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
    iconSize: [20, 20],
    className: `pulsing-icon ${color}`
  })
}

const eventIconColors = {
  music: 'purple',
  theater: 'green',
  education: 'blue',
  business: 'orange',
  other: 'red'
}

export default function EventMap() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const center: LatLngExpression = [12.9716, 77.5946]

  return (
    <div className="h-screen w-full">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Circle center={center} radius={5000} pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.1 }} />

        {eventData.map((event) => (
          <React.Fragment key={event.id}>
            <Marker 
              position={event.location} 
              icon={createPulsingIcon(eventIconColors[event.type])}
              eventHandlers={{
                click: () => {
                  setSelectedEvent(event)
                },
              }}
            />
            <CircleMarker 
              center={event.location}
              radius={10}
              pathOptions={{
                color: eventIconColors[event.type],
                fillColor: eventIconColors[event.type],
                fillOpacity: 0.5
              }}
            />
          </React.Fragment>
        ))}

        {selectedEvent && (
          <Popup
            position={selectedEvent.location}
            // onClose={() => setSelectedEvent(null)}
          >
            <div className="p-2 max-w-sm">
              <h3 className="text-lg font-semibold mb-1">{selectedEvent.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{selectedEvent.address}</p>
              <p className="text-sm text-gray-600">{selectedEvent.date}</p>
              <div className="mt-2">
                {eventIcons[selectedEvent.type]}
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow z-[1000]">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">
          Event List
        </button>
      </div>

      <style jsx global>{`
        .pulsing-icon {
          animation: pulse 1.5s infinite;
        }
        .pulsing-icon.purple { background-color: purple; }
        .pulsing-icon.green { background-color: green; }
        .pulsing-icon.blue { background-color: blue; }
        .pulsing-icon.orange { background-color: orange; }
        .pulsing-icon.red { background-color: red; }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.5);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}