import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import Notification from '../../components/Notification';
import { Bookmark, BookmarkCheck } from "lucide-react";

const categories = ["All Categories", "Food & Beverage", "Technology", "Agriculture", "Services", "Manufacturing"];

interface Investment {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  min_investment: number;
  image?: string;
  user: number | string;
  user_investment_amount: number;
  user_investment_percentage: number;
}

interface NotificationState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export default function CataloguePage() {
  const navigate = useNavigate();
  const { user, openAddFundsModal } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("trending");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [savedBusinessIds, setSavedBusinessIds] = useState<number[]>([]);

  const isOwner = (investment: Investment) => {
    const currentUserId = localStorage.getItem('userId');
    const businessUserId = investment.user;
    return currentUserId && String(businessUserId) === String(currentUserId);
  };

  const isEntrepreneur = user.userType === 'entrepreneur';

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = new URL("http://localhost:8000/api/businesses/");
        if (searchTerm) {
          url.searchParams.append("search", searchTerm);
        }
        if (selectedCategory !== "All Categories") {
          url.searchParams.append("category", selectedCategory);
        }
        url.searchParams.append("sort_by", sortBy);

        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url.toString(), {
          headers: headers
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched business data:', data);
        setInvestments(data.results || data);
      } catch (e) {
        setError("Failed to fetch investments: " + (e instanceof Error ? e.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    investments.forEach(investment => {
      if (investment.user_investment_amount > 0) {
        console.log(`Investment data for ${investment.title}: $${investment.user_investment_amount} (${investment.user_investment_percentage}%)`);
      }
    });
  }, [investments]);

  useEffect(() => {
    const fetchSavedBusinesses = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/saved-businesses/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedBusinessIds(data.map((item: any) => item.business.id));
        }
      } catch (e) { /* ignore */ }
    };
    fetchSavedBusinesses();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleInvestNow = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowInvestmentModal(true);
  };

  const handleViewDetails = (investmentId: number) => {
    navigate(`/business/${investmentId}`);
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleInvestmentSubmit = async () => {
    if (!selectedInvestment || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedInvestment.min_investment) {
      showNotification('error', 'Invalid Amount', `Minimum investment amount is ${formatCurrency(selectedInvestment.min_investment)}`);
      return;
    }

    setIsInvesting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showNotification('error', 'Authentication Required', 'Please log in to invest');
        return;
      }

      const response = await fetch('http://localhost:8000/api/invest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_id: selectedInvestment.id,
          investment_amount: amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.code === 'token_not_valid' || errorData.detail?.includes('expired')) {
          showNotification('error', 'Session Expired', 'Your session has expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
          return;
        }
        
        throw new Error(errorData.detail || errorData.message || 'Investment failed');
      }

      const result = await response.json();
      showNotification('success', 'Investment Successful', `Successfully invested ${formatCurrency(amount)}!`);
      
      const refreshResponse = await fetch(`http://localhost:8000/api/businesses/?sort_by=${sortBy}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setInvestments(refreshedData.results || refreshedData);
      } else {
        setInvestments(prevInvestments => 
          prevInvestments.map(inv => 
            inv.id === selectedInvestment.id 
              ? {
                  ...inv,
                  current_funding: result.current_funding,
                  backers: result.backers
                }
              : inv
          )
        );
      }
      
      setShowInvestmentModal(false);
      setSelectedInvestment(null);
      setInvestmentAmount("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotification('error', 'Investment Failed', `Investment failed: ${errorMessage}`);
    } finally {
      setIsInvesting(false);
    }
  };

  const handleToggleSave = async (businessId: number, isCurrentlySaved: boolean) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showNotification('error', 'Login Required', 'Please log in to save businesses.');
      return;
    }
    try {
      const method = isCurrentlySaved ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:8000/api/businesses/${businessId}/toggle-save/`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok || response.status === 201) {
        setSavedBusinessIds(prev =>
          isCurrentlySaved ? prev.filter(id => id !== businessId) : [...prev, businessId]
        );
      } else {
        showNotification('error', 'Error', 'Could not update saved status.');
      }
    } catch (e) {
      showNotification('error', 'Error', 'Could not update saved status.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F6F6]">
      <Sidebar active="Catalogue" onAddFundsClick={openAddFundsModal} />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 ml-80">
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2A363B] mb-2">Investment Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-2xl">Discover and invest in promising small businesses in your community</p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 mb-8">
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 border border-gray-300 bg-white text-[#2A363B] placeholder-gray-400 focus:border-[#CF4647] rounded-lg p-2 outline-none"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center justify-between w-full sm:w-48 border border-gray-300 bg-white text-[#2A363B] focus:border-[#CF4647] rounded-lg p-2 shadow-sm"
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon></svg>
                      <span>{selectedCategory}</span>
                    </div>
                    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isCategoryOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#2A363B]"
                          onClick={() => { setSelectedCategory(category); setIsCategoryOpen(false); }}
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
                  className="flex items-center justify-between w-full sm:w-48 border border-gray-300 bg-white text-[#2A363B] focus:border-[#CF4647] rounded-lg p-2 shadow-sm"
                >
                  <span>
                    {sortBy === "trending" && "Most Popular"}
                    {sortBy === "funding" && "Highest Funded"}
                    {sortBy === "goal" && "Largest Goals"}
                  </span>
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isSelectOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#2A363B]" onClick={() => { setSortBy("trending"); setIsSelectOpen(false); }}>Most Popular</div>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#2A363B]" onClick={() => { setSortBy("funding"); setIsSelectOpen(false); }}>Highest Funded</div>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#2A363B]" onClick={() => { setSortBy("goal"); setIsSelectOpen(false); }}>Largest Goals</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading && <div className="text-center text-gray-700">Loading opportunities...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}

          {!loading && !error && (
            <>
              <div className="mb-6"><p className="text-gray-600">Showing {investments.length} opportunities</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24"> {/* Adjusted grid for wider cards */}
                {investments.map((investment) => (
                  <div key={investment.id} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"> {/* Enhanced shadow and added border */}
                    <div className="p-0">
                      <div className="relative">
                        <img src={investment.image || "/placeholder.svg"} alt={investment.title} className="w-full h-56 object-cover rounded-t-lg" />
                        <span className="absolute top-3 left-3 bg-[#F8F6F6] text-[#2A363B] border border-gray-200 px-3 py-1 text-xs font-medium rounded-full shadow-sm">{investment.category}</span>
                        <button
                          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md" // Added circular background
                          title={savedBusinessIds.includes(investment.id) ? 'Unsave Business' : 'Save Business'}
                          onClick={() => handleToggleSave(investment.id, savedBusinessIds.includes(investment.id))}
                        >
                          {savedBusinessIds.includes(investment.id) ? (
                            <BookmarkCheck className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                          ) : (
                            <Bookmark className="w-6 h-6 text-gray-500 hover:text-emerald-600" />
                          )}
                        </button>
                      </div>
                      <div className="p-6">
                        <h3 
                          onClick={() => handleViewDetails(investment.id)}
                          className="text-xl font-semibold text-[#2A363B] mb-2 cursor-pointer hover:text-[#CF4647] transition-colors"
                        >
                          {investment.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{investment.description}</p>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Location</span><span className="text-[#2A363B] font-medium">{investment.location}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Funding Goal</span><span className="text-[#2A363B] font-medium">{formatCurrency(investment.funding_goal)}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Raised</span><span className="text-[#2A363B] font-medium">{formatCurrency(investment.current_funding)}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Remaining</span><span className="text-[#2A363B] font-medium">{formatCurrency(investment.funding_goal - investment.current_funding)}</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#CF4647] h-2 rounded-full" style={{ width: `${calculateProgress(investment.current_funding, investment.funding_goal)}%` }}></div></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Progress</span><span className="text-[#CF4647] font-medium">{calculateProgress(investment.current_funding, investment.funding_goal).toFixed(1)}%</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Backers</span><span className="text-[#2A363B] font-medium">{investment.backers}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">Min Investment</span><span className="text-[#2A363B] font-medium">{formatCurrency(investment.min_investment)}</span></div>
                          {investment.user_investment_amount > 0 && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Your Investment</span>
                                <span className="text-emerald-600 font-medium">{formatCurrency(investment.user_investment_amount)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Your Share</span>
                                <span className="text-emerald-600 font-medium">{investment.user_investment_percentage}%</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="mt-6 flex gap-3">
                          {isOwner(investment) ? (
                            <button
                              onClick={() => navigate(`/business/${investment.id}`)}
                              className="flex-1 bg-[#2A363B] hover:bg-[#CF4647] text-white py-2 px-4 rounded-md transition-colors font-medium shadow-md"
                            >
                              Your Business
                            </button>
                          ) : isEntrepreneur ? (
                            <button
                              onClick={() => navigate(`/messages?user=${investment.user}`)}
                              className="flex-1 bg-[#2A363B] hover:bg-[#CF4647] text-white py-2 px-4 rounded-md transition-colors font-medium shadow-md"
                              title="Message the business owner"
                            >
                              Message Owner
                            </button>
                          ) : (
                            <button
                              onClick={() => handleInvestNow(investment)}
                              disabled={investment.current_funding === investment.funding_goal}
                              className="flex-1 bg-[#CF4647] text-white py-2 px-4 rounded-md hover:bg-[#2A363B] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                              {investment.current_funding === investment.funding_goal ? 'Fully Funded' : (investment.user_investment_amount > 0 ? 'Invest More' : 'Invest Now')}
                            </button>
                          )}
                          <button 
                            onClick={() => handleViewDetails(investment.id)} 
                            className="flex-1 bg-gray-200 text-[#2A363B] py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium shadow-sm"
                          >
                            View Details
                          </button>
                        </div>
                        
                        {investment.current_funding === investment.funding_goal && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => navigate(`/businesses/${investment.id}/logs`)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-md transition-colors font-medium text-sm"
                            >
                              Logs
                            </button>
                            <button
                              onClick={() => navigate(`/business/${investment.id}/fund-statistics`)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md transition-colors font-medium text-sm"
                            >
                              Statistics
                            </button>
                          </div>
                        )}
                        
                        {investment.current_funding === investment.funding_goal && (
                          <div className="mt-3 flex items-center justify-center">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Active
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Investment Modal */}
      {showInvestmentModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#2A363B]">Invest in {selectedInvestment.title}</h2>
              <button onClick={() => { setShowInvestmentModal(false); setSelectedInvestment(null); }} className="text-gray-400 hover:text-[#CF4647]">✕</button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-[#F8F6F6] p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Minimum Investment:</span><span className="text-[#2A363B] font-medium">{formatCurrency(selectedInvestment.min_investment)}</span></div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Current Funding:</span><span className="text-[#2A363B] font-medium">{formatCurrency(selectedInvestment.current_funding)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Funding Goal:</span><span className="text-[#2A363B] font-medium">{formatCurrency(selectedInvestment.funding_goal)}</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (USD)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: ${formatCurrency(selectedInvestment.min_investment)}`}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#2A363B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CF4647] focus:border-[#CF4647]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowInvestmentModal(false); setSelectedInvestment(null); setInvestmentAmount(""); }}
                className="flex-1 bg-gray-200 text-[#2A363B] py-2 px-4 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleInvestmentSubmit}
                disabled={isInvesting || !investmentAmount}
                className="flex-1 bg-[#CF4647] text-white py-2 px-4 rounded-md hover:bg-[#2A363B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isInvesting ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
      />
    </div>
  );
}