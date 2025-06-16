"use client"

import { useState } from "react"
import Header from "../../components/Header2"

// Sample entrepreneur data - this would come from your database/API
const entrepreneurData = {
  name: "Michael Rodriguez",
  email: "michael.rodriguez@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  joinDate: "January 2022",
  totalRaised: 145000,
  totalGoal: 200000,
  totalInvestors: 87,
  totalBusinesses: 3,
  verificationStatus: "verified",
  bankAccount: {
    id: 1,
    name: "Wells Fargo Business Account",
    accountNumber: "****5432",
    routingNumber: "****8765",
  },
  businesses: [
    {
      id: 1,
      name: "Green Coffee Roastery",
      category: "Food & Beverage",
      description: "Sustainable coffee roasting business expanding to new locations",
      fundingGoal: 50000,
      currentFunding: 32500,
      investors: 27,
      launchDate: "2023-10-15",
      status: "active",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150&h=100&fit=crop",
      returnRate: 13,
      performanceData: [
        { month: "Oct", revenue: 8500, expenses: 7200 },
        { month: "Nov", revenue: 9200, expenses: 7400 },
        { month: "Dec", revenue: 10500, expenses: 7800 },
        { month: "Jan", revenue: 11200, expenses: 8100 },
        { month: "Feb", revenue: 12000, expenses: 8300 },
        { month: "Mar", revenue: 13500, expenses: 8600 },
      ],
      topInvestors: [
        { name: "Alex Johnson", amount: 5000, share: 10 },
        { name: "Sarah Williams", amount: 3500, share: 7 },
        { name: "David Chen", amount: 2500, share: 5 },
      ],
    },
    {
      id: 2,
      name: "Tech Repair Hub",
      category: "Technology",
      description: "Community-focused electronics repair and refurbishment center",
      fundingGoal: 75000,
      currentFunding: 62500,
      investors: 42,
      launchDate: "2022-08-22",
      status: "active",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=100&fit=crop",
      returnRate: 17,
      performanceData: [
        { month: "Aug", revenue: 12000, expenses: 9500 },
        { month: "Sep", revenue: 13500, expenses: 9800 },
        { month: "Oct", revenue: 15000, expenses: 10200 },
        { month: "Nov", revenue: 16800, expenses: 10500 },
        { month: "Dec", revenue: 18500, expenses: 11000 },
        { month: "Jan", revenue: 20000, expenses: 11500 },
        { month: "Feb", revenue: 22000, expenses: 12000 },
      ],
      topInvestors: [
        { name: "Robert Taylor", amount: 10000, share: 13.3 },
        { name: "Emily Parker", amount: 7500, share: 10 },
        { name: "James Wilson", amount: 5000, share: 6.7 },
      ],
    },
    {
      id: 3,
      name: "Urban Farm Co-op",
      category: "Agriculture",
      description: "Vertical farming initiative bringing fresh produce to urban areas",
      fundingGoal: 100000,
      currentFunding: 50000,
      investors: 18,
      launchDate: "2023-12-05",
      status: "active",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=150&h=100&fit=crop",
      returnRate: 8,
      performanceData: [
        { month: "Dec", revenue: 5500, expenses: 4800 },
        { month: "Jan", revenue: 6200, expenses: 5100 },
        { month: "Feb", revenue: 7000, expenses: 5400 },
        { month: "Mar", revenue: 8500, expenses: 5800 },
      ],
      topInvestors: [
        { name: "Lisa Martinez", amount: 15000, share: 15 },
        { name: "Thomas Brown", amount: 10000, share: 10 },
        { name: "Jennifer Lee", amount: 5000, share: 5 },
      ],
    },
  ],
  recentActivities: [
    {
      id: 1,
      type: "investment",
      amount: 5000,
      date: "2024-03-15",
      status: "completed",
      business: "Green Coffee Roastery",
      investor: "Alex Johnson",
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 8000,
      date: "2024-03-10",
      status: "completed",
      business: "Tech Repair Hub",
    },
    {
      id: 3,
      type: "milestone",
      date: "2024-03-05",
      status: "completed",
      business: "Tech Repair Hub",
      description: "Reached 80% of funding goal",
    },
    {
      id: 4,
      type: "report",
      date: "2024-02-28",
      status: "completed",
      business: "Urban Farm Co-op",
      description: "Monthly financial report submitted",
    },
    {
      id: 5,
      type: "investment",
      amount: 10000,
      date: "2024-02-20",
      status: "completed",
      business: "Urban Farm Co-op",
      investor: "Lisa Martinez",
    },
    {
      id: 6,
      type: "deposit",
      amount: 15000,
      date: "2024-02-15",
      status: "completed",
      business: "Tech Repair Hub",
    },
  ],
}

export default function EntrepreneurDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [expandedBusiness, setExpandedBusiness] = useState(null)
  const [profileForm, setProfileForm] = useState({
    name: entrepreneurData.name,
    email: entrepreneurData.email,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100)
  }

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setShowEditProfile(false)
    alert("Profile updated successfully!")
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    setShowPasswordForm(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    alert("Password updated successfully!")
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")
    if (confirmed) {
      alert("Account deletion request submitted. You will receive a confirmation email.")
    }
  }

  const toggleBusinessExpand = (id) => {
    setExpandedBusiness(expandedBusiness === id ? null : id)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "businesses", label: "My Businesses", icon: "🏢" },
    { id: "transactions", label: "Transactions", icon: "🕒" },
    { id: "settings", label: "Account Settings", icon: "🔒" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={entrepreneurData.avatar || "/placeholder.svg"}
                    alt={entrepreneurData.name}
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                  />
                  {entrepreneurData.verificationStatus === "verified" && (
                    <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs p-1 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{entrepreneurData.name}</h2>
                <p className="text-gray-400 text-sm">{entrepreneurData.email}</p>
                <p className="text-gray-500 text-xs mt-1">Member since {entrepreneurData.joinDate}</p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full p-3 rounded-md transition-colors ${
                      activeTab === tab.id ? "bg-white text-black" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button className="flex items-center w-full p-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <span className="mr-3 text-lg">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Profile Summary */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Entrepreneur Profile</h2>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>

                  {showEditProfile ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileFormChange}
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileFormChange}
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowEditProfile(false)}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Full Name</h3>
                        <p className="text-white">{entrepreneurData.name}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Email Address</h3>
                        <p className="text-white">{entrepreneurData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Member Since</h3>
                        <p className="text-white">{entrepreneurData.joinDate}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Verification Status</h3>
                        <div className="flex items-center">
                          {entrepreneurData.verificationStatus === "verified" ? (
                            <>
                              <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
                              <span className="text-green-400">Verified</span>
                            </>
                          ) : (
                            <>
                              <span className="bg-yellow-500 h-2 w-2 rounded-full mr-2"></span>
                              <span className="text-yellow-400">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Summary */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Business Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Total Businesses</h3>
                      <p className="text-2xl font-bold text-white">{entrepreneurData.totalBusinesses}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Total Investors</h3>
                      <p className="text-2xl font-bold text-white">{entrepreneurData.totalInvestors}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Total Raised</h3>
                      <p className="text-2xl font-bold text-white">{formatCurrency(entrepreneurData.totalRaised)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Funding Progress</h3>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-white">
                          {Math.round(calculateProgress(entrepreneurData.totalRaised, entrepreneurData.totalGoal))}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-white h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateProgress(entrepreneurData.totalRaised, entrepreneurData.totalGoal)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="font-medium text-white">{formatCurrency(entrepreneurData.totalRaised)}</span>
                      <span className="text-gray-300">of {formatCurrency(entrepreneurData.totalGoal)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Business
                    </button>
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      View Detailed Analytics
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                    <button
                      onClick={() => setActiveTab("businesses")}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {entrepreneurData.recentActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                              activity.type === "investment" || activity.type === "deposit"
                                ? "bg-green-500/20 text-green-400"
                                : activity.type === "milestone"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-gray-700 text-white"
                            }`}
                          >
                            {activity.type === "investment" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                              </svg>
                            )}
                            {activity.type === "withdrawal" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                              </svg>
                            )}
                            {activity.type === "deposit" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                            {activity.type === "milestone" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                            {activity.type === "report" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {activity.type === "investment" && `New investment from ${activity.investor}`}
                              {activity.type === "withdrawal" && `Withdrawal from ${activity.business}`}
                              {activity.type === "deposit" && `Deposit to ${activity.business}`}
                              {activity.type === "milestone" && activity.description}
                              {activity.type === "report" && activity.description}
                            </p>
                            <p className="text-gray-400 text-sm">{formatDate(activity.date)}</p>
                            <p className="text-gray-500 text-xs">{activity.business}</p>
                          </div>
                        </div>
                        {(activity.type === "investment" ||
                          activity.type === "withdrawal" ||
                          activity.type === "deposit") && (
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                activity.type === "investment" || activity.type === "deposit"
                                  ? "text-green-400"
                                  : "text-white"
                              }`}
                            >
                              {activity.type === "investment" || activity.type === "deposit" ? "+" : "-"}
                              {formatCurrency(activity.amount)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Businesses Tab */}
            {activeTab === "businesses" && (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">My Businesses</h2>
                  <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Business
                  </button>
                </div>

                <div className="space-y-4">
                  {entrepreneurData.businesses.map((business) => (
                    <div key={business.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="p-4 cursor-pointer" onClick={() => toggleBusinessExpand(business.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={business.image || "/placeholder.svg"}
                              alt={business.name}
                              className="w-12 h-12 rounded-md mr-4 object-cover"
                            />
                            <div>
                              <h3 className="text-white font-medium">{business.name}</h3>
                              <p className="text-gray-400 text-sm">{business.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-gray-300 text-sm mb-1">Launched: {formatDate(business.launchDate)}</p>
                            {expandedBusiness === business.id ? (
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-300 text-sm mb-3">{business.description}</p>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Funding Progress</span>
                            <span className="text-sm font-medium text-white">
                              {Math.round(calculateProgress(business.currentFunding, business.fundingGoal))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full"
                              style={{ width: `${calculateProgress(business.currentFunding, business.fundingGoal)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-white">{formatCurrency(business.currentFunding)}</span>
                            <span className="text-gray-300">of {formatCurrency(business.fundingGoal)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-gray-400 text-sm">Investors</p>
                            <p className="text-white font-medium flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                              </svg>
                              {business.investors}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Return Rate</p>
                            <p className="text-green-400 font-medium flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                              {business.returnRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Status</p>
                            <p className="text-green-400 font-medium">
                              {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {expandedBusiness === business.id && (
                        <div className="p-4 pt-0 border-t border-gray-700 mt-4">
                          <h4 className="text-white font-medium mb-3 mt-4">Business Performance</h4>
                          <div className="h-64 bg-gray-900 rounded-lg p-4">
                            <div className="h-full flex flex-col">
                              <div className="flex-1 flex items-end">
                                {business.performanceData.map((data, index) => (
                                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full px-1 flex flex-col items-center">
                                      <div
                                        className="w-full bg-green-500/30"
                                        style={{
                                          height: `${(data.revenue / 25000) * 100}%`,
                                          minHeight: "5%",
                                          maxHeight: "95%",
                                        }}
                                      ></div>
                                      <div
                                        className="w-full bg-red-500/30 mt-1"
                                        style={{
                                          height: `${(data.expenses / 25000) * 100}%`,
                                          minHeight: "5%",
                                          maxHeight: "95%",
                                        }}
                                      ></div>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2">{data.month}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="h-px bg-gray-700 my-4"></div>
                              <div className="flex justify-between text-gray-400 text-xs">
                                <div className="flex items-center">
                                  <span className="h-2 w-2 bg-green-500/30 mr-1"></span>
                                  <span>Revenue</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="h-2 w-2 bg-red-500/30 mr-1"></span>
                                  <span>Expenses</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-white font-medium mb-3">Top Investors</h4>
                            <div className="space-y-3">
                              {business.topInvestors.map((investor, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                                >
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                      <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">{investor.name}</p>
                                      <p className="text-gray-400 text-xs">Ownership: {investor.share}%</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <p className="text-white font-medium">{formatCurrency(investor.amount)}</p>
                                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                                      <svg
                                        className="h-4 w-4 text-gray-400 hover:text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors">
                              Edit Business
                            </button>
                            <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
                              View Full Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>

                <div className="space-y-4">
                  {entrepreneurData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                            activity.type === "investment" || activity.type === "deposit"
                              ? "bg-green-500/20 text-green-400"
                              : activity.type === "milestone"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-700 text-white"
                          }`}
                        >
                          {activity.type === "investment" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                          )}
                          {activity.type === "withdrawal" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          )}
                          {activity.type === "deposit" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                          {activity.type === "milestone" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {activity.type === "report" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {activity.type === "investment" && `New investment from ${activity.investor}`}
                            {activity.type === "withdrawal" && `Withdrawal from ${activity.business}`}
                            {activity.type === "deposit" && `Deposit to ${activity.business}`}
                            {activity.type === "milestone" && activity.description}
                            {activity.type === "report" && activity.description}
                          </p>
                          <p className="text-gray-400 text-sm">{formatDate(activity.date)}</p>
                          <p className="text-gray-500 text-xs">{activity.business}</p>
                        </div>
                      </div>
                      {(activity.type === "investment" ||
                        activity.type === "withdrawal" ||
                        activity.type === "deposit") && (
                        <div className="text-right">
                          <p
                            className={`text-lg font-medium ${
                              activity.type === "investment" || activity.type === "deposit"
                                ? "text-green-400"
                                : "text-white"
                            }`}
                          >
                            {activity.type === "investment" || activity.type === "deposit" ? "+" : "-"}
                            {formatCurrency(activity.amount)}
                          </p>
                          <p className="text-green-400 text-xs">
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Bank Account Information */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Bank Account Information</h2>

                  <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <div>
                        <p className="text-white font-medium">{entrepreneurData.bankAccount.name}</p>
                        <p className="text-gray-400 text-sm">Account: {entrepreneurData.bankAccount.accountNumber}</p>
                        <p className="text-gray-400 text-sm">Routing: {entrepreneurData.bankAccount.routingNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Settings */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Password Settings</h2>

                  {showPasswordForm ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordFormChange}
                          required
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordFormChange}
                          required
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordFormChange}
                          required
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <div>
                          <p className="text-white font-medium">Password</p>
                          <p className="text-gray-400 text-sm">Last updated 3 months ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="bg-gray-900 rounded-lg border border-red-900/30 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Danger Zone</h2>

                  <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Delete Account</p>
                      <p className="text-gray-400 text-sm">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2024 MicroVest. Empowering small businesses through community investment.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
