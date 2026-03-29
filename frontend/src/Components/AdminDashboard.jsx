import { useEffect, useState } from 'react';
import api from '../../API/CustomApi';
import { toast } from 'react-toastify';
import { Config } from '../../API/Config';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Check,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Lock,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';

function SupportTab() {
  const [queries, setQueries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [aiStats, setAiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQueries, setShowQueries] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [queriesRes, reviewsRes, aiRes] = await Promise.all([
        api.get(Config.ADMIN_CONTACT_SUBMISSIONS_URL, { headers }),
        api.get(Config.GETREVIEWSUrl),
        api.get(Config.AI_ANALYTICS_URL, { headers })
      ]);

      setQueries(queriesRes.data?.submissions || []);
      setReviews(reviewsRes.data?.reviews || []);
      setAiStats(aiRes.data?.analytics || null);
    } catch (err) {
      toast.error('Failed to fetch support data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId, status) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await api.put(`${Config.ADMIN_CONTACT_SUBMISSIONS_URL}/${submissionId}/status`, { status }, { headers });
      toast.success('Contact submission updated');
      fetchSupportData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update submission');
    }
  };

  const pendingQueries = queries.filter((item) => item.status !== 'resolved');
  const emergencyQueries = pendingQueries.filter((item) => item.priority === 'high');

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Support & Help Management</h2>
      {loading && <p className='mb-4 text-sm text-gray-500'>Loading support data...</p>}
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='p-6 border border-gray-200 rounded-lg md:col-span-2 bg-gradient-to-r from-slate-50 to-cyan-50'>
          <h3 className='font-bold text-gray-800 mb-4'>🤖 AI Chatbot Analytics</h3>
          {aiStats ? (
            <div className='grid md:grid-cols-4 gap-4'>
              <div className='rounded-lg bg-white p-4 border border-gray-200'>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Total Chats</p>
                <p className='text-2xl font-bold text-gray-800 mt-1'>{aiStats.totalRequests}</p>
              </div>
              <div className='rounded-lg bg-white p-4 border border-gray-200'>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Provider Response Rate</p>
                <p className='text-2xl font-bold text-gray-800 mt-1'>{aiStats.providerRate}%</p>
              </div>
              <div className='rounded-lg bg-white p-4 border border-gray-200'>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Emergency Intents</p>
                <p className='text-2xl font-bold text-red-600 mt-1'>{aiStats.intentCounters?.emergency || 0}</p>
              </div>
              <div className='rounded-lg bg-white p-4 border border-gray-200'>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Languages</p>
                <p className='text-sm font-semibold text-gray-700 mt-2'>EN: {aiStats.byLanguage?.en || 0} | HI: {aiStats.byLanguage?.hi || 0} | OR: {aiStats.byLanguage?.or || 0}</p>
              </div>
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No AI analytics yet.</p>
          )}
        </div>

        {/* User Queries */}
        <div className='p-6 border border-gray-200 rounded-lg'>
          <h3 className='font-bold text-gray-800 mb-4'>📞 User Queries</h3>
          <p className='text-3xl font-bold text-gray-800'>{pendingQueries.length}</p>
          <p className='text-sm text-gray-600'>Pending responses</p>
          <p className='mt-1 text-xs font-semibold text-red-600'>Emergency priority: {emergencyQueries.length}</p>
          <button
            className='mt-4 w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
            onClick={() => setShowQueries(!showQueries)}
          >
            {showQueries ? 'Hide Queries' : 'View Queries'}
          </button>
          {showQueries && (
            <div className='mt-4 max-h-64 overflow-y-auto'>
              {queries.length === 0 && <p className='text-gray-500'>No queries found.</p>}
              {queries.map((query) => (
                <div key={query._id} className='mb-3 rounded border bg-gray-50 p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-semibold text-gray-800'>{query.name}</p>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${query.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {query.priority}
                    </span>
                  </div>
                  <p className='text-xs text-gray-600'>{query.email} • {query.phone}</p>
                  <p className='mt-1 text-xs font-semibold text-gray-700'>Subject: {query.subject}</p>
                  <p className='mt-1 text-sm text-gray-700 line-clamp-2'>{query.message}</p>
                  <div className='mt-2 flex items-center gap-2'>
                    <span className='text-xs text-gray-500'>Status: {query.status}</span>
                    {query.status !== 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate(query._id, 'in_progress')}
                        className='rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-600'
                      >
                        Mark In Progress
                      </button>
                    )}
                    {query.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(query._id, 'resolved')}
                        className='rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700'
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaints/Reviews */}
        <div className='p-6 border border-gray-200 rounded-lg'>
          <h3 className='font-bold text-gray-800 mb-4'>⚠️ Complaints & Feedback</h3>
          <p className='text-3xl font-bold text-gray-800'>{reviews.length}</p>
          <p className='text-sm text-gray-600'>User-submitted complaints/feedback</p>
          <button
            className='mt-4 w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? 'Hide Complaints' : 'View Complaints'}
          </button>
          {showReviews && (
            <div className='mt-4 max-h-64 overflow-y-auto'>
              {reviews.length === 0 && <p className='text-gray-500'>No complaints found.</p>}
              {reviews.map((review, idx) => (
                <div key={idx} className='mb-4 p-3 border rounded bg-gray-50'>
                  <div className='font-semibold text-pink-700'>{review.title}</div>
                  <div className='text-gray-700 text-sm'>{review.review}</div>
                  <div className='text-xs text-gray-500 mt-1'>By: {review.user?.username || 'Unknown'} | {review.location || 'N/A'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [sosAlerts, setSosAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAdminData()
    const interval = setInterval(fetchAdminData, 30000) // Auto-refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const adminBase = Config.ADMIN_BASE_URL;
      const [statsRes, usersRes, alertsRes] = await Promise.all([
        api.get(`${adminBase}/stats`, { headers }),
        api.get(`${adminBase}/users`, { headers }),
        api.get(`${adminBase}/sos-alerts`, { headers })
      ])

      setStats(statsRes.data?.stats || statsRes.data?.data || null)
      setUsers(usersRes.data?.users || usersRes.data?.data || [])
      setSosAlerts(alertsRes.data?.alerts || alertsRes.data?.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const adminBase = Config.ADMIN_BASE_URL;
      await api.put(
        `${adminBase}/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`)
      fetchAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleAlertStatusChange = async (alertId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const adminBase = Config.ADMIN_BASE_URL;
      await api.put(
        `${adminBase}/sos-alerts/${alertId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Alert status updated')
      fetchAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update alert')
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className='w-5 h-5' /> },
    { id: 'users', label: 'User Management', icon: <Users className='w-5 h-5' /> },
    { id: 'alerts', label: 'Alert Monitoring', icon: <AlertCircle className='w-5 h-5' /> },
    { id: 'reports', label: 'Reports', icon: <FileText className='w-5 h-5' /> },
    { id: 'access', label: 'Access Control', icon: <Lock className='w-5 h-5' /> },
    { id: 'settings', label: 'Settings', icon: <Settings className='w-5 h-5' /> },
    { id: 'support', label: 'Support', icon: <MessageSquare className='w-5 h-5' /> }
  ]

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>Admin Dashboard</h1>
              <p className='text-gray-600'>Manage users, monitor alerts & system settings</p>
            </div>
            <button
              onClick={fetchAdminData}
              className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'
            >
              Refresh
            </button>
          </div>
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

        {loading && activeTab === 'overview' ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600'></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div className='space-y-8'>
                {/* KPI Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <div className='bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-600 text-sm font-semibold uppercase'>Total Users</p>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalUsers}</p>
                        <p className='text-xs text-gray-500 mt-1'>All registered users</p>
                      </div>
                      <div className='w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center'>
                        <Users className='w-7 h-7 text-blue-600' />
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-600 text-sm font-semibold uppercase'>Active Users</p>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.activeUsers}</p>
                        <p className='text-xs text-gray-500 mt-1'>Currently active</p>
                      </div>
                      <div className='w-14 h-14 rounded-full bg-green-100 flex items-center justify-center'>
                        <Activity className='w-7 h-7 text-green-600' />
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-600 text-sm font-semibold uppercase'>SOS Alerts</p>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalSOSAlerts}</p>
                        <p className='text-xs text-gray-500 mt-1'>Total alerts</p>
                      </div>
                      <div className='w-14 h-14 rounded-full bg-red-100 flex items-center justify-center'>
                        <AlertCircle className='w-7 h-7 text-red-600' />
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-600 text-sm font-semibold uppercase'>Active Alerts</p>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.activeAlerts}</p>
                        <p className='text-xs text-gray-500 mt-1'>Pending response</p>
                      </div>
                      <div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center'>
                        <TrendingUp className='w-7 h-7 text-orange-600' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Health & Trends */}
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white rounded-lg p-6 shadow-md'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>System Health</h3>
                    <div className='space-y-4'>
                      <div>
                        <div className='flex justify-between mb-2'>
                          <span className='text-sm text-gray-600'>Database Connection</span>
                          <span className='text-xs font-semibold text-green-600'>✓ Healthy</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div className='bg-green-600 h-2 rounded-full' style={{width: '100%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between mb-2'>
                          <span className='text-sm text-gray-600'>Server Load</span>
                          <span className='text-xs font-semibold text-green-600'>43%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div className='bg-green-600 h-2 rounded-full' style={{width: '43%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between mb-2'>
                          <span className='text-sm text-gray-600'>API Response Time</span>
                          <span className='text-xs font-semibold text-green-600'>120ms</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div className='bg-green-600 h-2 rounded-full' style={{width: '80%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg p-6 shadow-md'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>Recent Activity</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <span className='text-sm text-gray-700'>New SOS Alert from Sarah</span>
                        <span className='text-xs text-gray-500'>2 mins ago</span>
                      </div>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <span className='text-sm text-gray-700'>User Priya Activated</span>
                        <span className='text-xs text-gray-500'>15 mins ago</span>
                      </div>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <span className='text-sm text-gray-700'>System Update Completed</span>
                        <span className='text-xs text-gray-500'>1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Alerts Section */}
                <div className='bg-white rounded-lg p-6 shadow-md'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>⚠️ Critical Alerts Requiring Attention</h3>
                  {sosAlerts.filter(a => a.severity === 'critical').length > 0 ? (
                    <div className='space-y-3'>
                      {sosAlerts.filter(a => a.severity === 'critical').map(alert => (
                        <div key={alert._id} className='flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg'>
                          <div className='flex-1'>
                            <p className='font-semibold text-red-800'>{alert.userId?.name} - CRITICAL</p>
                            <p className='text-sm text-red-700'>{alert.description}</p>
                          </div>
                          <button className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'>
                            Respond
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-gray-500'>No critical alerts</p>
                  )}
                </div>
              </div>
            )}

            {/* USER MANAGEMENT TAB */}
            {activeTab === 'users' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>User Management</h2>
                  <button className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'>
                    <Plus className='w-5 h-5' /> Add User
                  </button>
                </div>

                {/* Search & Filter */}
                <div className='flex gap-4 mb-6'>
                  <div className='flex-1 relative'>
                    <Search className='w-5 h-5 absolute left-3 top-3 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search users by name or email...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600'
                    />
                  </div>
                  <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition'>
                    <Filter className='w-5 h-5' /> Filter
                  </button>
                </div>

                {/* Users Table */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-100 border-b-2 border-gray-300'>
                      <tr>
                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Name</th>
                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Email</th>
                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Phone</th>
                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                        <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Joined</th>
                        <th className='px-6 py-3 text-center text-sm font-semibold text-gray-700'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user._id} className='border-b hover:bg-gray-50 transition'>
                          <td className='px-6 py-4 text-sm text-gray-700 font-semibold'>{user.name}</td>
                          <td className='px-6 py-4 text-sm text-gray-700'>{user.email}</td>
                          <td className='px-6 py-4 text-sm text-gray-700'>{user.phone || 'N/A'}</td>
                          <td className='px-6 py-4 text-sm'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className='px-6 py-4 text-sm text-center'>
                            <div className='flex items-center justify-center gap-2'>
                              <button
                                onClick={() => handleUserStatusChange(user._id, user.status === 'active' ? 'suspended' : 'active')}
                                className={`px-3 py-1 rounded transition text-white text-xs font-semibold ${
                                  user.status === 'active'
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs font-semibold'>
                                <Edit className='w-4 h-4' />
                              </button>
                              <button className='px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs font-semibold'>
                                <Eye className='w-4 h-4' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ALERT MONITORING TAB */}
            {activeTab === 'alerts' && (
              <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-2xl font-bold text-gray-800'>Alert Monitoring</h2>
                  <div className='flex gap-2'>
                    <button className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition'>
                      <Download className='w-5 h-5' />
                    </button>
                  </div>
                </div>

                {sosAlerts.map(alert => (
                  <div key={alert._id} className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-600' : 'border-orange-600'
                  }`}>
                    <div className='flex justify-between items-start'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <h3 className='text-lg font-bold text-gray-800'>{alert.userId?.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.severity === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mb-3'>{alert.description}</p>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-500'>Location:</span>
                            <p className='text-gray-800 font-semibold'>{alert.location?.address || 'Unknown'}</p>
                          </div>
                          <div>
                            <span className='text-gray-500'>Time:</span>
                            <p className='text-gray-800 font-semibold'>{new Date(alert.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => handleAlertStatusChange(alert._id, 'resolved')}
                            className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2'
                          >
                            <Check className='w-5 h-5' /> Mark Resolved
                          </button>
                        )}
                        <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Reports & Analytics</h2>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='p-6 border border-gray-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-4'>📊 User Activity Report</h3>
                    <button
                      className='w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const adminBase = Config.ADMIN_BASE_URL;
                          await api.get(`${adminBase}/users`, { headers: { Authorization: `Bearer ${token}` } });
                          toast.success('User activity report generated!');
                        } catch (err) {
                          toast.error('Failed to generate user activity report');
                        }
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                  <div className='p-6 border border-gray-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-4'>🚨 SOS Alert Trends</h3>
                    <button
                      className='w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const adminBase = Config.ADMIN_BASE_URL;
                          await api.get(`${adminBase}/sos-alerts`, { headers: { Authorization: `Bearer ${token}` } });
                          toast.success('SOS alert trends report generated!');
                        } catch (err) {
                          toast.error('Failed to generate SOS alert trends report');
                        }
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                  <div className='p-6 border border-gray-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-4'>📈 System Performance</h3>
                    <button
                      className='w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const adminBase = Config.ADMIN_BASE_URL;
                          await api.get(`${adminBase}/stats`, { headers: { Authorization: `Bearer ${token}` } });
                          toast.success('System performance report generated!');
                        } catch (err) {
                          toast.error('Failed to generate system performance report');
                        }
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                  <div className='p-6 border border-gray-200 rounded-lg'>
                    <h3 className='font-bold text-gray-800 mb-4'>📋 Export Data</h3>
                    <button
                      className='w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'
                      onClick={async () => {
                        try {
                          const rows = [
                            ['type', 'id', 'name', 'email', 'status', 'createdAt'],
                            ...users.map((u) => [
                              'user',
                              u._id || '',
                              u.name || u.username || '',
                              u.email || '',
                              u.status || '',
                              u.createdAt || ''
                            ]),
                            ...sosAlerts.map((a) => [
                              'sos',
                              a._id || '',
                              a.user?.name || '',
                              a.user?.email || '',
                              a.status || '',
                              a.createdAt || ''
                            ])
                          ];

                          const csv = rows
                            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
                            .join('\n');

                          const blobUrl = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
                          const link = document.createElement('a');
                          link.href = blobUrl;
                          link.setAttribute('download', 'export.csv');
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(blobUrl);
                          toast.success('CSV exported!');
                        } catch (err) {
                          toast.error('Failed to export CSV');
                        }
                      }}
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCESS CONTROL TAB */}
            {activeTab === 'access' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Access Control & Role Management</h2>
                <div className='overflow-x-auto mb-6'>
                  <table className='w-full border border-gray-300'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <th className='px-6 py-3 text-left font-semibold text-gray-700 border-r'>Name</th>
                        <th className='px-6 py-3 text-left font-semibold text-gray-700 border-r'>Email</th>
                        <th className='px-6 py-3 text-center font-semibold text-gray-700 border-r'>Current Role</th>
                        <th className='px-6 py-3 text-center font-semibold text-gray-700 border-r'>Permissions</th>
                        <th className='px-6 py-3 text-center font-semibold text-gray-700'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className='border-b hover:bg-gray-50 transition'>
                          <td className='px-6 py-4 text-sm text-gray-700 font-semibold'>{user.name}</td>
                          <td className='px-6 py-4 text-sm text-gray-700'>{user.email}</td>
                          <td className='px-6 py-4 text-center'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : user.role === 'admin' ? 'bg-green-100 text-green-800' : user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{user.role || 'user'}</span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className='text-xs'>{user.permissions ? user.permissions.join(', ') : '-'}</span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <div className='flex items-center justify-center gap-2'>
                              {/* Grant Admin */}
                              {user.role !== 'admin' && user.role !== 'super_admin' && (
                                <button
                                  className='px-3 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition'
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      const adminBase = Config.ADMIN_BASE_URL;
                                      await api.post(`${adminBase}/grant-access`, {
                                        userId: user._id,
                                        role: 'admin',
                                        permissions: ['manageUsers', 'manageSOS', 'manageReports', 'manageSupport', 'manageSettings', 'accessControl']
                                      }, { headers: { Authorization: `Bearer ${token}` } });
                                      toast.success('Granted admin access');
                                      fetchAdminData();
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || 'Failed to grant admin access');
                                    }
                                  }}
                                >
                                  Grant Admin
                                </button>
                              )}
                              {/* Grant Moderator */}
                              {user.role !== 'moderator' && user.role !== 'admin' && user.role !== 'super_admin' && (
                                <button
                                  className='px-3 py-1 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 transition'
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      const adminBase = Config.ADMIN_BASE_URL;
                                      await api.post(`${adminBase}/grant-access`, {
                                        userId: user._id,
                                        role: 'moderator',
                                        permissions: ['manageUsers', 'manageSOS', 'manageReports', 'manageSupport']
                                      }, { headers: { Authorization: `Bearer ${token}` } });
                                      toast.success('Granted moderator access');
                                      fetchAdminData();
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || 'Failed to grant moderator access');
                                    }
                                  }}
                                >
                                  Grant Moderator
                                </button>
                              )}
                              {/* Revoke Admin/Moderator */}
                              {(user.role === 'admin' || user.role === 'moderator') && user.role !== 'super_admin' && (
                                <button
                                  className='px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition'
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      const adminBase = Config.ADMIN_BASE_URL;
                                      await api.delete(`${adminBase}/revoke-access/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
                                      toast.success('Revoked admin/moderator access');
                                      fetchAdminData();
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || 'Failed to revoke access');
                                    }
                                  }}
                                >
                                  Revoke Access
                                </button>
                              )}
                              {/* No actions for super_admin or self */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-sm text-blue-800'>
                    <strong>Note:</strong> Only super admins can grant or revoke admin/moderator access. Access control is enforced at both API and UI levels.
                  </p>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>System Settings</h2>
                <div className='space-y-6'>
                  <div className='border-b pb-6'>
                    <h3 className='font-bold text-gray-800 mb-3'>🔔 Notification Settings</h3>
                    <div className='space-y-3'>
                      <label className='flex items-center'>
                        <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                        <span className='ml-3 text-sm text-gray-700'>Email alerts for critical SOS</span>
                      </label>
                      <label className='flex items-center'>
                        <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                        <span className='ml-3 text-sm text-gray-700'>New user registrations</span>
                      </label>
                      <label className='flex items-center'>
                        <input type='checkbox' className='w-4 h-4 rounded' />
                        <span className='ml-3 text-sm text-gray-700'>Daily system health reports</span>
                      </label>
                    </div>
                  </div>

                  <div className='border-b pb-6'>
                    <h3 className='font-bold text-gray-800 mb-3'>🔐 Security & Privacy</h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm font-semibold text-gray-700'>Session Timeout (minutes)</label>
                        <input type='number' defaultValue='30' className='mt-1 px-4 py-2 border border-gray-300 rounded w-full' />
                      </div>
                      <label className='flex items-center mt-3'>
                        <input type='checkbox' className='w-4 h-4 rounded' defaultChecked />
                        <span className='ml-3 text-sm text-gray-700'>Two-factor authentication required</span>
                      </label>
                    </div>
                  </div>

                  <div className='pb-6'>
                    <h3 className='font-bold text-gray-800 mb-3'>💾 Data & Backup</h3>
                    <button className='px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition'>
                      Create System Backup
                    </button>
                  </div>

                  <button className='px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold'>
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <SupportTab />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

