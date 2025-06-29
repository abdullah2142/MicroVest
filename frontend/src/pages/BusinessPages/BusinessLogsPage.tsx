import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';

interface Log {
  id: number;
  title: string;
  content: string;
  fund_usage: string;
  progress_update: string;
  achievements: string;
  challenges: string;
  next_steps: string;
  financial_update: string;
  month: number;
  year: number;
  total_revenue: number;
  total_expense: number;
  profit_generated: number;
  formatted_total_revenue: string;
  formatted_total_expense: string;
  formatted_profit_generated: string;
  created_at: string;
  updated_at: string;
  business_title: string;
  entrepreneur_name: string;
  documents?: { name: string; file_url: string; size: string }[];
}

export default function BusinessLogsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [businessTitle, setBusinessTitle] = useState('');
  const [entrepreneurName, setEntrepreneurName] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`http://localhost:8000/api/logs/business/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
        if (data.length > 0) {
          setBusinessTitle(data[0].business_title);
          setEntrepreneurName(data[0].entrepreneur_name);
        }
      } catch (e) {
        setError('Could not load logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [id]);

  useEffect(() => {
    // Check if current user is owner (by comparing entrepreneur_name to localStorage name, or fetch business details if needed)
    // For now, just check if userType is entrepreneur
    const userType = localStorage.getItem('userType');
    setIsOwner(userType === 'entrepreneur');
  }, []);

  const toggleExpand = (logId: number) => {
    setExpanded(expanded === logId ? null : logId);
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto py-10 px-8 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Business Logs</h1>
          <p className="text-gray-400">{businessTitle && (
            <span>for <span className="font-semibold text-gray-300">{businessTitle}</span></span>
          )}</p>
        </div>
        {isOwner && (
          <button
            onClick={() => navigate(`/businesses/${id}/logs/create`)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle size={18} />
            Create Log
          </button>
        )}
      </div>
      {loading && <div className="text-center text-gray-400">Loading logs...</div>}
      {error && <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-700">{error}</div>}
      <div className="space-y-6">
        {logs.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">No logs have been posted yet.</h3>
            {isOwner && <p className="text-gray-400 mt-1">Click the button above to create your first log!</p>}
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-750" onClick={() => toggleExpand(log.id)}>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{log.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {log.month && log.year ? `${log.month}/${log.year}` : new Date(log.created_at).toLocaleDateString()}
                  <User className="w-4 h-4 ml-4" />
                  {log.entrepreneur_name || 'Entrepreneur'}
                </div>
              </div>
              <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                {expanded === log.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {expanded === log.id && (
              <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-700 animate-fade-in">
                {/* Financial Summary */}
                <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                  <h4 className="font-semibold text-white mb-3">Financial Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Total Revenue</div>
                      <div className="text-lg font-semibold text-emerald-400">{log.formatted_total_revenue}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Total Expense</div>
                      <div className="text-lg font-semibold text-red-400">{log.formatted_total_expense}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Profit</div>
                      <div className="text-lg font-semibold text-blue-400">{log.formatted_profit_generated}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Progress Update</h4>
                    <p className="text-gray-300 whitespace-pre-line">{log.progress_update}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Fund Usage</h4>
                    <p className="text-gray-300 whitespace-pre-line">{log.fund_usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Achievements</h4>
                    <p className="text-gray-300 whitespace-pre-line">{log.achievements}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Next Steps</h4>
                    <p className="text-gray-300 whitespace-pre-line">{log.next_steps}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Financial Update</h4>
                    <p className="text-gray-300 whitespace-pre-line">{log.financial_update}</p>
                  </div>
                  {log.challenges && (
                    <div>
                      <h4 className="font-semibold text-white mb-1">Challenges</h4>
                      <p className="text-gray-300 whitespace-pre-line">{log.challenges}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Full Description</h4>
                  <p className="text-gray-300 whitespace-pre-line mb-2">{log.content}</p>
                </div>
                {log.documents && log.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {log.documents.map((doc, i) => (
                        <a key={i} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors border border-gray-600">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="font-medium text-emerald-300">{doc.name}</span>
                          <span className="text-xs text-gray-400">({doc.size})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 