// components/borrowing/borrowRequests/BorrowRequestModal.tsx
import React from 'react';
import { Calendar, User, Book, MessageSquare, Clock } from 'lucide-react';
import { Modal } from '../../shared/Modal';
import { StatusBadge } from '../../shared/StatusBadge';
import { BorrowRequestDto } from '../../../types/borrowRequests';
import { getBorrowRequestStatusDisplay } from '../../../utilities/statusDisplayHelpers';
import { BorrowRequestDisplay } from '../../shared/displays/BorrowRequestDisplay';

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
          <BorrowRequestDisplay 
            borrowRequest={borrowRequest} 
            variant="card"
          />

          {/* Media Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Book className="w-5 h-5 text-lavender-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Media Details</h3>
            </div>
            
                  {/* <MediaDisplay 
                    media={media} 
                    variant="modal"
                  /> */}
          </div>
          

        </div>
      )}
    </Modal>
  );
}

export default BorrowRequestModal;