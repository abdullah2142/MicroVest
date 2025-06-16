"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../components/Header2"

// Sample business data - this would come from your database/API
const businessData = {
  id: 1,
  title: "Green Coffee Roastery",
  tagline: "Sustainable coffee roasting for a better tomorrow",
  description:
    "Sustainable coffee roasting business expanding to new locations with a focus on direct trade relationships and environmentally conscious practices.",
  category: "Food & Beverage",
  location: "Portland, OR",
  fundingGoal: 50000,
  currentFunding: 32500,
  backers: 127,
  daysLeft: 23,
  minInvestment: 100,
  expectedReturn: "12-15%",
  teamSize: 8,
  website: "https://greencoffeeroastery.com",
  socialMedia: "@greencoffeepdx",

  // Detailed information
  businessPlan:
    "Green Coffee Roastery aims to revolutionize the local coffee scene by establishing direct relationships with coffee farmers and implementing sustainable roasting practices. Our business model focuses on premium quality, ethical sourcing, and community engagement. We plan to expand from our current single location to three locations across Portland within the next two years, while maintaining our commitment to sustainability and quality.",

  financialProjections:
    "Year 1: $180,000 revenue with 15% profit margin. Year 2: $320,000 revenue with 22% profit margin. Year 3: $480,000 revenue with 28% profit margin. Break-even expected within 8 months of funding. Monthly recurring revenue from subscription services projected at $15,000 by end of Year 1.",

  marketAnalysis:
    "The specialty coffee market in Portland is valued at $45M annually with 8% year-over-year growth. Our target demographic includes environmentally conscious consumers aged 25-45 with household incomes above $50,000. Market research shows 73% of local consumers are willing to pay premium prices for sustainably sourced coffee.",

  competitiveAdvantage:
    "Direct trade relationships with farmers, proprietary roasting techniques, strong local brand recognition, and commitment to sustainability. Our unique subscription model and community engagement programs differentiate us from larger chains. We've already established partnerships with 12 local restaurants and cafes.",

  useOfFunds:
    "Equipment and facility expansion (40% - $20,000), Inventory and raw materials (25% - $12,500), Marketing and branding (20% - $10,000), Working capital (10% - $5,000), Legal and administrative (5% - $2,500)",

  // Media files
  images: [
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop",
  ],

  videos: [
    {
      title: "Business Pitch Video",
      thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop",
      duration: "3:45",
    },
    {
      title: "Behind the Scenes",
      thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
      duration: "2:20",
    },
  ],

  documents: [
    { name: "Business Plan.pdf", size: "2.4 MB" },
    { name: "Financial Projections.xlsx", size: "1.8 MB" },
    { name: "Market Research.pdf", size: "3.2 MB" },
  ],
}

export default function BusinessDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState(businessData.minInvestment)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLiked, setIsLiked] = useState(false)

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % businessData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + businessData.images.length) % businessData.images.length)
  }

  const handleInvest = () => {
    alert(`Investment of ${formatCurrency(investmentAmount)} submitted! You will be redirected to the payment page.`)
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "financials", label: "Financials" },
    { id: "market", label: "Market Analysis" },
    { id: "team", label: "Team & Documents" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/catalogue')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalogue
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="relative">
                <img
                  src={businessData.images[currentImageIndex] || "/placeholder.svg"}
                  alt={businessData.title}
                  className="w-full h-64 md:h-80 object-cover"
                />

                {businessData.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4">
                  <span className="bg-white text-black px-3 py-1 text-sm font-medium rounded-full">
                    {businessData.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked ? "bg-red-600 text-white" : "bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{businessData.title}</h1>
                <p className="text-xl text-gray-300 mb-4">{businessData.tagline}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {businessData.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    {businessData.teamSize} team members
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                      />
                    </svg>
                    <a href={businessData.website} className="hover:text-white transition-colors">
                      Website
                    </a>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">{businessData.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-900 rounded-lg border border-gray-700">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-white text-white"
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Business Plan</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.businessPlan}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Competitive Advantage</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.competitiveAdvantage}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Use of Funds</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.useOfFunds}</p>
                    </div>
                  </div>
                )}

                {activeTab === "financials" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Financial Projections</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.financialProjections}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Expected Return</h4>
                        <p className="text-2xl font-bold text-green-400">{businessData.expectedReturn}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Minimum Investment</h4>
                        <p className="text-2xl font-bold text-white">{formatCurrency(businessData.minInvestment)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "market" && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Market Analysis</h3>
                    <p className="text-gray-300 leading-relaxed">{businessData.marketAnalysis}</p>
                  </div>
                )}

                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {businessData.videos.map((video, index) => (
                          <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="bg-white bg-opacity-90 text-black p-3 rounded-full hover:bg-opacity-100 transition-all">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <polygon points="5,3 19,12 5,21"></polygon>
                                </svg>
                              </button>
                            </div>
                            <div className="p-3">
                              <h4 className="text-white font-medium">{video.title}</h4>
                              <p className="text-gray-400 text-sm">{video.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Documents</h3>
                      <div className="space-y-3">
                        {businessData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <div>
                                <p className="text-white font-medium">{doc.name}</p>
                                <p className="text-gray-400 text-sm">{doc.size}</p>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 sticky top-24">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-medium">
                    {Math.round(calculateProgress(businessData.currentFunding, businessData.fundingGoal))}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(businessData.currentFunding, businessData.fundingGoal)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">{formatCurrency(businessData.currentFunding)}</span>
                  <span className="text-gray-300">of {formatCurrency(businessData.fundingGoal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Backers</p>
                    <p className="text-white font-semibold">{businessData.backers}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Days Left</p>
                    <p className="text-white font-semibold">{businessData.daysLeft}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Amount</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">$</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      min={businessData.minInvestment}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Minimum: {formatCurrency(businessData.minInvestment)}</p>
                </div>

                <button
                  onClick={handleInvest}
                  className="w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                >
                  Invest Now
                </button>

                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    Expected return: <span className="text-green-400 font-medium">{businessData.expectedReturn}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{businessData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location</span>
                  <span className="text-white">{businessData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Team Size</span>
                  <span className="text-white">{businessData.teamSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Social Media</span>
                  <span className="text-white">{businessData.socialMedia}</span>
                </div>
              </div>
            </div>
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
