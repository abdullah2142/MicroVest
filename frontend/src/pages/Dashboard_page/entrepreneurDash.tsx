"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home,
  Layers,
  Users as UsersIcon,
  FileText,
  Monitor,
  Plus,
  Calendar as CalendarIcon,
  Building,
} from "lucide-react"

interface Business {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  image?: string;
  created_at: string;
  entrepreneur_name: string;
}

interface Investment {
  id: number;
  user_name: string;
  user_full_name: string;
  amount: number;
  invested_at: string;
  business_title: string;
}

interface Log {
  id: number;
  title: string;
  content: string;
  created_at: string;
  business_title: string;
}

interface DashboardStats {
  total_businesses: number;
  total_funding_raised: number;
  total_investors: number;
  total_profit_generated: number;
  recent_investments: Investment[];
  recent_logs: Log[];
}

interface EntrepreneurMetrics {
  total_businesses_created: number;
  total_funding_raised: number;
  total_investors: number;
  total_profit_generated: number;
  success_rate: number;
  average_investment_size: number;
  annual_revenue: number;
  total_assets: number;
}

const schedule = [
  { title: "Investor Meeting", time: "10:00 AM - 11:00 AM" },
  { title: "Team Check-in", time: "2:00 PM - 3:00 PM" },
  { title: "Pitch Deck Review", time: "4:00 PM - 5:00 PM" },
]

function Sidebar({ active = "Overview" }) {
  const navigate = useNavigate();
  
  const nav = [
    { label: "Overview", icon: Home, action: () => {} },
    { label: "Business Details", icon: Building, action: () => navigate('/my-businesses') },
    { label: "Documentation", icon: FileText, action: () => navigate('/documentation') },
    { label: "Settings", icon: Monitor, action: () => navigate('/profile') },
  ]
  return (
    <aside className="hidden md:flex flex-col w-72 min-h-full bg-white py-8 px-6 gap-3 shadow-[2px_0_20px_rgba(0,0,0,0.08)]">
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
  // Simple static July 2024 calendar for demo
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

export default function EntrepreneurDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [metrics, setMetrics] = useState<EntrepreneurMetrics | null>(null)
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

        // Fetch user profile data to get profile picture
        try {
          const profileResponse = await fetch('http://localhost:8000/api/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            if (profileData.prof_pic) {
              setProfilePicture(profileData.prof_pic)
              localStorage.setItem('prof_pic', profileData.prof_pic)
            }
          }
        } catch (profileError) {
          console.warn('Could not fetch profile picture:', profileError)
          // Fallback to localStorage
          setProfilePicture(localStorage.getItem('prof_pic'))
        }

        // Fetch user's businesses
        const businessesRes = await fetch('http://localhost:8000/api/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!businessesRes.ok) {
          throw new Error('Failed to fetch businesses')
        }

        const businessesData = await businessesRes.json()
        setBusinesses(businessesData)

        // Calculate dashboard stats from businesses data
        const totalFunding = businessesData.reduce((sum: number, business: Business) => {
          const funding = parseFloat(business.current_funding?.toString() || '0');
          return sum + (isNaN(funding) ? 0 : funding);
        }, 0);
        const totalInvestors = businessesData.reduce((sum: number, business: Business) => {
          const backers = parseInt(business.backers?.toString() || '0');
          return sum + (isNaN(backers) ? 0 : backers);
        }, 0);
        
        // Fetch recent investments (last 5)
        const investmentsRes = await fetch('http://localhost:8000/api/investments-tracking/recent/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let recentInvestments: Investment[] = []
        if (investmentsRes.ok) {
          const investmentsData = await investmentsRes.json()
          recentInvestments = investmentsData.slice(0, 5)
        }

        // Fetch recent logs (last 5)
        const logsRes = await fetch('http://localhost:8000/api/logs/recent/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let recentLogs: Log[] = []
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          recentLogs = logsData.slice(0, 5)
        }

        // Calculate total profit generated from logs
        const logsForProfitRes = await fetch('http://localhost:8000/api/logs/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let totalProfit = 0
        if (logsForProfitRes.ok) {
          const logsData = await logsForProfitRes.json()
          totalProfit = logsData.reduce((sum: number, log: any) => {
            const profit = parseFloat(log.profit_generated?.toString() || '0');
            return sum + (isNaN(profit) ? 0 : profit);
          }, 0)
        }

        setStats({
          total_businesses: businessesData.length,
          total_funding_raised: totalFunding,
          total_investors: totalInvestors,
          total_profit_generated: totalProfit,
          recent_investments: recentInvestments,
          recent_logs: recentLogs
        })

        // Fetch entrepreneur metrics
        const metricsRes = await fetch('http://localhost:8000/api/entrepreneur/metrics/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json()
          setMetrics(metricsData)
        }

      } catch (e) {
        console.error('Error fetching dashboard data:', e)
        setError(e instanceof Error ? e.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '$0';
    }
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD", 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
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
        <main className="flex-1 flex flex-col lg:flex-row lg:gap-8 p-6 lg:p-8">
          {/* Center Main Area */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex gap-4">
                <button onClick={() => navigate('/pitch')} className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-gray-800 transition">Create Business</button>
                <button onClick={() => navigate('/my-businesses')} className="bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-gray-200 transition">View Businesses</button>
              </div>
            </div>

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
                    {localStorage.getItem('first_name')?.charAt(0) || localStorage.getItem('username')?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {localStorage.getItem('first_name')} {localStorage.getItem('last_name') || localStorage.getItem('username')}
                  </h2>
                  <p className="text-lg text-gray-600">Entrepreneur</p>
                  <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Member since</div>
                  <div className="font-semibold text-gray-900">January 2024</div>
                </div>
              </div>
            </div>

            {/* Business Overview Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Overview</h2>
              <p className="text-gray-600">Key metrics and performance indicators for your ventures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Total Businesses</div>
                <div className="text-5xl font-bold text-gray-900">{stats?.total_businesses || 0}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Total Funding Raised</div>
                <div className="text-5xl font-bold text-gray-900">{formatCurrency(stats?.total_funding_raised || 0)}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Total Investors</div>
                <div className="text-5xl font-bold text-gray-900">{stats?.total_investors || 0}</div>
              </div>
            </div>
            
            {/* New Metrics Cards Row */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-2">Profit Generated</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.total_profit_generated)}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-2">Avg. Investment Size</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.average_investment_size)}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-2">Success Rate</div>
                  <div className="text-3xl font-bold text-gray-900">{metrics.success_rate}%</div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-2">Annual Revenue</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.annual_revenue)}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-2">Total Assets</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.total_assets)}</div>
                </div>
              </div>
            )}

            {/* New 3 Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Total Earning</div>
                <div className="text-5xl font-bold text-gray-900">{formatCurrency(stats?.total_profit_generated || 0)}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Earning Last Month</div>
                <div className="text-5xl font-bold text-gray-900">{formatCurrency((stats?.total_profit_generated || 0) / 12)}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">Logs</div>
                <div className="text-5xl font-bold text-gray-900">{stats?.recent_logs?.length || 0}</div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-xl mb-4">Active Businesses</div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-0 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-8 py-4">Business</th>
                      <th className="px-8 py-4">Funding Goal</th>
                      <th className="px-8 py-4">Raised</th>
                      <th className="px-8 py-4">Investors</th>
                    </tr>
                  </thead>
                  <tbody className="text-base">
                    {businesses.slice(0, 2).map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-8 py-6 font-medium text-gray-900">{item.title}</td>
                        <td className="px-8 py-6 text-gray-900 font-semibold">{formatCurrency(item.funding_goal)}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-3 rounded-full bg-gray-900" style={{ width: `${Math.round((parseFloat(item.current_funding?.toString() || '0') / parseFloat(item.funding_goal?.toString() || '1')) * 100)}%` }}></div>
                            </div>
                            <span className="text-gray-700 font-semibold">{Math.round((parseFloat(item.current_funding?.toString() || '0') / parseFloat(item.funding_goal?.toString() || '1')) * 100)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-gray-700">{item.backers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* Right Pane */}
          <aside className="w-full lg:w-96 flex-shrink-0 px-6 py-8">
            <CalendarWidget />
          </aside>
        </main>
      </div>
    </div>
  )
}

