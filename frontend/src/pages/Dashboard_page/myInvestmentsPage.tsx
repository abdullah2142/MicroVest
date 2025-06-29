import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Eye } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface Investment {
  id: number;
  business: number;
  business_title: string;
  business_category: string;
  entrepreneur_name: string;
  amount: number;
  formatted_amount: string;
  invested_at: string;
}

interface Log {
  id: number;
  title: string;
  profit_generated: number;
  formatted_profit_generated: string;
  created_at: string;
  business_title: string;
  entrepreneur_name: string;
  documents?: { name: string; file_url: string; size: string }[];
}

export default function MyInvestmentsPage() {
  const { user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [logsByBusiness, setLogsByBusiness] = useState<Record<number, Log[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        const response = await fetch('http://localhost:8000/api/investments-tracking/my-investments/', {
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
        setInvestments(data);
        // Fetch logs for each business
        for (const inv of data) {
          fetchLogs(inv.business);
        }
      } catch (e) {
        setError('Could not load your investments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
    // eslint-disable-next-line
  }, [user.isAuthenticated, user.authToken]);

  const fetchLogs = async (businessId: number) => {
    try {
      const token = user.authToken;
      const res = await fetch(`http://localhost:8000/api/logs/business/${businessId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setLogsByBusiness(prev => ({ ...prev, [businessId]: data }));
    } catch {}
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  // Chart data for a business's logs (profit_generated over time)
  const getChartData = (logs: Log[]) => {
    const labels = logs.map(log => new Date(log.created_at).toLocaleDateString());
    const data = logs.map(log => log.profit_generated || 0);
    return {
      labels,
      datasets: [
        {
          label: 'Profit Generated',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (user.loading) {
    return <div className="w-full px-4 sm:px-6 lg:px-8 py-8"><div className="text-center text-gray-500">Loading...</div></div>;
  }
  if (!user.isAuthenticated) {
    return <div className="w-full px-4 sm:px-6 lg:px-8 py-8"><div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">Please log in to view your investments.</div></div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Investments</h1>
      </div>
      {loading && <div className="text-center text-gray-500">Loading your investments...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {investments.map(inv => {
          const logs = logsByBusiness[inv.business] || [];
          return (
            <div key={inv.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group">
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-xl font-bold text-gray-900 truncate flex-1">{inv.business_title}</h2>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 ml-2 flex-shrink-0">{inv.business_category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Entrepreneur: {inv.entrepreneur_name}</p>
                <p className="text-sm text-gray-500 mb-4">Invested: <span className="font-semibold text-gray-900">{formatCurrency(Number(inv.amount))}</span></p>
                <p className="text-xs text-gray-400 mb-2">Invested at: {new Date(inv.invested_at).toLocaleDateString()}</p>
                {/* Chart if log data available */}
                {logs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Business Performance</h4>
                    <Bar data={getChartData(logs)} options={{ responsive: true, plugins: { legend: { display: false } } }} height={180} />
                  </div>
                )}
                {/* Logs */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">Business Logs</h4>
                  {logs.length === 0 ? (
                    <div className="text-gray-500 text-sm">No logs available.</div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map(log => (
                        <div key={log.id} className="bg-gray-50 rounded p-3 flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{log.title}</span>
                            <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs text-gray-500">Profit: {log.formatted_profit_generated || '-'}</span>
                          {log.documents && log.documents.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {log.documents.map((doc, i) => (
                                <a key={i} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded hover:bg-blue-100 transition-colors">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-blue-700">{doc.name}</span>
                                  <span className="text-xs text-gray-500">({doc.size})</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {investments.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">You haven't made any investments yet.</h3>
        </div>
      )}
    </div>
  );
} 