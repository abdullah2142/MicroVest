import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header2";

export default function BusinessDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Placeholder for user type.
  const isEntrepreneur = (businessData && businessData.id === 1); // Example logic

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/businesses/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBusinessData(data);
        setInvestmentAmount(data.min_investment || 0);
      } catch (e) {
        setError("Failed to fetch business details: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    if (businessData && businessData.images && businessData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % businessData.images.length);
    }
  };

  const prevImage = () => {
    if (businessData && businessData.images && businessData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + businessData.images.length) % businessData.images.length);
    }
  };

  const handleInvest = async () => {
    // 1. Basic validation (can be more robust)
    if (investmentAmount <= 0) {
        alert("Please enter a positive investment amount.");
        return;
    }

    // Ensure investment does not exceed remaining goal (frontend check)
    const remainingGoal = businessData.funding_goal - businessData.current_funding;
    if (investmentAmount > remainingGoal) {
        alert(`Your investment of ${formatCurrency(investmentAmount)} exceeds the remaining funding goal of ${formatCurrency(remainingGoal)}. Please invest ${formatCurrency(remainingGoal)} or less.`);
        // Optionally, reset investmentAmount to remainingGoal
        setInvestmentAmount(remainingGoal);
        return;
    }

    alert(`Submitting investment of ${formatCurrency(investmentAmount)} for ${businessData.title}...`);

    try {
        const response = await fetch('http://localhost:8000/api/invest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                business_id: businessData.id,
                investment_amount: investmentAmount,
            }),
        });

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (jsonError) {
                console.warn("Could not parse error JSON from backend:", jsonError);
                errorData = { message: `Server responded with status ${response.status} but no valid JSON.` };
            }
            console.error("Investment failed:", errorData);
            alert(`Investment failed: ${JSON.stringify(errorData.message || errorData)}`);
            return;
        }

        let updatedBusiness = {};
        if (response.status === 200 || response.status === 201) {
            try {
                updatedBusiness = await response.json();
            } catch (jsonError) {
                console.error("Error parsing successful response JSON:", jsonError);
                alert("Investment succeeded but there was an issue receiving confirmation data. Please refresh.");
                setBusinessData(prevData => ({
                    ...prevData,
                    current_funding: prevData.current_funding + investmentAmount,
                    backers: prevData.backers + 1,
                }));
                return;
            }
        } else if (response.status === 204) {
            console.log("Investment successful, no content returned.");
            setBusinessData(prevData => ({
                ...prevData,
                current_funding: prevData.current_funding + investmentAmount,
                backers: prevData.backers + 1,
            }));
            alert(`Investment of ${formatCurrency(investmentAmount)} successful! Thank you for backing ${businessData.title}!`);
            return;
        } else {
            console.warn("Unexpected successful response status:", response.status);
            alert("Investment completed with an unexpected server response. Please refresh the page.");
            return;
        }

        console.log("Investment successful:", updatedBusiness);

        setBusinessData(prevData => ({
            ...prevData,
            current_funding: updatedBusiness.current_funding,
            backers: updatedBusiness.backers,
        }));

        alert(`Investment of ${formatCurrency(investmentAmount)} successful! Thank you for backing ${businessData.title}!`);

    } catch (error) {
        console.error("Network or unexpected error during investment:", error);
        alert("An error occurred while processing your investment. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:8000/api/businesses/${id}/delete/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log(`Business with ID ${id} deleted successfully`);
          alert("Business deleted successfully.");
          navigate('/catalogue'); // Redirect back to the catalogue page
        } else {
          const errorData = await response.json();
          console.error("Error deleting business:", errorData);
          alert(`Failed to delete business: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        console.error("Network error while deleting business:", error);
        alert("An error occurred while trying to delete the business.");
      }
    }
  };

  const handleGoToDashboard = () => {
    alert("Navigating to entrepreneur dashboard (logic to be implemented).");
    // navigate('/entrepreneur-dashboard');
  };

  // Dummy functions for routing later
  const handleMessageEntrepreneur = () => {
    alert("Messaging entrepreneur (routing to be implemented).");
    // navigate('/messages/${businessData.entrepreneur_id}');
  };

  const handleConsultAI = () => {
    alert("Consulting AI (routing to be implemented).");
    // navigate('/ai-consult');
  };


  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "financials", label: "Financials" },
    { id: "market", label: "Market Analysis" },
    { id: "team", label: "Team & Documents" },
  ];

  if (loading) {
    return <div className="min-h-screen bg-black text-white text-center py-12">Loading business details...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black text-red-500 text-center py-12">{error}</div>;
  }

  if (!businessData) {
    return <div className="min-h-screen bg-black text-white text-center py-12">Business not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/catalogue')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalogue
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Delete Business
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Business Content (Hero & Tabs) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="relative">
                <img
                  src={businessData.images[currentImageIndex]?.image_url || "/placeholder.svg"}
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
                    {businessData.team_size} team members
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

                <p className="text-gray-300 leading-relaxed mb-6">{businessData.description}</p>

                {/* Entrepreneur Name and Buttons */}
                {//businessData.entrepreneur_name && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                    <p className="text-gray-300 text-lg font-semibold">
                      Entrepreneur: <span className="text-white">{businessData.entrepreneur_name}</span>
                    </p>
                    <div className="flex flex-wrap gap-4"> {/* Buttons wrapped in a div for flex control */}
                      <button
                        onClick={handleMessageEntrepreneur}
                        className="bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-md transition-colors" // Changed classes
                      >
                        <svg className="h-5 w-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </button>
                      <button
                        onClick={handleConsultAI}
                        className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-md transition-colors" // Changed classes
                      >
                        <svg className="h-5 w-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 21a9 9 0 100-18 9 9 0 000 18z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 00-5.656 0M9 10h.01M15 10h.01" />
                        </svg>
                        Consult AI
                      </button>
                    </div>
                  </div>
                //)
                }
              </div>
            </div>

            {/* Tabs Section - remains as is */}
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
                      <p className="text-gray-300 leading-relaxed">{businessData.business_plan}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Competitive Advantage</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.competitive_advantage}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Use of Funds</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.use_of_funds}</p>
                    </div>
                  </div>
                )}

                {activeTab === "financials" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Financial Projections</h3>
                      <p className="text-gray-300 leading-relaxed">{businessData.financial_projections}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Minimum Investment</h4>
                        <p className="text-2xl font-bold text-white">{formatCurrency(businessData.min_investment)}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Total Amount Required</h4>
                        <p className="text-2xl font-bold text-white">{formatCurrency(businessData.funding_goal)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "market" && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Market Analysis</h3>
                    <p className="text-gray-300 leading-relaxed">{businessData.market_analysis}</p>
                  </div>
                )}

                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {businessData.videos.map((video, index) => (
                          <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                            {video.video_file_url ? (
                              <video
                                controls
                                poster={video.thumbnail_url || "/placeholder.svg"}
                                className="w-full h-32 object-cover"
                              >
                                <source src={video.video_file_url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={video.thumbnail_url || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-32 object-cover"
                              />
                            )}
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
                                <p className="text-sm text-white">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.size}</p>
                              </div>
                            </div>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Investment Card and Quick Facts (stacked) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Investment Card - Scrolling, strictly to the right */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-medium">
                    {Math.round(calculateProgress(businessData.current_funding, businessData.funding_goal))}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(businessData.current_funding, businessData.funding_goal)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">{formatCurrency(businessData.current_funding)}</span>
                  <span className="text-gray-300">of {formatCurrency(businessData.funding_goal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Backers</p>
                    <p className="text-white font-semibold">{businessData.backers}</p>
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
                      min={businessData.min_investment}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:border-white focus:outline-none"
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Minimum: {formatCurrency(businessData.min_investment)}</p>
                </div>

                {isEntrepreneur ? (
                  <button
                    onClick={handleGoToDashboard}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Go to Your Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleInvest}
                    className="w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Invest Now
                  </button>
                )}
              </div>
            </div>

            {/* Quick Facts Section - now below Investment Card, scrolls with it */}
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
                  <span className="text-white">{businessData.team_size} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Social Media</span>
                  <span className="text-white">{businessData.social_media}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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