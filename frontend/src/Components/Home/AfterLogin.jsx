import React, { useContext, useEffect, useState } from 'react';
import SOSButton from '../SOSButton';
import { Plus, X, CircleX } from 'lucide-react';
import BottomNav from './BottomNav';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthContext';
import api from '../../../API/CustomApi';
import { Config } from '../../../API/Config';
import Loader from './Loader';
import axios from 'axios';
import { toast } from "react-toastify"

function AfterLogin() {
  const [showAddContact, setShowAddContact] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const { user, setUser } = useContext(AuthContext);
  const [contactsdata, setContactsdata] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [MobileNo, setMobileNo] = useState([]);
  const [locationMethod, setLocationMethod] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [watchPositionId, setWatchPositionId] = useState(null);
  const [messageType, setMessageType] = useState('both'); // 'sms', 'whatsapp', 'both'
  const [sosHistory, setSosHistory] = useState([]);

  useEffect(() => {
    setContactsdata(Array.isArray(user?.contacts) ? user.contacts : []);
    setMobileNo(Array.isArray(user?.contacts) ? user.contacts : [])
  }, [user]);

  const Submit = async (formData) => {
    setShowLoader(true);
    try {
      // Validate that photo is selected
      if (!formData.photo || formData.photo.length === 0) {
        toast.error("Please select a profile photo");
        setShowLoader(false);
        return;
      }

      // Validate that all fields are filled
      if (!formData.name || formData.name.trim() === "") {
        toast.error("Please enter contact name");
        setShowLoader(false);
        return;
      }

      if (!formData.MobileNo || formData.MobileNo.trim() === "") {
        toast.error("Please enter mobile number");
        setShowLoader(false);
        return;
      }

      const contactData = new FormData();
      contactData.append('photo', formData.photo[0]);
      contactData.append('name', formData.name);
      contactData.append('MobileNo', formData.MobileNo);
      contactData.append('email', formData.email || '');
      contactData.append('userId', user._id);

      const response = await api.post(
        Config.ContactUrl,
        contactData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 201 && response.data) {
        const newContact = response.data.contact;
        setUser((prevUser) => ({
          ...prevUser,
          contacts: [...(prevUser.contacts || []), newContact],
        }));
        setShowAddContact(false);
        reset(); // Reset form fields
        toast.success("Contact added successfully!");
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add contact';
      toast.error(errorMessage);
    } finally {
      setShowLoader(false);
    }
  };

  const handleDelete = async (contactId) => {
    setShowLoader(true);
    try {
      const response = await api.delete(Config.DELETECONTACTUrl, {
        params: { userId: user._id, contactId },
      });

      if (response.status === 200) {
        console.log('Contact deleted successfully');
        setContactsdata((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== contactId)
        );
        // Update user context as well
        setUser((prevUser) => ({
          ...prevUser,
          contacts: (prevUser.contacts || []).filter((contact) => contact._id !== contactId),
        }));
        toast.success("Contact deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete contact';
      toast.error(errorMessage);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    setContactsdata(Array.isArray(user?.contacts) ? user.contacts : []);
    setMobileNo(Array.isArray(user?.contacts) ? user.contacts : []);
  }, [user]);


  const getIPBasedLocation = async () => {
    try {

      let response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('First IP API failed');

      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 50000,
          method: 'ipapi'
        };
      }


      response = await fetch('https://ipwho.is/');
      if (!response.ok) throw new Error('Second IP API failed');

      const fallbackData = await response.json();
      return {
        latitude: fallbackData.latitude,
        longitude: fallbackData.longitude,
        accuracy: 50000,
        method: 'ipwhois'
      };
    } catch (error) {
      console.error('IP geolocation failed:', error);
      throw new Error('Could not determine approximate location from IP');
    }
  };


  const getLocation = async () => {

    if (navigator.geolocation) {
      try {
        // Request permission explicitly first (for better UX)
        toast.info('📍 Requesting precise GPS location... Please allow when prompted', { autoClose: 3000 });
        
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { 
              enableHighAccuracy: true,  // Force GPS instead of WiFi/IP
              timeout: 15000,             // Increase timeout to 15 seconds
              maximumAge: 0               // Don't use cached position
            }
          );
        });

        setLocationMethod('gps');
        const gpsPrecision = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          method: 'gps'
        };
        console.log('✅ GPS Location acquired:', gpsPrecision);
        toast.success(`📍 GPS activated! Accuracy: ${Math.round(position.coords.accuracy)}m`, { autoClose: 2000 });
        return gpsPrecision;
      } catch (gpsError) {
        console.warn('❌ GPS failed:', gpsError.code, gpsError.message);
        const errorMessages = {
          1: 'Location permission denied. Please enable in browser settings.',
          2: 'Unable to retrieve GPS position. Check your location settings.',
          3: 'GPS request timed out. Falling back to IP location.'
        };
        toast.warn(`⚠️ GPS unavailable: ${errorMessages[gpsError.code] || gpsError.message}`, { autoClose: 3000 });
      }
    } else {
      console.warn('Geolocation not supported by this browser');
      toast.warn('⚠️ Geolocation not supported. Using IP-based location.', { autoClose: 3000 });
    }

    try {
      console.log('Falling back to IP-based geolocation...');
      const ipLocation = await getIPBasedLocation();
      setLocationMethod('ip');
      console.log('IP Location acquired:', ipLocation);
      toast.warning(`📡 Using IP-based location (accuracy ~${ipLocation.accuracy}m). For better precision, enable GPS permissions.`, { autoClose: 4000 });
      return ipLocation;
    } catch (ipError) {
      console.error('All location methods failed:', ipError);
      throw new Error('Could not determine your location. Please check internet connection and location permissions.');
    }
  };

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const activeLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLiveLocation(activeLocation);
      },
      (err) => {
        console.error('Live tracking error:', err);
        toast.error('Unable to start live location sharing');
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    setWatchPositionId(id);
    setIsSharingLocation(true);
  };

  const stopLocationSharing = () => {
    if (watchPositionId !== null) {
      navigator.geolocation.clearWatch(watchPositionId);
      setWatchPositionId(null);
    }
    setIsSharingLocation(false);
  };

  const handleSOS = async () => {
    setShowLoader(true);
    setLocationError(null);

    try {
      if (MobileNo.length === 0) {
        throw new Error('No emergency contacts available. Please add contacts first.');
      }

      const location = await getLocation();
      console.log('Using location for SOS:', location);

      // Create Google Maps URL in user's preferred format
      const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      console.log('Maps link:', mapsLink);

      const contactEmails = MobileNo
        .map(contact => contact.email)
        .filter(email => email && email.trim() !== '');

      const response = await api.post(Config.EMERGENCYUrl, {
        contactNumbers: MobileNo.map(contact => contact.MobileNo),
        contactEmails,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          mapsLink: mapsLink,
          accuracy: location.accuracy,
          method: location.method
        },
        userId: user._id,
        messageType: messageType
      });

      setLiveLocation({ latitude: location.latitude, longitude: location.longitude });

      // Add to SOS history
      const sosEvent = {
        id: Date.now(),
        timestamp: new Date(),
        location: location,
        messageType: messageType,
        successCount: response.data.successCount,
        totalCount: response.data.totalCount,
        mapsLink: response.data.mapsLink
      };
      setSosHistory(prev => [sosEvent, ...prev.slice(0, 9)]); // Keep last 10 events

      toast.success(
        <div>
          <p className="font-bold">🚨 Emergency alert sent successfully!</p>
          <p className="text-sm mt-1">
            Sent to {response.data.successCount} out of {response.data.totalCount} contacts
          </p>
          <p className="text-sm">
            Method: {messageType === 'sms' ? 'SMS' : messageType === 'whatsapp' ? 'WhatsApp' : 'SMS + WhatsApp'}
          </p>
          <p className="text-sm">
            Location: {location.method === 'gps' ? 'GPS (precise)' : 'IP-based (approximate)'}
          </p>
        </div>
      );

    } catch (error) {
      console.error('SOS Error:', error);
      setLocationError(error.message);
      toast.error(
        <div>
          <p className="font-semibold">🚨 Emergency alert failed</p>
          <p className="text-sm">{error.message}</p>
          {error.message.includes('location') && (
            <p className="text-sm mt-1">Please check your internet connection and location permissions</p>
          )}
          {error.message.includes('contacts') && (
            <p className="text-sm mt-1">Add emergency contacts in your profile</p>
          )}
        </div>,
        { autoClose: false }
      );
    } finally {
      setShowLoader(false);
    }
  };

  const testLocation = async () => {
    toast.info('Testing location access...');
    try {
      const location = await getLocation();
      toast.success(
        <div>
          <p>Location test successful!</p>
          <p className="text-sm mt-1">
            Method: {location.method.toUpperCase()}
            <br />
            Accuracy: ~{Math.round(location.accuracy / 1000)}km
          </p>
        </div>
      );
    } catch (error) {
      toast.error(`Location test failed: ${error.message}`);
    }
  };


  return (
    <div className="w-full p-2 bg-slate-50">

      {locationMethod && (
        <div className={`p-2 mb-2 text-center ${locationMethod === 'gps' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
          {locationMethod === 'gps' ? (
            'Using precise GPS location'
          ) : (
            'Using approximate IP-based location'
          )}
        </div>
      )}

      {locationError && (
        <div className="p-2 mb-2 bg-red-100 text-red-800 text-center">
          {locationError}
        </div>
      )}

      <div className="w-full h-[40vh] p-2 flex items-center justify-center " onClick={handleSOS}>
        <SOSButton onClick={handleSOS} isLoading={showLoader} messageType={messageType} />
      </div>

      {/* Message Type Selection */}
      <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Alert Method</h3>
        <div className="flex justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMessageType('sms'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              messageType === 'sms'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📱 SMS Only
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMessageType('whatsapp'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              messageType === 'whatsapp'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            💬 WhatsApp Only
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMessageType('both'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              messageType === 'both'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🚨 Both
          </button>
        </div>
      </div>

      <div className='w-full p-2 flex flex-col items-center justify-center gap-3'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            testLocation();
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Test Location
        </button>

        {isSharingLocation ? (
          <button
            onClick={(e) => { e.stopPropagation(); stopLocationSharing(); }}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            Stop Live Location Sharing
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); startLocationSharing(); }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            Start Live Location Sharing
          </button>
        )}
      </div>

      {liveLocation && (
        <div className="mt-4 w-full p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Location (Google Maps)</h3>
          {Config.GOOGLE_MAPS_KEY ? (
            <iframe
              title="Live Google Map"
              width="100%"
              height="300"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/view?key=${Config.GOOGLE_MAPS_KEY}&center=${liveLocation.latitude},${liveLocation.longitude}&zoom=17&maptype=roadmap`}
              className="rounded-lg"
            />
          ) : (
            <div className="text-sm text-gray-500">
              Google Maps API key not configured. <br />
              Fallback link: <a href={`https://www.google.com/maps/search/?api=1&query=${liveLocation.latitude},${liveLocation.longitude}`} target="_blank" rel="noreferrer" className="text-blue-600">Open in Google Maps</a>
            </div>
          )}
        </div>
      )}

      {/* SOS History */}
      {sosHistory.length > 0 && (
        <div className="mt-4 w-full p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Emergency Alerts</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sosHistory.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {event.timestamp.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {event.messageType === 'sms' ? '📱 SMS' : event.messageType === 'whatsapp' ? '💬 WhatsApp' : '🚨 Both'} •
                    {event.successCount}/{event.totalCount} contacts •
                    {event.location.method === 'gps' ? 'GPS' : 'IP'} location
                  </p>
                </div>
                <a
                  href={event.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  📍 Map
                </a>
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="w-full p-4">
        <h1 className="text-gray-900 text-xl font-bold md:text-2xl">Emergency Contacts</h1>
        <div className="w-full flex flex-col gap-3 mt-4 md:flex-row md:flex-wrap md:justify-center md:items-center">
          {contactsdata.length > 0 ? (
            contactsdata.map((contact, index) => (
              <div
                key={index}
                className="w-full p-4 rounded-lg bg-white shadow-sm hover:shadow-md border flex items-center gap-4 md:w-[30%] justify-between md:gap-2"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={contact.photo}
                  alt="Contact"
                />
                <div>
                  <h2 className="text-gray-700 font-bold">{contact.name}</h2>
                  <h3 className="text-gray-500">{contact.MobileNo}</h3>
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="w-10 h-10 rounded-lg border-none hover:text-red-400"
                >
                  <CircleX className="h-6 w-6" />
                </button>
              </div>
            ))
          ) : (
            <h1 className="text-gray-700 font-bold">No Contacts Found</h1>
          )}
        </div>
      </div>

      <div className="w-full p-4 flex items-center justify-center flex-col">
        <button
          className="text-red-400 font-bold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg border hover:border-red-300"
          onClick={() => setShowAddContact(true)}
          disabled={contactsdata.length >= 3}
        >
          <Plus className="w-5 h-5" />
          Add New Contact
        </button>
        {contactsdata.length >= 3 && (
          <span className="text-red-700 text-center">
            You Can Add Maximum 3 Contacts
          </span>
        )}
      </div>

      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <Loader />
        </div>
      )}

      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Contact</h2>
                <button
                  onClick={() => setShowAddContact(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(Submit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/webp"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register('photo', { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register('name', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact Email (optional)</label>
                  <input
                    type="email"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register('email')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register('MobileNo', { required: true })}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddContact(false);
                      reset();
                    }}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                    disabled={showLoader}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm rounded-lg text-white transition-all ${
                      showLoader 
                        ? 'bg-red-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    disabled={showLoader}
                  >
                    {showLoader ? 'Adding...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default AfterLogin;