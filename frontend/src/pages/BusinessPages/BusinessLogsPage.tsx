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
    <div className="w-full max-w-[1920px] mx-auto py-10 px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Business Logs</h1>
          <p className="text-gray-500">{businessTitle && (
            <span>for <span className="font-semibold text-gray-700">{businessTitle}</span></span>
          )}</p>
        </div>
        {isOwner && (
          <button
            onClick={() => navigate(`/businesses/${id}/logs/create`)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={18} />
            Create Log
          </button>
        )}
      </div>
      {loading && <div className="text-center text-gray-500">Loading logs...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      <div className="space-y-6">
        {logs.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">No logs have been posted yet.</h3>
            {isOwner && <p className="text-gray-500 mt-1">Click the button above to create your first log!</p>}
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer" onClick={() => toggleExpand(log.id)}>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{log.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(log.created_at).toLocaleDateString()}
                  <User className="w-4 h-4 ml-4" />
                  {log.entrepreneur_name || 'Entrepreneur'}
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                {expanded === log.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {expanded === log.id && (
              <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-100 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Progress Update</h4>
                    <p className="text-gray-600 whitespace-pre-line">{log.progress_update}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Fund Usage</h4>
                    <p className="text-gray-600 whitespace-pre-line">{log.fund_usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Achievements</h4>
                    <p className="text-gray-600 whitespace-pre-line">{log.achievements}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Next Steps</h4>
                    <p className="text-gray-600 whitespace-pre-line">{log.next_steps}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Financial Update</h4>
                    <p className="text-gray-600 whitespace-pre-line">{log.financial_update}</p>
                  </div>
                  {log.challenges && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Challenges</h4>
                      <p className="text-gray-600 whitespace-pre-line">{log.challenges}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Full Description</h4>
                  <p className="text-gray-700 whitespace-pre-line mb-2">{log.content}</p>
                </div>
                {log.documents && log.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {log.documents.map((doc, i) => (
                        <a key={i} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-blue-100 transition-colors">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-700">{doc.name}</span>
                          <span className="text-xs text-gray-500">({doc.size})</span>
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