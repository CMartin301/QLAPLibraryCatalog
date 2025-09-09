// components/borrowing/borrowRequests/BorrowRequestModal.tsx
import React from 'react';
import { Calendar, User, Book, MessageSquare, Clock } from 'lucide-react';
import { Modal } from '../../shared/Modal';
import { StatusBadge } from '../../shared/StatusBadge';
import { BorrowRequestDto } from '../../../types/borrowRequests';
import { getBorrowRequestStatusDisplay } from '../../../utilities/statusDisplayHelpers';

interface BorrowRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowRequest: BorrowRequestDto | null;
  loading?: boolean;
}

export function BorrowRequestModal({
  isOpen,
  onClose,
  borrowRequest,
  loading = false
}: BorrowRequestModalProps) {
  if (!borrowRequest) {
    return null;
  }

  const statusConfig = getBorrowRequestStatusDisplay(borrowRequest.status ?? 'pending');

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Borrow Request Details"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
          <span className="ml-3 text-gray-600">Loading request details...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Request Status & Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Request #{borrowRequest.requestId}
              </h3>
              <StatusBadge config={statusConfig} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 font-medium">{formatDateTime(borrowRequest.createdAt)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Updated:</span>
                <span className="ml-2 font-medium">{formatDateTime(borrowRequest.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Media Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Book className="w-5 h-5 text-lavender-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Book Details</h3>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Title:</span>
                <p className="font-medium text-gray-900">{borrowRequest.mediaTitle || 'Unknown Title'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Author:</span>
                <p className="font-medium text-gray-900">{borrowRequest.mediaCreator || 'Unknown Author'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Copy ID:</span>
                <p className="font-medium text-gray-900">#{borrowRequest.copyId}</p>
              </div>
            </div>
          </div>

          {/* People Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Borrower</h3>
              </div>
              <p className="font-medium text-gray-900">{borrowRequest.borrowerUsername}</p>
              <p className="text-sm text-gray-600">User ID: {borrowRequest.borrowerId}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Owner</h3>
              </div>
              <p className="font-medium text-gray-900">{borrowRequest.ownerUsername}</p>
            </div>
          </div>

          {/* Requested Dates */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-lavender-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Requested Period</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Start Date:</span>
                <p className="font-medium text-gray-900">{formatDate(borrowRequest.requestedStartDate)}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">End Date:</span>
                <p className="font-medium text-gray-900">{formatDate(borrowRequest.requestedEndDate)}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          {borrowRequest.message && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-lavender-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Message</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{borrowRequest.message}</p>
            </div>
          )}

          {/* Status-specific Information */}
          {borrowRequest.status === 'approved' && borrowRequest.approvedAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Approved</h3>
              <p className="text-sm text-green-700">
                Approved on: {formatDateTime(borrowRequest.approvedAt)}
              </p>
            </div>
          )}

          {borrowRequest.status === 'denied' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Denied</h3>
              <div className="space-y-1">
                {borrowRequest.deniedAt && (
                  <p className="text-sm text-red-700">
                    Denied on: {formatDateTime(borrowRequest.deniedAt)}
                  </p>
                )}
                {borrowRequest.denialReason && (
                  <div>
                    <span className="text-sm text-red-700 font-medium">Reason:</span>
                    <p className="text-sm text-red-700 mt-1">{borrowRequest.denialReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default BorrowRequestModal;