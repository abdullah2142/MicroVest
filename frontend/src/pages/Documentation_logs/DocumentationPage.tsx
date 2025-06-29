import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, ArrowLeft } from 'lucide-react';

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

export default function DocumentationPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:8000/api/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch businesses');
        }

        const data = await response.json();
        setBusinesses(data);
      } catch (e) {
        console.error('Error fetching businesses:', e);
        setError(e instanceof Error ? e.message : 'Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '$0';
    }
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD", 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleCreateLog = (businessId: number) => {
    navigate(`/businesses/${businessId}/logs/create`);
  };

  const handleViewLogs = (businessId: number) => {
    navigate(`/businesses/${businessId}/logs`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 mt-2">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading documentation</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* Main Content */}
      <div className="w-full px-24 py-12 max-w-none">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Documentation</h2>
          <p className="text-gray-600">Manage logs and documentation for your business ventures</p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No businesses found</h3>
            <p className="text-gray-500 mb-6">You need to create a business first to manage its documentation.</p>
            <button
              onClick={() => navigate('/pitch')}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Create Your First Business
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Business Image */}
                <div className="h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-4xl font-bold">
                      {business.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{business.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{business.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium text-gray-900">{business.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-gray-900">{business.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Funding Raised:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(parseFloat(business.current_funding?.toString() || '0'))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Investors:</span>
                      <span className="font-medium text-gray-900">{parseInt(business.backers?.toString() || '0')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleCreateLog(business.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Create Logs
                    </button>
                    <button
                      onClick={() => handleViewLogs(business.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 