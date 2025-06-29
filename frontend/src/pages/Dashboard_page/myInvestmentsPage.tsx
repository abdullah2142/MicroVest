import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, MessageSquare, Eye } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface Investment {
  id: number;
  business: {
    id: number;
    title: string;
    category: string;
    location: string;
    funding_goal: number;
    current_funding: number;
    backers: number;
    image?: string;
    deadline: string;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
    };
  };
  amount: number;
  invested_at: string;
  share_percentage: number;
}

export default function MyInvestmentsPage() {
  const { user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to construct proper image URL
  const getBusinessImageUrl = (image?: string) => {
    if (!image) return '/placeholder.svg';
    // If already a full URL, return as is
    if (image.startsWith('http')) return image;
    // If it's a relative path, prepend the backend media URL
    if (image.startsWith('/media/')) {
      return `http://localhost:8000${image}`;
    }
    // If it's just a filename or path without /media/, prepend the full media URL
    return `http://localhost:8000/media/${image.replace(/^media\//, '')}`;
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user.isAuthenticated || !user.authToken) {
        setError('Please log in to view your investments.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/investments-tracking/investor-recent/', {
          headers: {
            'Authorization': `Bearer ${user.authToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please log in again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        
        const data = await response.json();
        // Transform the data to match our Investment interface
        const transformedData: Investment[] = data.map((item: any) => ({
          id: item.id,
          business: {
            id: item.business_id,
            title: item.business_name,
            category: item.category_name,
            location: item.business_location,
            funding_goal: item.business_funding_goal,
            current_funding: item.business_current_funding,
            backers: item.business_backers,
            image: item.business_image,
            deadline: item.business_deadline || '',
            user: {
              id: item.entrepreneur_id,
              username: item.entrepreneur_username,
              first_name: item.entrepreneur_first_name,
              last_name: item.entrepreneur_last_name,
            }
          },
          amount: item.amount_invested,
          invested_at: item.investment_date,
          share_percentage: item.share_percentage
        }));
        
        setInvestments(transformedData);
      } catch (e) {
        console.error('Error fetching investments:', e);
        setError('Could not load your investments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestments();
  }, [user.isAuthenticated, user.authToken]);

  const handleMessageOwner = (businessOwnerId: number, businessOwnerName: string) => {
    // Navigate to messaging page with the business owner
    navigate('/messages', { 
      state: { 
        openChatWith: businessOwnerName,
        openTab: 'search'
      } 
    });
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  const calculateProgress = (current: number, goal: number) => Math.min((current / goal) * 100, 100);

  const getInvestmentStatus = (investment: Investment) => {
    if (!investment.business.deadline) {
      // If no deadline, check if it's fully funded
      if (investment.business.current_funding >= investment.business.funding_goal) {
        return { status: 'Fully Funded', color: 'text-green-600', bgColor: 'bg-green-100' };
      } else {
        return { status: 'Raising Funds', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      }
    }
    
    const now = new Date();
    const deadline = new Date(investment.business.deadline);
    const isExpired = deadline < now;
    const hasExactFunding = investment.business.current_funding === investment.business.funding_goal;
    
    if (hasExactFunding) {
      return { status: 'Fully Funded', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (isExpired) {
      return { status: 'Funding Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else {
      return { status: 'Raising Funds', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    }
  };

  const isBusinessActive = (investment: Investment) => {
    return investment.business.current_funding >= investment.business.funding_goal;
  };

  // Show loading state while user context is loading
  if (user.loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!user.isAuthenticated) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          Please log in to view your investments.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Investments</h1>
        <button
          onClick={() => navigate('/catalogue')}
          className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Eye size={18} />
          Browse More Businesses
        </button>
      </div>

      {loading && <div className="text-center text-gray-500">Loading your investments...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {investments.map(investment => {
          const { status, color, bgColor } = getInvestmentStatus(investment);
          const ownerName = investment.business.user.first_name && investment.business.user.last_name 
            ? `${investment.business.user.first_name} ${investment.business.user.last_name}`
            : investment.business.user.username;
          
          return (
            <div key={investment.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group">
              <div className="h-56 bg-gray-100">
                <img 
                  src={getBusinessImageUrl(investment.business.image)} 
                  alt={investment.business.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <h2 
                    onClick={() => navigate(`/business/${investment.business.id}`)}
                    className="text-xl font-bold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors flex-1"
                  >
                    {investment.business.title}
                  </h2>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${color} ml-2 flex-shrink-0`}>
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{investment.business.category} • {investment.business.location}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-600">Your Investment</span>
                    <span className="text-gray-900">{formatCurrency(investment.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-600">Your Share</span>
                    <span className="text-gray-900">{investment.share_percentage.toFixed(1)}%</span>
                  </div>
                  {investment.business.funding_goal > 0 && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${calculateProgress(investment.business.current_funding, investment.business.funding_goal)}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{calculateProgress(investment.business.current_funding, investment.business.funding_goal).toFixed(0)}%</span>
                        <span>Goal: {formatCurrency(investment.business.funding_goal)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Invested: {new Date(investment.invested_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div 
                      onClick={() => handleMessageOwner(investment.business.user.id, ownerName)}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <MessageSquare size={16} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-sm text-gray-900 truncate">{ownerName}</p>
                        <p className="text-xs text-gray-500">Owner</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{investment.business.backers || 0}</p>
                      <p className="text-xs text-gray-500">Backers</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Professional & Intuitive Layout */}
                  <div className="space-y-3">
                    {/* Secondary Actions Row 1 */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => navigate(`/businesses/${investment.business.id}/logs`)} 
                        disabled={!isBusinessActive(investment)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors border ${
                          isBusinessActive(investment)
                            ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                            : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                        title={!isBusinessActive(investment) ? 'Business must be fully funded to view logs' : 'View business logs'}
                      >
                        <FileText size={14} />
                        <span>View Logs</span>
                      </button>
                      <button 
                        onClick={() => navigate(`/business/${investment.business.id}/fund-statistics`)} 
                        disabled={!isBusinessActive(investment)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors border ${
                          isBusinessActive(investment)
                            ? 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200'
                            : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                        title={!isBusinessActive(investment) ? 'Business must be fully funded to view statistics' : 'View fund statistics'}
                      >
                        <BarChart3 size={14} />
                        <span>Statistics</span>
                      </button>
                    </div>
                    
                    {/* Secondary Actions Row 2 */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => navigate(`/business/${investment.business.id}`)} 
                        className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                      <button 
                        onClick={() => handleMessageOwner(investment.business.user.id, ownerName)} 
                        className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors border border-purple-200" 
                      >
                        <MessageSquare size={14} />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {investments.length === 0 && !loading && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-12 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">You haven't made any investments yet.</h3>
            <p className="text-gray-500 mt-1">Click the button above to browse businesses and start investing!</p>
          </div>
        )}
      </div>
    </div>
  );
} 