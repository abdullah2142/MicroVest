import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  DollarSign, 
  Users, 
  TrendingUp, 
  PieChart,
  BarChart3,
  Calendar,
  User
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useUser } from "../../context/UserContext";
import Footer from "../../components/footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface InvestmentData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  amount: number;
  invested_at: string;
}

interface ChartData {
  labels: string[];
  amounts: number[];
  colors: string[];
}

interface SummaryData {
  total_invested: number;
  total_investors: number;
  business_title: string;
  funding_goal: number;
  progress_percentage: number;
}

interface FundStatsData {
  summary: SummaryData;
  investor_data: InvestmentData[];
  chart_data: ChartData;
  others_amount: number;
}

type ChartType = "pie" | "bar";

export default function FundStatisticsPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [statsData, setStatsData] = useState<FundStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>("pie");

  useEffect(() => {
    const fetchFundStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/investments-tracking/business/${businessId}/stats/`, {
          headers: {
            'Authorization': `Bearer ${user.authToken}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("You can only view statistics for your own businesses.");
          } else if (response.status === 404) {
            throw new Error("Business not found.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setStatsData(data);
      } catch (e) {
        setError("Failed to fetch fund statistics: " + (e instanceof Error ? e.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (businessId && user.isAuthenticated) {
      fetchFundStats();
    }
  }, [businessId, user.authToken, user.isAuthenticated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPieChartData = () => {
    if (!statsData) return null;
    
    return {
      labels: statsData.chart_data.labels,
      datasets: [
        {
          data: statsData.chart_data.amounts,
          backgroundColor: statsData.chart_data.colors,
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const getBarChartData = () => {
    if (!statsData) return null;
    
    return {
      labels: statsData.chart_data.labels,
      datasets: [
        {
          label: 'Investment Amount',
          data: statsData.chart_data.amounts,
          backgroundColor: statsData.chart_data.colors,
          borderColor: statsData.chart_data.colors.map(color => color + '80'),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  };

  if (loading) return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading fund statistics...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!statsData) return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
      <p>No fund statistics available.</p>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} /> Back to My Businesses
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Fund Statistics</h1>
          <p className="text-lg text-gray-500 mt-2">{statsData.summary.business_title}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statsData.summary.total_invested)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Investors</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.summary.total_investors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.summary.progress_percentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statsData.summary.funding_goal)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Investment Distribution</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType("pie")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  chartType === "pie" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <PieChart className="h-4 w-4 inline mr-1" />
                Pie Chart
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  chartType === "bar" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Bar Chart
              </button>
            </div>
          </div>

          <div className="h-96">
            {chartType === "pie" ? (
              <Pie data={getPieChartData()!} options={chartOptions} />
            ) : (
              <Bar data={getBarChartData()!} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Investor Details Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Investor Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statsData.investor_data.map((investor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {investor.first_name && investor.last_name 
                              ? `${investor.first_name} ${investor.last_name}`
                              : investor.username
                            }
                          </div>
                          <div className="text-sm text-gray-500">@{investor.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(investor.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(investor.invested_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((investor.amount / statsData.summary.total_invested) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {statsData.others_amount > 0 && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Others</div>
                          <div className="text-sm text-gray-500">Additional investors</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(statsData.others_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((statsData.others_amount / statsData.summary.total_invested) * 100).toFixed(1)}%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="h-24" />
      <Footer />
    </div>
  );
} 