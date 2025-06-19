import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header2";

const categories = ["All Categories", "Food & Beverage", "Technology", "Agriculture", "Services", "Manufacturing"];

export default function CataloguePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("trending");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [investments, setInvestments] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = new URL("http://localhost:8000/api/businesses/"); // Your Django API URL
        if (searchTerm) {
          url.searchParams.append("search", searchTerm);
        }
        if (selectedCategory !== "All Categories") {
          url.searchParams.append("category", selectedCategory);
        }
        url.searchParams.append("sort_by", sortBy);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInvestments(data.results || data); // DRF ListAPIView might return { "results": [...], "count": ... }
      } catch (e) {
        setError("Failed to fetch investments: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [searchTerm, selectedCategory, sortBy]); // Re-fetch when these dependencies change

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h2>
          <p className="text-gray-300">Discover and invest in promising small businesses in your community</p>
        </div>

        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:border-white rounded-md p-2 outline-none"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between w-full sm:w-48 border border-gray-600 bg-gray-900 text-white focus:border-white rounded-md p-2"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                  </svg>
                  <span>{selectedCategory}</span>
                </div>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-lg">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="flex items-center justify-between w-full sm:w-48 border border-gray-600 bg-gray-900 text-white focus:border-white rounded-md p-2"
            >
              <span>
                {sortBy === "trending" && "Most Popular"}
                {sortBy === "funding" && "Highest Funded"}
                {sortBy === "goal" && "Largest Goals"}
              </span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSelectOpen && (
              <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-lg">
                <div
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                  onClick={() => {
                    setSortBy("trending");
                    setIsSelectOpen(false);
                  }}
                >
                  Most Popular
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                  onClick={() => {
                    setSortBy("funding");
                    setIsSelectOpen(false);
                  }}
                >
                  Highest Funded
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                  onClick={() => {
                    setSortBy("goal");
                    setIsSelectOpen(false);
                  }}
                >
                  Largest Goals
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && <div className="text-center text-white">Loading opportunities...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-300">
                Showing {investments.length} opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="border border-gray-700 bg-gray-900 hover:shadow-lg hover:shadow-gray-800/50 transition-shadow duration-300 rounded-lg"
                >
                  <div className="p-0">
                    <div className="relative">
                      <img
                        src={investment.image || "/placeholder.svg"}
                        alt={investment.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <span className="absolute top-3 left-3 bg-white text-black border border-gray-300 px-2 py-1 text-xs font-medium rounded-full">
                        {investment.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{investment.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{investment.description}</p>

                    <div className="flex items-center text-sm text-gray-400 mb-4">
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
                      {investment.location}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm font-medium text-white">
                          {Math.round(calculateProgress(investment.current_funding, investment.funding_goal))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${calculateProgress(investment.current_funding, investment.funding_goal)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-white">{formatCurrency(investment.current_funding)}</span>
                        <span className="text-gray-300">of {formatCurrency(investment.funding_goal)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        {investment.backers} backers
                      </div>
                      <div className="flex items-center text-sm text-green-400">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        {investment.expected_return}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="w-full space-y-3">
                      <div className="text-sm text-gray-300">
                        Min. investment: {formatCurrency(investment.min_investment)}
                      </div>
                      <button
                        className="w-full bg-white text-black hover:bg-gray-200 py-2 rounded-md transition-colors"
                        onClick={() => navigate(`/business-detail/${investment.id}`)} // Use actual ID
                      >
                        Invest Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && investments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No investments found</h3>
            <p className="text-gray-300">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2024 MicroVest. Empowering small businesses through community investment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}