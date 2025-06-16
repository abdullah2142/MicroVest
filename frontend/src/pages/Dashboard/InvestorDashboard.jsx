"use client"

import { useState } from "react"
import Header from "../../components/Header2"

// Sample user data - this would come from your database/API
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  joinDate: "March 2023",
  totalInvested: 12500,
  availableBalance: 3750,
  totalReturn: 1840,
  returnPercentage: 14.7,
  verificationStatus: "verified",
  bankAccount: {
    id: 1,
    name: "Chase Bank Account",
    accountNumber: "****6789",
    routingNumber: "****4321",
  },
  investments: [
    {
      id: 1,
      business: "Green Coffee Roastery",
      entrepreneur: "Sarah Miller",
      category: "Food & Beverage",
      amount: 2500,
      date: "2023-10-15",
      returnToDate: 325,
      returnPercentage: 13,
      percentageShare: 5.2,
      status: "active",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150&h=100&fit=crop",
      performanceData: [
        { month: "Oct", value: 2500 },
        { month: "Nov", value: 2550 },
        { month: "Dec", value: 2600 },
        { month: "Jan", value: 2680 },
        { month: "Feb", value: 2750 },
        { month: "Mar", value: 2825 },
      ],
    },
    {
      id: 2,
      business: "Tech Repair Hub",
      entrepreneur: "Michael Chen",
      category: "Technology",
      amount: 5000,
      date: "2023-08-22",
      returnToDate: 850,
      returnPercentage: 17,
      percentageShare: 8.5,
      status: "active",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=100&fit=crop",
      performanceData: [
        { month: "Aug", value: 5000 },
        { month: "Sep", value: 5150 },
        { month: "Oct", value: 5300 },
        { month: "Nov", value: 5450 },
        { month: "Dec", value: 5600 },
        { month: "Jan", value: 5750 },
        { month: "Feb", value: 5850 },
      ],
    },
    {
      id: 3,
      business: "Urban Farm Co-op",
      entrepreneur: "Jessica Taylor",
      category: "Agriculture",
      amount: 3000,
      date: "2023-12-05",
      returnToDate: 240,
      returnPercentage: 8,
      percentageShare: 3.8,
      status: "active",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=150&h=100&fit=crop",
      performanceData: [
        { month: "Dec", value: 3000 },
        { month: "Jan", value: 3060 },
        { month: "Feb", value: 3120 },
        { month: "Mar", value: 3240 },
      ],
    },
    {
      id: 4,
      business: "Artisan Bakery",
      entrepreneur: "David Wilson",
      category: "Food & Beverage",
      amount: 2000,
      date: "2024-01-18",
      returnToDate: 160,
      returnPercentage: 8,
      percentageShare: 2.5,
      status: "active",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=100&fit=crop",
      performanceData: [
        { month: "Jan", value: 2000 },
        { month: "Feb", value: 2080 },
        { month: "Mar", value: 2160 },
      ],
    },
  ],
  recentTransactions: [
    {
      id: 1,
      type: "deposit",
      amount: 2000,
      date: "2024-02-15",
      status: "completed",
      method: "Chase Bank Account",
    },
    {
      id: 2,
      type: "investment",
      amount: 1500,
      date: "2024-02-10",
      status: "completed",
      business: "Artisan Bakery",
    },
    {
      id: 3,
      type: "return",
      amount: 320,
      date: "2024-02-05",
      status: "completed",
      business: "Tech Repair Hub",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 1000,
      date: "2024-01-28",
      status: "completed",
      method: "Chase Bank Account",
    },
    {
      id: 5,
      type: "deposit",
      amount: 3000,
      date: "2024-01-15",
      status: "completed",
      method: "Chase Bank Account",
    },
    {
      id: 6,
      type: "investment",
      amount: 3000,
      date: "2024-01-10",
      status: "completed",
      business: "Urban Farm Co-op",
    },
  ],
}

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [expandedInvestment, setExpandedInvestment] = useState(null)
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email,
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

  const toggleInvestmentExpand = (id) => {
    setExpandedInvestment(expandedInvestment === id ? null : id)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "investments", label: "My Investments", icon: "📈" },
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
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                  />
                  {userData.verificationStatus === "verified" && (
                    <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs p-1 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                <p className="text-gray-400 text-sm">{userData.email}</p>
                <p className="text-gray-500 text-xs mt-1">Member since {userData.joinDate}</p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full p-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-black"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
                    <h2 className="text-2xl font-bold text-white">Profile Overview</h2>
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
                        <p className="text-white">{userData.name}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Email Address</h3>
                        <p className="text-white">{userData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Member Since</h3>
                        <p className="text-white">{userData.joinDate}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Verification Status</h3>
                        <div className="flex items-center">
                          {userData.verificationStatus === "verified" ? (
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

                {/* Financial Summary */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Financial Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Total Invested</h3>
                      <p className="text-2xl font-bold text-white">{formatCurrency(userData.totalInvested)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Available Balance</h3>
                      <p className="text-2xl font-bold text-white">{formatCurrency(userData.availableBalance)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-1">Total Returns</h3>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(userData.totalReturn)}</p>
                        <span className="ml-2 text-green-400 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          {userData.returnPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Deposit Funds
                    </button>
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
                      onClick={() => setActiveTab("transactions")}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {userData.recentTransactions.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                              transaction.type === "deposit" || transaction.type === "return"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {transaction.type === "deposit" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                            {transaction.type === "investment" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                            )}
                            {transaction.type === "return" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                            )}
                            {transaction.type === "withdrawal" && (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {transaction.type === "deposit" && "Deposit"}
                              {transaction.type === "investment" && `Investment in ${transaction.business}`}
                              {transaction.type === "return" && `Return from ${transaction.business}`}
                              {transaction.type === "withdrawal" && "Withdrawal"}
                            </p>
                            <p className="text-gray-400 text-sm">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "deposit" || transaction.type === "return"
                                ? "text-green-400"
                                : "text-white"
                            }`}
                          >
                            {transaction.type === "deposit" || transaction.type === "return" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-gray-400 text-xs">{transaction.method || ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === "investments" && (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">My Investment Portfolio</h2>

                <div className="space-y-4">
                  {userData.investments.map((investment) => (
                    <div key={investment.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="p-4 cursor-pointer" onClick={() => toggleInvestmentExpand(investment.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={investment.image || "/placeholder.svg"}
                              alt={investment.business}
                              className="w-12 h-12 rounded-md mr-4 object-cover"
                            />
                            <div>
                              <h3 className="text-white font-medium">{investment.business}</h3>
                              <p className="text-gray-400 text-sm">{investment.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-gray-300 text-sm mb-1">Entrepreneur: {investment.entrepreneur}</p>
                            {expandedInvestment === investment.id ? (
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-gray-400 text-sm">Amount Invested</p>
                            <p className="text-white font-medium">{formatCurrency(investment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Ownership Share</p>
                            <p className="text-white font-medium">{investment.percentageShare}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Return to Date</p>
                            <p className="text-green-400 font-medium">{formatCurrency(investment.returnToDate)}</p>
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
                              {investment.returnPercentage}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {expandedInvestment === investment.id && (
                        <div className="p-4 pt-0 border-t border-gray-700 mt-4">
                          <h4 className="text-white font-medium mb-3">Investment Performance</h4>
                          <div className="h-64 bg-gray-900 rounded-lg p-4">
                            <div className="h-full flex flex-col">
                              <div className="flex-1 flex items-end">
                                {investment.performanceData.map((data, index) => (
                                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div
                                      className="w-4/5 bg-white"
                                      style={{
                                        height: `${((data.value - investment.amount) / investment.amount) * 100 + 5}%`,
                                        minHeight: "5%",
                                      }}
                                    ></div>
                                    <p className="text-gray-400 text-xs mt-2">{data.month}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="h-px bg-gray-700 my-4"></div>
                              <div className="flex justify-between text-gray-400 text-xs">
                                <span>Initial: {formatCurrency(investment.amount)}</span>
                                <span>Current: {formatCurrency(investment.amount + investment.returnToDate)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-white font-medium mb-2">Investment Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Investment Date</span>
                                  <span className="text-white text-sm">{formatDate(investment.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Status</span>
                                  <span className="text-green-400 text-sm">Active</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">1 Year Projection</span>
                                  <span className="text-white text-sm">
                                    {formatCurrency(investment.amount * (1 + investment.returnPercentage / 100))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-2">Entrepreneur</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Name</span>
                                  <span className="text-white text-sm">{investment.entrepreneur}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Experience</span>
                                  <span className="text-white text-sm">8+ years</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Previous Ventures</span>
                                  <span className="text-white text-sm">2</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
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
                  {userData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                            transaction.type === "deposit" || transaction.type === "return"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {transaction.type === "deposit" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                          {transaction.type === "investment" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          )}
                          {transaction.type === "return" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          )}
                          {transaction.type === "withdrawal" && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {transaction.type === "deposit" && "Deposit"}
                            {transaction.type === "investment" && `Investment in ${transaction.business}`}
                            {transaction.type === "return" && `Return from ${transaction.business}`}
                            {transaction.type === "withdrawal" && "Withdrawal"}
                          </p>
                          <p className="text-gray-400 text-sm">{formatDate(transaction.date)}</p>
                          <p className="text-gray-500 text-xs">{transaction.method || ""}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-medium ${
                            transaction.type === "deposit" || transaction.type === "return"
                              ? "text-green-400"
                              : "text-white"
                          }`}
                        >
                          {transaction.type === "deposit" || transaction.type === "return" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p
                          className={`text-xs ${
                            transaction.status === "completed"
                              ? "text-green-400"
                              : transaction.status === "pending"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
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
                        <p className="text-white font-medium">{userData.bankAccount.name}</p>
                        <p className="text-gray-400 text-sm">Account: {userData.bankAccount.accountNumber}</p>
                        <p className="text-gray-400 text-sm">Routing: {userData.bankAccount.routingNumber}</p>
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
                        <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
