import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../../API/CustomApi'
import { Config } from '../../API/Config'
import {
  AlertCircle, MapPin, Users, Bell, Lock, HelpCircle, Settings,
  Plus, Phone, Trash2, Edit, Shield
} from 'lucide-react'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('sos')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' })

  useEffect(() => {
    fetchUserData()
    const interval = setInterval(fetchUserData, 30000) // Auto-refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [authRes, contactsRes] = await Promise.all([
        api.get(Config.CHECKAuthUrl),
        api.get(Config.EMERGENCY_CONTACTS_URL)
      ])

      let userInfo = null
      const email = authRes?.data?.user?.email
      if (email) {
        const userRes = await api.get(Config.GETDATAUrl, { params: { email } })
        userInfo = userRes.data || null
      }
      
      setUserData(userInfo)
      setEmergencyContacts(contactsRes.data.contacts || [])
      
      // Generate demo notifications
      setNotifications([
        { id: 1, title: 'Alert Resolved', message: 'Your SOS alert from 2 hours ago was resolved', time: '2h ago', type: 'resolved' },
        { id: 2, title: 'Contact Updated', message: 'Sarah confirmed she received your location', time: '5h ago', type: 'info' },
      ])

      // Generate demo activity log
      setActivityLog([
        { id: 1, action: 'Location Shared', details: 'Shared location with Sarah', time: '1 hour ago', icon: 'sos' },
        { id: 2, action: 'Contact Added', details: 'Added Priya as emergency contact', time: '3 hours ago', icon: 'contact' },
        { id: 3, action: 'Privacy Updated', details: 'Changed location sharing to private', time: '1 day ago', icon: 'lock' },
      ])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill all fields')
      return
    }
    try {
      const res = await api.post(Config.EMERGENCY_CONTACTS_URL, newContact)
      setEmergencyContacts([...emergencyContacts, res.data.contact])
      setNewContact({ name: '', phone: '', email: '' })
      setShowAddContact(false)
      toast.success('Contact added successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add contact')
    }
  }

  const handleTriggerSOS = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      await api.post(Config.SOS_SEND_URL, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        severity: 'high',
        message: 'Emergency SOS triggered by user'
      })
      toast.success('SOS Alert sent to all emergency contacts!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to trigger SOS')
    }
  }

  const tabConfig = [
    { id: 'sos', label: '🚨 SOS Button', icon: <AlertCircle className='w-5 h-5' /> },
    { id: 'location', label: '📍 Location Sharing', icon: <MapPin className='w-5 h-5' /> },
    { id: 'contacts', label: '👥 Trusted Contacts', icon: <Users className='w-5 h-5' /> },
    { id: 'notifications', label: '🔔 Notifications', icon: <Bell className='w-5 h-5' /> },
    { id: 'privacy', label: '🔐 Privacy Controls', icon: <Lock className='w-5 h-5' /> },
    { id: 'help', label: '❓ Help & Support', icon: <HelpCircle className='w-5 h-5' /> },
    { id: 'settings', label: '⚙️ Settings', icon: <Settings className='w-5 h-5' /> },
  ]

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Safety Dashboard</h1>
          <p className='text-gray-600'>Your personal safety & emergency management hub</p>
        </div>

        {/* Tab Navigation */}
        <div className='bg-white rounded-lg shadow-md p-2 mb-8 overflow-x-auto'>
          <div className='flex gap-2'>
            {tabConfig.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600'></div>
          </div>
        ) : (
          <>
            {/* SOS BUTTON TAB */}
            {activeTab === 'sos' && (
              <div className='space-y-6'>
                <div className='bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 shadow-lg text-white'>
                  <h2 className='text-3xl font-bold mb-4'>Emergency SOS</h2>
                  <p className='mb-6 text-lg'>One tap to alert all your emergency contacts with your real-time location</p>
                  <button
                    onClick={handleTriggerSOS}
                    className='w-full py-6 bg-white text-red-600 font-bold text-2xl rounded-lg hover:bg-gray-100 transition shadow-lg transform hover:scale-105'
                  >
                    🚨 TRIGGER SOS ALERT
                  </button>
                  <p className='mt-4 text-sm opacity-90'>Press the button above to immediately notify all your emergency contacts</p>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white rounded-lg p-6 shadow-md'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>How SOS Works</h3>
                    <ul className='space-y-3 text-sm text-gray-700'>
                      <li className='flex gap-2'>
                        <Shield className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Sends emergency alert to all trusted contacts instantly</span>
                      </li>
                      <li className='flex gap-2'>
                        <Shield className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Shares your real-time GPS location with contacts</span>
                      </li>
                      <li className='flex gap-2'>
                        <Shield className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Records audio/video for evidence (if available)</span>
                      </li>
                      <li className='flex gap-2'>
                        <Shield className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Contacts can track your location in real-time</span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-white rounded-lg p-6 shadow-md'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>Alert Status</h3>
                    <div className='space-y-4'>
                      <div className='p-4 bg-green-50 border-l-4 border-green-500 rounded'>
                        <p className='font-semibold text-green-800'>✓ System Active</p>
                        <p className='text-sm text-green-700'>All systems operational and ready</p>
                      </div>
                      <div className='p-4 bg-blue-50 border-l-4 border-blue-500 rounded'>
                        <p className='font-semibold text-blue-800'>📍 Location Tracking</p>
                        <p className='text-sm text-blue-700'>GPS active and synchronized</p>
                      </div>
                      <div className='p-4 bg-purple-50 border-l-4 border-purple-500 rounded'>
                        <p className='font-semibold text-purple-800'>👥 Contacts Ready</p>
                        <p className='text-sm text-purple-700'>{emergencyContacts.length} emergency contacts configured</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOCATION SHARING TAB */}
            {activeTab === 'location' && (
              <div className='space-y-6'>
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6'>Location Sharing</h2>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                      <div>
                        <p className='font-semibold text-gray-800'>Real-time Location Sharing</p>
                        <p className='text-sm text-gray-600'>Share your location with trusted contacts</p>
                      </div>
                      <button className='px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'>
                        Start Sharing
                      </button>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg'>
                      <div>
                        <p className='font-semibold text-gray-800'>Scheduled Location Updates</p>
                        <p className='text-sm text-gray-600'>Auto-update location at intervals</p>
                      </div>
                      <label className='flex items-center'>
                        <input type='checkbox' className='w-5 h-5 rounded' defaultChecked />
                        <span className='ml-2 text-sm text-gray-700'>Enabled</span>
                      </label>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg'>
                      <div>
                        <p className='font-semibold text-gray-800'>Geofencing Alerts</p>
                        <p className='text-sm text-gray-600'>Get alerted when you leave safe zones</p>
                      </div>
                      <label className='flex items-center'>
                        <input type='checkbox' className='w-5 h-5 rounded' />
                        <span className='ml-2 text-sm text-gray-700'>Disabled</span>
                      </label>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <h3 className='font-bold text-gray-800 mb-4'>Location Sharing History</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <span className='text-sm text-gray-700'>Shared with Sarah</span>
                        <span className='text-xs text-gray-500'>Last 2 hours</span>
                      </div>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <span className='text-sm text-gray-700'>Shared with Mom</span>
                        <span className='text-xs text-gray-500'>Last 6 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRUSTED CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>Trusted Contacts</h2>
                  <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'
                  >
                    <Plus className='w-5 h-5' /> Add Contact
                  </button>
                </div>

                {/* Add Contact Form */}
                {showAddContact && (
                  <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-4'>Add New Emergency Contact</h3>
                    <div className='space-y-3'>
                      <input
                        type='text'
                        placeholder='Contact Name'
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'
                      />
                      <input
                        type='tel'
                        placeholder='Phone Number'
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'
                      />
                      <input
                        type='email'
                        placeholder='Email (Optional)'
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={handleAddContact}
                          className='flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
                        >
                          Add Contact
                        </button>
                        <button
                          onClick={() => setShowAddContact(false)}
                          className='flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contacts List */}
                <div className='grid md:grid-cols-2 gap-6'>
                  {emergencyContacts.map(contact => (
                    <div key={contact._id} className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition'>
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <h3 className='font-bold text-gray-800'>{contact.name}</h3>
                          <p className='text-sm text-gray-600'>{contact.phone}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button className='p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition'>
                            <Edit className='w-4 h-4' />
                          </button>
                          <button className='p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition'>
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button className='flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-semibold'>
                          <Phone className='w-4 h-4 inline mr-1' /> Call
                        </button>
                        <button className='flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold'>
                          📱 SMS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {emergencyContacts.length === 0 && !showAddContact && (
                  <div className='text-center py-12'>
                    <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-600'>No emergency contacts yet</p>
                    <p className='text-sm text-gray-500'>Add at least 3 trusted contacts for emergencies</p>
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Notifications Center</h2>
                <div className='space-y-4'>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-4 rounded-lg border-l-4 ${
                      notif.type === 'resolved' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
                    }`}>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='font-bold text-gray-800'>{notif.title}</p>
                          <p className='text-sm text-gray-600 mt-1'>{notif.message}</p>
                        </div>
                        <span className='text-xs text-gray-500'>{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                  <h3 className='font-bold text-gray-800 mb-3'>Notification Preferences</h3>
                  <div className='space-y-3'>
                    <label className='flex items-center'>
                      <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                      <span className='ml-3 text-sm text-gray-700'>SOS confirmation alerts</span>
                    </label>
                    <label className='flex items-center'>
                      <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                      <span className='ml-3 text-sm text-gray-700'>Contact response notifications</span>
                    </label>
                    <label className='flex items-center'>
                      <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                      <span className='ml-3 text-sm text-gray-700'>Location sharing updates</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY CONTROLS TAB */}
            {activeTab === 'privacy' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Privacy & Data Controls</h2>
                <div className='space-y-6'>
                  <div className='p-4 border border-gray-200 rounded-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-gray-800'>Location Visibility</h3>
                        <p className='text-sm text-gray-600'>Control who can see your location</p>
                      </div>
                      <select className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'>
                        <option>Only Emergency Contacts</option>
                        <option>Selected Contacts</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>

                  <div className='p-4 border border-gray-200 rounded-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-gray-800'>Profile Visibility</h3>
                        <p className='text-sm text-gray-600'>Who can view your profile</p>
                      </div>
                      <select className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'>
                        <option>Everyone</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>

                  <div className='p-4 border border-gray-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-3'>Data Export & Deletion</h3>
                    <div className='flex gap-3'>
                      <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                        Download My Data
                      </button>
                      <button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT TAB */}
            {activeTab === 'help' && (
              <div className='space-y-6'>
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6'>Help & Support</h2>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='p-6 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition'>
                      <h3 className='font-bold text-gray-800 mb-2'>📚 Knowledge Base</h3>
                      <p className='text-sm text-gray-600'>Browse our comprehensive help articles</p>
                    </div>
                    <div className='p-6 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition'>
                      <h3 className='font-bold text-gray-800 mb-2'>❓ Frequently Asked Questions</h3>
                      <p className='text-sm text-gray-600'>Find answers to common questions</p>
                    </div>
                    <div className='p-6 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition'>
                      <h3 className='font-bold text-gray-800 mb-2'>💬 Contact Support</h3>
                      <p className='text-sm text-gray-600'>Reach out to our support team</p>
                    </div>
                    <div className='p-6 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition'>
                      <h3 className='font-bold text-gray-800 mb-2'>🎓 Safety Tips</h3>
                      <p className='text-sm text-gray-600'>Learn personal safety best practices</p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>Quick Support</h3>
                  <textarea
                    placeholder='Describe your issue...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'
                    rows='4'
                  ></textarea>
                  <button className='mt-3 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'>
                    Submit Ticket
                  </button>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Account Settings</h2>
                <div className='space-y-6'>
                  <div className='border-b pb-6'>
                    <h3 className='font-bold text-gray-800 mb-4'>Personal Information</h3>
                    <div className='space-y-4'>
                      <div>
                        <label className='text-sm font-semibold text-gray-700'>Full Name</label>
                        <input type='text' defaultValue={userData?.username} className='w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600' />
                      </div>
                      <div>
                        <label className='text-sm font-semibold text-gray-700'>Email</label>
                        <input type='email' defaultValue={userData?.email} className='w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600' />
                      </div>
                      <div>
                        <label className='text-sm font-semibold text-gray-700'>Phone</label>
                        <input type='tel' defaultValue={userData?.phone} className='w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600' />
                      </div>
                    </div>
                  </div>

                  <div className='border-b pb-6'>
                    <h3 className='font-bold text-gray-800 mb-4'>Security</h3>
                    <button className='px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'>
                      Change Password
                    </button>
                    <label className='flex items-center mt-4'>
                      <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                      <span className='ml-3 text-sm text-gray-700'>Enable two-factor authentication</span>
                    </label>
                  </div>

                  <div>
                    <h3 className='font-bold text-gray-800 mb-4'>Danger Zone</h3>
                    <button className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
                      Delete Account
                    </button>
                  </div>

                  <button className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold'>
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Activity Log Sidebar */}
        <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>Recent Activity</h3>
          <div className='space-y-3'>
            {activityLog.map(log => (
              <div key={log.id} className='flex items-start gap-3 p-3 bg-gray-50 rounded'>
                <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0'>
                  {log.icon === 'sos' && <AlertCircle className='w-4 h-4 text-pink-600' />}
                  {log.icon === 'contact' && <Users className='w-4 h-4 text-pink-600' />}
                  {log.icon === 'lock' && <Lock className='w-4 h-4 text-pink-600' />}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-gray-800 text-sm'>{log.action}</p>
                  <p className='text-xs text-gray-600'>{log.details}</p>
                  <p className='text-xs text-gray-500'>{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
