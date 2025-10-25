import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, Complaint } from '../lib/api';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadComplaint = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.getComplaintById(id);
      setComplaint(response.complaint);
      setStatus(response.complaint.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id || !status) return;
    setUpdating(true);
    try {
      await api.updateComplaintStatus(id, status, resolutionNotes);
      await loadComplaint();
      setResolutionNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!id || !comment.trim()) return;
    setUpdating(true);
    try {
      await api.addComment(id, comment);
      await loadComplaint();
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
    Resolved: 'bg-green-100 text-green-800 border-green-300',
    Rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const createdBy = typeof complaint.createdBy === 'string' ? null : complaint.createdBy;
  const isAuthority = user?.role === 'authority' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-600 hover:text-orange-700 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-orange-500">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 flex-1 mr-4">
                {complaint.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  statusColors[complaint.status]
                }`}
              >
                {complaint.status}
              </span>
            </div>

            {complaint.photos && complaint.photos.length > 0 && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaint.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${photo}`}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                ))}
              </div>
            )}

            {complaint.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Tag className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="font-semibold mr-2">Category:</span>
                  <span className="capitalize">{complaint.category}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="font-semibold mr-2">Created:</span>
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
                {createdBy && (
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-orange-500" />
                    <span className="font-semibold mr-2">Reported by:</span>
                    <span>{createdBy.name}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {complaint.location?.address && (
                  <div className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-orange-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Location:</span>
                      <p className="text-sm">{complaint.location.address}</p>
                      {complaint.location.latitude && complaint.location.longitude && (
                        <p className="text-xs text-gray-500 mt-1">
                          {complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {complaint.assignedTo && (
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-green-500" />
                    <span className="font-semibold mr-2">Assigned to:</span>
                    <span>{complaint.assignedTo.name}</span>
                  </div>
                )}
              </div>
            </div>

            {complaint.resolutionNotes && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Resolution Notes</h3>
                <p className="text-green-800">{complaint.resolutionNotes}</p>
              </div>
            )}

            {isAuthority && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution Notes
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Add notes about the resolution..."
                    />
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments ({complaint.comments?.length || 0})
              </h3>

              {complaint.comments && complaint.comments.length > 0 && (
                <div className="space-y-3 mb-6">
                  {complaint.comments.map((comment, index) => {
                    const commentBy = typeof comment.by === 'string' ? null : comment.by;
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {commentBy?.name || 'Unknown User'}
                          </span>
                          <span className="text-gray-500 text-sm ml-auto">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {isAuthority && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={updating || !comment.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
