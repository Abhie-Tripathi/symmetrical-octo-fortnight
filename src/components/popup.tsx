import React from 'react'
import { Popup } from 'react-map-gl'
import { FaMapMarkerAlt } from 'react-icons/fa'

interface Event {
  id: number
  name: string
  location: [number, number]
  type: 'music' | 'theater' | 'education' | 'business' | 'other'
  address: string
  date: string
}

interface CustomPopupProps {
  event: Event
  onClose: () => void
}

export const CustomPopup: React.FC<CustomPopupProps> = ({ event, onClose }) => {
  return (
    <Popup
      latitude={event.location[1]}
      longitude={event.location[0]}
      onClose={onClose}
      closeOnClick={false}
      anchor="top"
      offsetTop={10}
      className="custom-popup"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: '300px' }}>
        <div className="bg-purple-600 text-white p-3 flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          <span className="font-semibold">PERFORMING ARTS</span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{event.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{event.address}</p>
          <p className="text-sm text-purple-600">{event.date}</p>
        </div>
        <div className="bg-gray-100 p-3 flex justify-between items-center">
          <button 
            className="text-purple-600 font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            onClick={() => {/* Handle view details action */}}
          >
            View Details
          </button>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            onClick={() => {/* Handle book now action */}}
          >
            Book Now
          </button>
        </div>
      </div>
    </Popup>
  )
}