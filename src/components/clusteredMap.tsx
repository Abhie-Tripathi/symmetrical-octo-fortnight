"use client"

import React, { useState, useEffect } from 'react'
import Map, { Source, Layer, Popup } from 'react-map-gl'
import * as turf from '@turf/turf'

// You'll need to get a Mapbox access token and replace 'YOUR_MAPBOX_ACCESS_TOKEN' with it
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg'

// Sample event data - replace this with your actual event data
const events = [
  { id: 1, name: 'Event 1', longitude: -122.4194, latitude: 37.7749 },
  { id: 2, name: 'Event 2', longitude: -122.4124, latitude: 37.7734 },
  // Add more events here
]

const clusterLayer = {
  id: 'clusters',
  type: 'symbol',
  source: 'events',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}k',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 16
  },
  paint: {
    'text-color': '#ffffff'
  }
}

const clusterBackgroundLayer = {
  id: 'cluster-background',
  type: 'circle',
  source: 'events',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#8b5cf6',
    'circle-radius': 20,
    'circle-opacity': 0.9
  }
}

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'events',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#8b5cf6',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
}

export default function ClusteredMap() {
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 10
  })
  const [eventData, setEventData] = useState(null)
  const [popupInfo, setPopupInfo] = useState(null)

  useEffect(() => {
    const points = turf.featureCollection(
      events.map(event => turf.point([event.longitude, event.latitude], { id: event.id, name: event.name }))
    )
    setEventData(points)
  }, [])

  const onClick = event => {
    const feature = event.features[0]
    if (feature) {
      if (feature.properties.cluster) {
        const clusterId = feature.properties.cluster_id
        const source = event.target.getSource('events')
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return
          event.target.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom
          })
        })
      } else {
        setPopupInfo(feature.properties)
      }
    }
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={onClick}
      >
        {eventData && (
          <Source
            id="events"
            type="geojson"
            data={eventData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterBackgroundLayer} />
            <Layer {...clusterLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <h3>{popupInfo.name}</h3>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}