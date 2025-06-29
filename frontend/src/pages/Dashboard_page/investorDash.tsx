"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home,
  DollarSign,
  Eye,
  Settings,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Building,
  BarChart3,
  Plus,
  Wallet,
  Target,
  ArrowUpRight,
} from "lucide-react"

interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  fund?: number;
  prof_pic?: string;
}

interface DashboardStats {
  total_invested: number;
  total_returns: number;
  active_investments: number;
  portfolio_value: number;
}

const schedule = [
  { title: "Portfolio Review", time: "10:00 AM - 11:00 AM" },
  { title: "Investment Meeting", time: "2:00 PM - 3:00 PM" },
  { title: "Market Analysis", time: "4:00 PM - 5:00 PM" },
]

function Sidebar({ active = "Overview" }) {
  const navigate = useNavigate();
  
  const nav = [
    { label: "Overview", icon: Home, action: () => {} },
    { label: "Add Funds", icon: DollarSign, action: () => navigate('/add-funds') },
    { label: "View Details", icon: Eye, action: () => navigate('/investment-details') },
    { label: "Settings", icon: Settings, action: () => navigate('/profile') },
  ]
  
  return (
    <aside className="hidden md:flex flex-col w-80 min-h-full bg-white py-8 px-6 gap-3 shadow-[2px_0_20px_rgba(0,0,0,0.08)]">
      {nav.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-colors ${
            active === item.label
              ? "bg-gray-100 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <item.icon className="w-6 h-6" />
          {item.label}
        </button>
      ))}
    </aside>
  )
}

function CalendarWidget() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = Array(31)
    .fill(0)
    .map((_, i) => i + 1)
  
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 mr-8 lg:mr-16">
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold text-xl">July 2024</span>
        <CalendarIcon className="w-6 h-6 text-gray-400" />
      </div>
      <div className="grid grid-cols-7 text-sm text-gray-400 mb-3">
        {days.map((d) => (
          <div key={d} className="text-center font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array(5).fill(null).map((_, i) => <div key={i}></div>)}
        {dates.map((d) => (
          <div
            key={d}
            className={`w-12 h-12 flex items-center justify-center rounded-full text-base font-medium ${
              d === 5 ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleWidget() {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="font-semibold mb-3">Schedule</div>
      <ul className="space-y-2">
        {schedule.map((item) => (
          <li key={item.title}>
            <div className="font-medium text-sm text-gray-900">{item.title}</div>
            <div className="text-xs text-gray-500">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InvestorDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        // Fetch user profile data
        try {
          const profileResponse = await fetch('http://localhost:8000/api/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            setUserData(profileData)
            if (profileData.prof_pic) {
              setProfilePicture(profileData.prof_pic)
              localStorage.setItem('prof_pic', profileData.prof_pic)
            }
          }
        } catch (profileError) {
          console.warn('Could not fetch profile data:', profileError)
          // Fallback to localStorage data
          const fallbackData: UserData = {
            username: localStorage.getItem('username') || 'User',
            first_name: localStorage.getItem('first_name') || '',
            last_name: localStorage.getItem('last_name') || '',
            email: localStorage.getItem('email') || '',
            user_type: localStorage.getItem('userType') || 'investor',
            fund: 0,
          }
          setUserData(fallbackData)
          setProfilePicture(localStorage.getItem('prof_pic'))
        }

        // Mock dashboard stats based on user data
        const mockStats: DashboardStats = {
          total_invested: 25000,
          total_returns: 3750,
          active_investments: 8,
          portfolio_value: 28750,
        }
        setStats(mockStats)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    if (isNaN(value)) return '0%'
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar active="Overview" />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col xl:flex-row gap-8 w-full">
          {/* Center Main Area */}
          <section className="flex-1 px-6 py-8 min-w-0">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10">
              <div className="flex items-center gap-6">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData?.first_name?.charAt(0) || userData?.username?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {userData?.first_name || userData?.username}!
                  </h2>
                  <p className="text-gray-600">Here's your investment portfolio overview</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available Funds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(userData?.fund || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Invested</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats?.total_invested || 0)}
                </div>
                <div className="text-sm text-green-600">+12.5% from last month</div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Returns</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats?.total_returns || 0)}
                </div>
                <div className="text-sm text-green-600">+8.3% from last month</div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Active Investments</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats?.active_investments || 0}
                </div>
                <div className="text-sm text-blue-600">Across 4 companies</div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Portfolio Value</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats?.portfolio_value || 0)}
                </div>
                <div className="text-sm text-green-600">+2.1% from last month</div>
              </div>
            </div>

            {/* Recent Investments Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Investments</h3>
                <button 
                  onClick={() => navigate('/investment-details')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Business</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Entrepreneur</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">TechFlow Solutions</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Technology
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {formatCurrency(5000)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        John Smith
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">HealthTech Innovations</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Healthcare
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {formatCurrency(3500)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        Sarah Johnson
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Portfolio Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Diversity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Technology</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Healthcare</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Finance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-20 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">30%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Investment Size</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(3125)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Investments</span>
                    <span className="font-semibold text-gray-900">
                      8
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Portfolio Companies</span>
                    <span className="font-semibold text-gray-900">
                      4
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercentage(15)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="w-96 flex-shrink-0 px-6 py-8">
            <CalendarWidget />
            <div className="mt-8">
              <ScheduleWidget />
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
