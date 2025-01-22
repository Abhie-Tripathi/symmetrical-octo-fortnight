"use client"

import React, { useState, useCallback, useMemo } from 'react'
import Map, { Marker, Source, Layer } from 'react-map-gl'
import { point, circle } from '@turf/turf'
import { FaMusic, FaTheaterMasks, FaGraduationCap, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa'
import { PulsingDot } from './pulsingdot'
import { CustomPopup } from './popup'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg"

interface Event {
  id: number
  name: string
  location: [number, number]
  type: 'music' | 'theater' | 'education' | 'business' | 'other'
  address: string
  date: string
}

const eventData: Event[] = [
  { id: 1, name: "Open Mic - Laughter Club 2024", location: [77.6446, 12.9716], type: "theater", address: "24/1, Vittal Mallya Rd, KG Halli, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001, India", date: "Fri, 09 Aug 2024 - Sun, 11 Aug 2024 (3 days)" },
  { id: 2, name: "Music Festival", location: [77.6366, 12.9784], type: "music", address: "Cubbon Park, Bengaluru", date: "Sat, 10 Aug 2024" },
  { id: 3, name: "Tech Conference", location: [77.6117, 12.9769], type: "education", address: "Palace Grounds, Bengaluru", date: "Mon, 12 Aug 2024 - Tue, 13 Aug 2024" },
  { id: 4, name: "Business Expo", location: [77.6446, 12.9580], type: "business", address: "Koramangala Indoor Stadium, Bengaluru", date: "Wed, 14 Aug 2024" },
]

const eventIcons = {
  music: <FaMusic className="text-purple-600" />,
  theater: <FaTheaterMasks className="text-green-600" />,
  education: <FaGraduationCap className="text-blue-600" />,
  business: <FaBuilding className="text-orange-600" />,
  other: <FaMapMarkerAlt className="text-red-600" />
}

const eventColors = {
  music: '#800080',
  theater: '#008000',
  education: '#0000FF',
  business: '#FFA500',
  other: '#FF0000'
}

export default function EventMap() {
  const [viewState, setViewState] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 12
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const onMove = useCallback(({ viewState }) => {
    setViewState(viewState)
  }, [])

  const circleLayer = useMemo(() => {
    const center = point([77.5946, 12.9716])
    const options = { steps: 50, units: 'kilometers' as const }
    const circleGeoJSON = circle(center, 5, options)

    return {
      id: 'circle-layer',
      type: 'fill' as const,
      source: {
        type: 'geojson',
        data: circleGeoJSON
      },
      paint: {
        'fill-color': 'rgba(138, 43, 226, 0.1)',
        'fill-outline-color': 'rgba(138, 43, 226, 0.8)'
      }
    }
  }, [])

  return (
    <div className="h-screen w-full">
      <Map
        {...viewState}
        onMove={onMove}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Source id="circle-source" type="geojson" data={circleLayer.source.data}>
          <Layer {...circleLayer} />
        </Source>

        {eventData.map((event) => (
          <Marker
            key={event.id}
            latitude={event.location[1]}
            longitude={event.location[0]}
          >
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault()
                setSelectedEvent(event)
              }}
            >
              <div className="relative">
                <PulsingDot color={eventColors[event.type]} size={40} />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  {eventIcons[event.type]}
                </div>
              </div>
            </button>
          </Marker>
        ))}

        {selectedEvent && (
          <CustomPopup
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
          <button className="px-4 py-2 bg-purple-600 text-white rounded">
            Event List
          </button>
        </div>
      </Map>
    </div>
  )
}