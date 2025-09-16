import React from 'react';
import { Calendar, User, MessageSquare, Clock, Book } from 'lucide-react';
import { BorrowRequestDto } from '../../../types/borrowRequests';
import { getBorrowRequestStatusDisplay } from '../../../utilities/statusDisplayHelpers';
import { StatusBadge } from '../StatusBadge';

interface BorrowRequestDisplayProps {
  borrowRequest: BorrowRequestDto;
  variant?: 'card' | 'compact' | 'modal' | 'list';
  selected?: boolean;
  onClick?: () => void;
  showSelection?: boolean;
  className?: string;
}

export function BorrowRequestDisplay({
  borrowRequest,
  variant = 'card',
  selected = false,
  onClick,
  showSelection = false,
  className = ''
}: BorrowRequestDisplayProps) {
  const statusConfig = getBorrowRequestStatusDisplay(borrowRequest.status ?? 'pending');

  const variantStyles = {
    card: 'p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors',
    compact: 'p-3 rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors',
    list: 'p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors',
    modal: '' // Special layout for modal view
  };

  const layoutStyles = {
    card: 'space-y-3',
    compact: 'space-y-2',
    list: 'flex flex-col space-y-2',
    modal: 'space-y-4'
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

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

  // Modal variant - detailed view
  if (variant === 'modal') {
    return (
      <div className={`${variantStyles[variant]} ${className}`}>
        <div className={layoutStyles[variant]}>
          {/* Title - prominent display */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
              {borrowRequest.borrowerUsername} requested to borrow "{borrowRequest.mediaTitle}"
            </h2>
            {borrowRequest.mediaCreator && (
              <p className="text-sm text-gray-600 mt-1">by {borrowRequest.mediaCreator}</p>
            )}
          </div>

          {/* Status and key dates row */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Request Status</span>
              </div>
              <StatusBadge config={statusConfig} />
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Updated:</span>
              <span className="ml-2 font-medium">{formatDateTime(borrowRequest.updatedAt)}</span>
            </div>
          </div>

          {/* People involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Borrower</span>
              </div>
              <p className="font-semibold text-gray-900">{borrowRequest.borrowerUsername}</p>
              <p className="text-sm text-gray-600">ID: {borrowRequest.borrowerId}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Owner</span>
              </div>
              <p className="font-semibold text-gray-900">{borrowRequest.ownerUsername}</p>
            </div>
          </div>

          {/* Requested dates - more prominent */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-lavender-600 mr-2" />
              <span className="text-base font-semibold text-gray-900">Requested Dates</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Start Date</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(borrowRequest.requestedStartDate)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">End Date</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(borrowRequest.requestedEndDate)}</div>
              </div>
            </div>
          </div>

          {/* Message */}
          {borrowRequest.message && borrowRequest.message.trim() !== '' && (
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div className="flex items-center mb-2">
                <MessageSquare className="w-3 h-3 text-gray-400 mr-1" />
                <span className="font-medium">Message:</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{borrowRequest.message}</p>
            </div>
          )}

          {/* Status-specific information */}
          {borrowRequest.status === 'approved' && borrowRequest.approvedAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-1">Approved</h3>
              <p className="text-sm text-green-700">
                Approved on: {formatDateTime(borrowRequest.approvedAt)}
              </p>
            </div>
          )}

          {borrowRequest.status === 'denied' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Denied</h3>
              <div className="space-y-1">
                {borrowRequest.deniedAt && (
                  <p className="text-sm text-red-700">
                    Denied on: {formatDateTime(borrowRequest.deniedAt)}
                  </p>
                )}
                {borrowRequest.denialReason && borrowRequest.denialReason.trim() !== '' && (
                  <div>
                    <span className="text-sm text-red-700 font-medium">Reason:</span>
                    <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{borrowRequest.denialReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // All other variants (card, compact, list)
  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View request from ${borrowRequest.borrowerUsername}` : undefined}
    >
      <div className={layoutStyles[variant]}>
        {/* Top row: Request title and status */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Request info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 break-words">
              {borrowRequest.borrowerUsername} requested "{borrowRequest.mediaTitle}"
            </h3>
            {borrowRequest.mediaCreator && (
              <p className="text-sm text-gray-600 mt-1 truncate">by {borrowRequest.mediaCreator}</p>
            )}
          </div>

          {/* Right: Status badge */}
          <div className="flex-shrink-0">
            <StatusBadge config={statusConfig} />
          </div>
        </div>

        {/* Middle row: People and dates aligned */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: People involved with labels */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-600">Borrower:</span>
              <span className="font-medium">{borrowRequest.borrowerUsername}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-600">Owner:</span>
              <span className="font-medium">{borrowRequest.ownerUsername}</span>
            </div>
          </div>

          {/* Right: Requested dates - aligned with people */}
          <div className="flex flex-col items-end gap-1 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Start:</span>
              <span className="font-semibold">{formatDate(borrowRequest.requestedStartDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">End:</span>
              <span className="font-semibold">{formatDate(borrowRequest.requestedEndDate)}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: Message preview and metadata */}
        <div className="space-y-2">
          {/* Message preview */}
          {borrowRequest.message && borrowRequest.message.trim() !== '' && (
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <MessageSquare className="w-3 h-3 text-gray-400" />
                <span className="font-medium">Message:</span>
              </div>
              <p className="line-clamp-2 leading-relaxed">
                {borrowRequest.message}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}