import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { icon } from 'leaflet'
import { toast } from 'react-toastify'
import api from '../../API/CustomApi'
import { Config } from '../../API/Config'
import { AlertCircle, MapPin, Share2, Phone, Mail } from 'lucide-react'

const customIcon = icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const emergencyIcon = icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function RealTimeMap() {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [sharedContacts, setSharedContacts] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [sharingDuration, setSharingDuration] = useState(15) // minutes
  const [sosActive, setSosActive] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [loading, setLoading] = useState(false)

  // Share location with emergency contacts
  const shareLocation = useCallback(async (lat, lon) => {
    try {
      await api.post(
        Config.LOCATION_SHARE_URL,
        {
          latitude: lat,
          longitude: lon,
          contacts: sharedContacts,
          duration: sharingDuration
        }
      )
    } catch (error) {
      console.error('Error sharing location:', error)
    }
  }, [sharedContacts, sharingDuration])

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setCurrentLocation({ latitude, longitude, accuracy })
          
          // Share location if active
          if (isSharing) {
            shareLocation(latitude, longitude)
          }
        },
        (error) => {
          toast.error('Unable to get location. Please enable GPS.')
          console.error(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    }
  }, [isSharing, shareLocation])

  // Fetch emergency contacts
  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        const response = await api.get(Config.EMERGENCY_CONTACTS_URL)
        setEmergencyContacts(response.data.contacts || [])
      } catch (error) {
        console.error('Error fetching emergency contacts:', error)
      }
    }

    fetchEmergencyContacts()
  }, [])

  // Start location sharing
  const startSharing = () => {
    if (sharedContacts.length === 0) {
      toast.error('Please select at least one contact to share with')
      return
    }
    setIsSharing(true)
    toast.success(`Location sharing started for ${sharingDuration} minutes`)
  }

  // Stop sharing
  const stopSharing = () => {
    setIsSharing(false)
    toast.info('Location sharing stopped')
  }

  // Send SOS alert
  const sendSOS = async () => {
    if (!currentLocation) {
      toast.error('Unable to determine your location')
      return
    }

    setLoading(true)
    try {
      await api.post(
        Config.SOS_SEND_URL,
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          severity: 'high',
          message: 'Emergency Alert! I need help immediately!'
        }
      )

      setSosActive(true)
      toast.error('🚨 SOS Alert Sent! Emergency services have been notified.', {
        position: 'top-center',
        autoClose: false
      })

      // Auto-share location with all emergency contacts
      if (emergencyContacts.length > 0) {
        await shareLocation(currentLocation.latitude, currentLocation.longitude)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send SOS alert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Emergency Map & Location Sharing</h1>
          <p className='text-gray-600'>Real-time location tracking and SOS alerts</p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {/* Map Section */}
          <div className='md:col-span-2'>
            {currentLocation ? (
              <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                <MapContainer
                  center={[currentLocation.latitude, currentLocation.longitude]}
                  zoom={15}
                  style={{ height: '500px', width: '100%' }}
                >
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {/* Current Location */}
                  <Marker
                    position={[currentLocation.latitude, currentLocation.longitude]}
                    icon={sosActive ? emergencyIcon : customIcon}
                  >
                    <Popup>
                      <div className='text-center'>
                        <p className='font-bold'>Your Location</p>
                        <p className='text-xs text-gray-600'>Accuracy: {currentLocation.accuracy?.toFixed(0)}m</p>
                        {sosActive && <p className='text-red-600 font-bold'>🚨 SOS ACTIVE</p>}
                      </div>
                    </Popup>
                  </Marker>

                  {/* Accuracy Circle */}
                  <Circle
                    center={[currentLocation.latitude, currentLocation.longitude]}
                    radius={currentLocation.accuracy || 100}
                    fillOpacity={0.1}
                    color='blue'
                  />
                </MapContainer>

                {/* Location Info */}
                <div className='p-4 bg-blue-50 border-t'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-5 h-5 text-blue-600' />
                      <div>
                        <p className='text-sm font-semibold text-gray-700'>Current Location</p>
                        <p className='text-xs text-gray-600'>
                          {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-white rounded-lg shadow-lg p-8 text-center h-96 flex items-center justify-center'>
                <div>
                  <p className='text-gray-600 mb-2'>Getting your location...</p>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto'></div>
                </div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className='space-y-6'>
            {/* SOS Button */}
            <div className='bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 shadow-xl'>
              <button
                onClick={sendSOS}
                disabled={loading || !currentLocation}
                className={`w-full py-6 rounded-lg font-bold text-white text-xl transition transform ${
                  loading || !currentLocation
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 active:scale-95'
                } ${sosActive ? 'animate-pulse' : ''}`}
              >
                {sosActive ? '🚨 SOS ACTIVE' : 'EMERGENCY SOS'}
              </button>
              <p className='text-xs text-red-100 mt-3 text-center'>
                {sosActive
                  ? 'Emergency services notified'
                  : 'Tap to send emergency alert to all contacts'}
              </p>
            </div>

            {/* Location Sharing */}
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <Share2 className='w-5 h-5 text-blue-600' />
                Share Location
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Duration (minutes)
                  </label>
                  <select
                    value={sharingDuration}
                    onChange={(e) => setSharingDuration(Number(e.target.value))}
                    disabled={isSharing}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>

                <button
                  onClick={isSharing ? stopSharing : startSharing}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                    isSharing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSharing ? 'Stop Sharing' : 'Start Sharing'}
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <AlertCircle className='w-5 h-5 text-orange-600' />
                Emergency Contacts
              </h3>

              <div className='space-y-3 max-h-64 overflow-y-auto'>
                {emergencyContacts.length > 0 ? (
                  emergencyContacts.map((contact) => (
                    <div key={contact._id} className='p-3 bg-gray-50 rounded-lg'>
                      <p className='font-semibold text-gray-800 text-sm'>{contact.name}</p>
                      <div className='flex items-center gap-1 text-xs text-gray-600 mt-1'>
                        <Phone className='w-3 h-3' />
                        {contact.phone}
                      </div>
                      <div className='flex items-center gap-1 text-xs text-gray-600'>
                        <Mail className='w-3 h-3' />
                        {contact.email}
                      </div>
                      <div className='flex gap-2 mt-2'>
                        <input
                          type='checkbox'
                          checked={sharedContacts.includes(contact._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSharedContacts([...sharedContacts, contact._id])
                            } else {
                              setSharedContacts(sharedContacts.filter(id => id !== contact._id))
                            }
                          }}
                          className='w-4 h-4'
                        />
                        <label className='text-xs text-gray-600'>Share location</label>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-gray-600 text-center py-4'>No emergency contacts added</p>
                )}
              </div>

              <button className='w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition'>
                Add Emergency Contact
              </button>
            </div>

            {/* Status Indicators */}
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <h3 className='font-bold text-gray-800 mb-3'>Status</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Location Access</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${currentLocation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentLocation ? 'Active' : 'Waiting'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Sharing Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${isSharing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {isSharing ? 'Sharing' : 'Inactive'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>SOS Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${sosActive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
                    {sosActive ? 'Active' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeMap
