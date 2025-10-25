import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, Complaint } from '../lib/api';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      if (user?.role === 'citizen') {
        const response = await api.getMyComplaints();
        setComplaints(response.complaints);
      } else {
        const response = await api.listComplaints();
        setComplaints(response.complaints);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [user]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.role === 'citizen' ? 'My Complaints' : 'All Complaints'}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadComplaints}
                className="px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              {user?.role === 'citizen' && (
                <Link
                  to="/complaints/new"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Complaint
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No complaints yet
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'citizen'
                ? "You haven't reported any issues yet."
                : 'No complaints have been filed.'}
            </p>
            {user?.role === 'citizen' && (
              <Link
                to="/complaints/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Report Your First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
