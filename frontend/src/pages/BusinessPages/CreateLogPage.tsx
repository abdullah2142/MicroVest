import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, DollarSign, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { MONTHS } from '../../utils/months';

interface Business {
  id: number;
  title: string;
  entrepreneur_name: string;
  funding_goal: number;
  current_funding: number;
}

export default function CreateLogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [existingLogs, setExistingLogs] = useState<{ month: number; year: number }[]>([]);
  const [formData, setFormData] = useState({
    content: '',
    fund_usage: '',
    progress_update: '',
    achievements: '',
    challenges: '',
    next_steps: '',
    financial_update: '',
    month: new Date().getMonth() + 1,
    year: 2025,
    total_revenue: '',
    total_expense: '',
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const res = await fetch(`http://localhost:8000/api/businesses/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch business details');
        }

        const data = await res.json();
        setBusiness(data);
      } catch (e) {
        console.error('Error fetching business:', e);
        setError(e instanceof Error ? e.message : 'Could not load business details.');
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  useEffect(() => {
    const fetchExistingLogs = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const res = await fetch(`http://localhost:8000/api/logs/business/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const logs = await res.json();
          const loggedMonths = logs.map((log: any) => ({
            month: log.month,
            year: log.year
          }));
          setExistingLogs(loggedMonths);
        }
      } catch (error) {
        console.error('Error fetching existing logs:', error);
      }
    };

    if (id) {
      fetchExistingLogs();
    }
  }, [id]);

  useEffect(() => {
    const fetchNextMonthYear = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch(`http://localhost:8000/api/logs/next-month-year/?business=${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({ ...prev, month: data.month, year: data.year }));
        }
      } catch {
        // Fallback: if no logs exist, start with current month of 2025
        const currentMonth = new Date().getMonth() + 1;
        setFormData(prev => ({ ...prev, month: currentMonth, year: 2025 }));
      }
    };
    if (id) fetchNextMonthYear();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatedProfit =
    parseFloat(formData.total_revenue || '0') - parseFloat(formData.total_expense || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const submitData = {
        ...formData,
        business: parseInt(id!),
        total_revenue: formData.total_revenue,
        total_expense: formData.total_expense,
        month: formData.month,
        year: formData.year,
      };

      const res = await fetch('http://localhost:8000/api/logs/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!res.ok) {
        let errorMessage = 'Failed to create log';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.detail || errorMessage;
          } else {
            // Handle non-JSON responses (like HTML error pages)
            const textResponse = await res.text();
            console.error('Non-JSON response:', textResponse);
            errorMessage = `Server error (${res.status}): ${res.statusText}`;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          errorMessage = `Server error (${res.status}): ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // After success, auto-increment month/year and reset form for next log
      let nextMonth = parseInt(formData.month as any) + 1;
      let nextYear = parseInt(formData.year as any);
      if (nextMonth > 12) { 
        nextMonth = 1; 
        nextYear = 2026; // After December 2025, go to 2026
      }
      setFormData(prev => ({
        ...prev,
        content: '', fund_usage: '', progress_update: '', achievements: '', challenges: '', next_steps: '', financial_update: '',
        month: nextMonth, year: nextYear, total_revenue: '', total_expense: ''
      }));
      setError(null);

      // Navigate back to logs page
      navigate(`/businesses/${id}/logs`);
    } catch (e) {
      console.error('Error creating log:', e);
      setError(e instanceof Error ? e.message : 'Failed to create log');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.content.trim() && 
           formData.total_revenue && 
           formData.total_expense && 
           availableMonths.length > 0;
  };

  const isBusinessFullyFunded = () => {
    return business && business.current_funding === business.funding_goal;
  };

  const getAvailableMonths = () => {
    const currentYear = formData.year;
    const loggedMonthsThisYear = existingLogs
      .filter(log => log.year === currentYear)
      .map(log => log.month);
    
    return Array.from({ length: 12 }, (_, i) => i + 1)
      .filter(month => !loggedMonthsThisYear.includes(month));
  };

  const availableMonths = getAvailableMonths();

  return (
    <div className="w-full max-w-[1920px] mx-auto py-8 px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/documentation')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Documentation
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Log</h1>
          {business && (
            <p className="text-gray-600">
              for <span className="font-semibold text-gray-800">{business.title}</span>
            </p>
          )}
        </div>
      </div>

      {!isBusinessFullyFunded() && business && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle size={20} />
            <span className="font-semibold">Funding Required</span>
          </div>
          <p className="text-yellow-600 mt-1">
            This business needs to be fully funded before you can create logs. 
            Current funding: ${business.current_funding.toLocaleString()} / ${business.funding_goal.toLocaleString()}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={20} />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Overall Summary / Description *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a comprehensive overview of your business progress, achievements, and current status..."
                required
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Information
          </h2>
          
          <div className="space-y-4">
            {/* Month/Year fields */}
            <div className="flex gap-4">
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableMonths.map(month => (
                    <option key={month} value={month}>{MONTHS[month - 1]}</option>
                  ))}
                </select>
                {availableMonths.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    All months for {formData.year} have been logged. The next log will be for {formData.year + 1}.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            </div>
            <div>
              <label htmlFor="total_revenue" className="block text-sm font-medium text-gray-700 mb-2">Total Revenue (BDT)</label>
              <input
                type="number"
                id="total_revenue"
                name="total_revenue"
                value={formData.total_revenue}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="total_expense" className="block text-sm font-medium text-gray-700 mb-2">Total Expense (BDT)</label>
              <input
                type="number"
                id="total_expense"
                name="total_expense"
                value={formData.total_expense}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profit (BDT)</label>
              <input
                type="number"
                value={isNaN(calculatedProfit) ? '' : calculatedProfit}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                placeholder="Calculated automatically"
              />
            </div>
          </div>
        </div>

        {/* Progress & Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Progress & Achievements
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="progress_update" className="block text-sm font-medium text-gray-700 mb-2">
                Progress Update
              </label>
              <textarea
                id="progress_update"
                name="progress_update"
                value={formData.progress_update}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the progress made since the last update..."
              />
            </div>

            <div>
              <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-2">
                Key Achievements
              </label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List major accomplishments, milestones reached, and successes..."
              />
            </div>
          </div>
        </div>

        {/* Challenges & Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Challenges & Next Steps
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                Challenges & Solutions
              </label>
              <textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe any challenges faced and how they were or will be addressed..."
              />
            </div>

            <div>
              <label htmlFor="next_steps" className="block text-sm font-medium text-gray-700 mb-2">
                Next Steps
              </label>
              <textarea
                id="next_steps"
                name="next_steps"
                value={formData.next_steps}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Outline upcoming plans, goals, and action items..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/documentation')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || loading || !isBusinessFullyFunded()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : availableMonths.length === 0 ? (
              <>
                <Save size={18} />
                All Months Logged
              </>
            ) : (
              <>
                <Save size={18} />
                Create Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 