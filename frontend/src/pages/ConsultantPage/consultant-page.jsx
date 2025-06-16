"use client"

import { useState } from "react" // Import useState
import { useNavigate } from "react-router-dom" // Import useNavigate
import Header from "../../components/Header2" // Import the new Header component

const ConsultantDirectory = () => {
  const navigate = useNavigate() // Initialize navigate
  // State to manage the active filter button and tag filter
  const [activeFilter, setActiveFilter] = useState("Strategy") // Default active filter
  const [tagFilter, setTagFilter] = useState(null) // For filtering by tags

  // Function to handle filter button clicks
  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName)
    setTagFilter(null) // Reset tag filter when changing main filter
  }

  // Function to handle tag clicks
  const handleTagClick = (tag) => {
    setTagFilter(tag)
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans
    bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]"
    >
      <Header /> {/* Replace Navbar with Header */}
      {/* Animated background layer */}
      <div
        className="fixed inset-0 z-0
                      bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]
                      bg-no-repeat bg-cover animate-wave-flow"
      ></div>
      <div className="container max-w-6xl mx-auto p-8 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-12 py-8">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white mb-4 tracking-tight">
            Find Your Expert Business Consultant
          </h1>
          <p className="text-xl text-white/80 font-light mt-2">
            Connect with top-rated professionals to grow your business
          </p>
        </header>

        {/* Filter Section */}
        <section className="mb-12">
          <p className="text-[#cccccc] text-lg text-center mb-6 font-medium">Filter by business expertise:</p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 md:flex-col md:gap-4">
            {/* Category Filters (Top) */}
            <div className="flex gap-3 flex-wrap md:justify-center">
              {["Strategy", "Marketing", "Finance"].map((filterName) => (
                <button
                  key={filterName}
                  className={`filter-btn px-6 py-3 border-2 border-white/30 rounded-full bg-white/10 text-white text-base backdrop-blur-md cursor-pointer font-medium transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5
                              ${activeFilter === filterName ? "bg-white text-[#1a1a1a] border-white" : ""}`}
                  onClick={() => handleFilterClick(filterName)}
                >
                  {filterName}
                </button>
              ))}
            </div>

            {/* Search Container */}
            <div className="relative min-w-[300px] max-w-[400px] flex-1 md:w-full md:max-w-[400px] md:min-w-0">
              <input
                type="text"
                className="w-full py-3 pl-12 pr-4
                           border-2 border-white/30 rounded-full bg-white/10
                           text-white text-base backdrop-blur-md
                           transition-all duration-300 ease-in-out
                           focus:outline-none focus:border-white/60 focus:bg-white/15
                           placeholder:text-white/70"
                placeholder="Search business consultants..."
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            {/* Category Filters (Bottom) */}
            <div className="flex gap-3 flex-wrap md:justify-center">
              {["Operations", "HR", "Technology"].map((filterName) => (
                <button
                  key={filterName}
                  className={`filter-btn px-6 py-3 border-2 border-white/30 rounded-full bg-white/10 text-white text-base backdrop-blur-md cursor-pointer font-medium transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5
                              ${activeFilter === filterName ? "bg-white text-[#1a1a1a] border-white" : ""}`}
                  onClick={() => handleFilterClick(filterName)}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tag Filter Reset */}
        {tagFilter && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTagFilter(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full border border-white/30 hover:bg-white/20 transition-all duration-200"
            >
              <span>Clear filter: {tagFilter}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Consultants Grid */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 py-4 md:gap-6">
          {/* Consultant Card */}
          {[
            {
              name: "Sarah Johnson",
              title: "Business Strategy Expert",
              rating: "5.0 (127 reviews)",
              experience: "8 years",
              specialties: ["Growth Strategy", "Market Analysis"],
              avatarClass: "bg-avatar-1-gradient",
              stars: 5,
            },
            {
              name: "Michael Chen",
              title: "Financial Planning Advisor",
              rating: "4.8 (89 reviews)",
              experience: "12 years",
              specialties: ["Investment", "Risk Management"],
              avatarClass: "bg-avatar-2-gradient",
              stars: 4.5,
            },
            {
              name: "Emma Rodriguez",
              title: "Digital Marketing Specialist",
              rating: "4.6 (156 reviews)",
              experience: "6 years",
              specialties: ["SEO", "Social Media"],
              avatarClass: "bg-avatar-3-gradient",
              stars: 4,
            },
            {
              name: "David Thompson",
              title: "Operations Management Expert",
              rating: "4.9 (203 reviews)",
              experience: "15 years",
              specialties: ["Process Optimization", "Supply Chain"],
              avatarClass: "bg-avatar-4-gradient",
              stars: 5,
            },
          ]
            // Filter consultants based on tag if a tag filter is active
            .filter((consultant) => !tagFilter || consultant.specialties.includes(tagFilter))
            .map((consultant, index) => (
              <div
                className="consultant-card bg-white/95 rounded-2xl p-8 text-center
                   shadow-xl transition-all duration-300 ease-in-out
                   backdrop-blur-md relative
                   hover:-translate-y-1 hover:shadow-2xl
                   md:p-6"
                key={index}
              >
                {/* Avatar Container */}
                <div className="relative mb-4 inline-block">
                  <div
                    className={`w-24 h-24 rounded-full mx-auto
                       border-4 border-gray-100 relative overflow-hidden
                       ${consultant.avatarClass} md:w-20 md:h-20`}
                  >
                    {/* Avatar Icon */}
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-80 md:text-4xl">
                      👤
                    </span>
                  </div>
                </div>
                {/* Consultant Name */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{consultant.name}</h3>
                {/* Consultant Title */}
                <p className="text-base text-gray-600 mb-4 font-medium">{consultant.title}</p>

                {/* Rating Container */}
                <div className="mb-6">
                  {/* Stars */}
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => {
                      if (i + 1 <= Math.floor(consultant.stars)) {
                        return (
                          <span className="text-xl text-amber-400 transition-colors duration-200 ease-in-out" key={i}>
                            ★
                          </span>
                        )
                      } else if (consultant.stars % 1 !== 0 && i === Math.floor(consultant.stars)) {
                        return (
                          <span
                            className="text-xl transition-colors duration-200 ease-in-out"
                            style={{
                              background: "linear-gradient(90deg, #fbbf24 50%, #e5e7eb 50%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                            key={i}
                          >
                            ★
                          </span>
                        )
                      }
                      return (
                        <span className="text-xl text-gray-200 transition-colors duration-200 ease-in-out" key={i}>
                          ★
                        </span>
                      )
                    })}
                  </div>
                  {/* Rating Text */}
                  <span className="text-sm text-gray-600 font-medium">{consultant.rating}</span>
                </div>

                {/* Experience */}
                <div className="mb-6 py-2 border-y border-gray-200">
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-base font-medium text-gray-800">{consultant.experience}</span>
                    <span className="text-sm text-gray-600">Experience</span>
                  </div>
                </div>

                {/* Specialties - Now clickable */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {consultant.specialties.map((tag, i) => (
                    <button
                      onClick={() => handleTagClick(tag)}
                      className={`bg-gray-100 text-gray-700 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                ${
                  tagFilter === tag
                    ? "border-gray-800 bg-gray-800 text-white"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-200"
                }`}
                      key={i}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Contact Button */}
                <button
                  onClick={() => navigate('/messaging')}
                  className="px-8 py-3 border-2 border-gray-800 bg-gray-800 text-white rounded-full
                     cursor-pointer text-base font-semibold
                     transition-all duration-300 ease-in-out min-w-[140px]
                     hover:bg-transparent hover:text-gray-800 hover:-translate-y-0.5 hover:shadow-md"
                >
                  Contact Now
                </button>
              </div>
            ))}
        </section>
      </div>
    </div>
  )
}

export default ConsultantDirectory
