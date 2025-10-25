import { Complaint } from '../lib/api';
import { MapPin, Calendar, Tag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComplaintCardProps {
  complaint: Complaint;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  Resolved: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
};

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const createdBy = typeof complaint.createdBy === 'string' ? null : complaint.createdBy;
  const assignedTo = complaint.assignedTo;

  return (
    <Link to={`/complaints/${complaint._id}`}>
      <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-orange-400 transition shadow-sm hover:shadow-md overflow-hidden">
        {complaint.photos && complaint.photos.length > 0 && (
          <div className="h-48 overflow-hidden bg-gray-100">
            <img
              // src={complaint.photos[0]}
              src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${complaint.photos[0]}`}
              alt={complaint.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex-1 mr-3">
              {complaint.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                statusColors[complaint.status]
              }`}
            >
              {complaint.status}
            </span>
          </div>

          {complaint.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {complaint.description}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-orange-500" />
              <span className="capitalize">{complaint.category}</span>
            </div>

            {complaint.location?.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                <span className="truncate">{complaint.location.address}</span>
              </div>
            )}

            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>

            {createdBy && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                <span>{createdBy.name}</span>
              </div>
            )}

            {assignedTo && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-green-700">
                  Assigned to: {assignedTo.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
