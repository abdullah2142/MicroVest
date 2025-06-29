import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, DollarSign, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

interface Business {
  id: number;
  title: string;
  entrepreneur_name: string;
}

export default function CreateLogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fund_usage: '',
    progress_update: '',
    achievements: '',
    challenges: '',
    next_steps: '',
    financial_update: '',
    profit_generated: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        profit_generated: formData.profit_generated ? formData.profit_generated : null
      };

      const res = await fetch('http://localhost:8000/api/logs/', {
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
    return formData.title.trim() && formData.content.trim();
  };

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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Log Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Q1 2025 Progress Update - Expansion Milestones"
                required
              />
            </div>

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
            <div>
              <label htmlFor="fund_usage" className="block text-sm font-medium text-gray-700 mb-2">
                Fund Usage
              </label>
              <textarea
                id="fund_usage"
                name="fund_usage"
                value={formData.fund_usage}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detail how the raised funds have been allocated and used..."
              />
            </div>

            <div>
              <label htmlFor="financial_update" className="block text-sm font-medium text-gray-700 mb-2">
                Financial Update
              </label>
              <textarea
                id="financial_update"
                name="financial_update"
                value={formData.financial_update}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide financial metrics, revenue updates, and key financial milestones..."
              />
            </div>

            <div>
              <label htmlFor="profit_generated" className="block text-sm font-medium text-gray-700 mb-2">
                Profit Generated (BDT)
              </label>
              <input
                type="number"
                id="profit_generated"
                name="profit_generated"
                value={formData.profit_generated}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
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
            disabled={!isFormValid() || loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
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