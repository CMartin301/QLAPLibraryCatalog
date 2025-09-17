import React from 'react';
import { Calendar, User, Clock, CheckCircle, AlertCircle, Hash, FileText, BookOpen } from 'lucide-react';
import { LoanWithDetails } from '../../../types/loans';
import { StatusBadge } from '../StatusBadge';

interface LoanDisplayProps {
  loan: LoanWithDetails;
  variant?: 'card' | 'compact' | 'modal' | 'list';
  selected?: boolean;
  onClick?: () => void;
  showSelection?: boolean;
  className?: string;
}

export function LoanDisplay({
  loan,
  variant = 'card',
  selected = false,
  onClick,
  showSelection = false,
  className = ''
}: LoanDisplayProps) {
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
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not set';
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

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'Not set';
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

  // Get status configuration
  const getStatusConfig = () => {
    switch (loan.status.toLowerCase()) {
      case 'active':
        return {
          text: 'Active',
          color: 'blue' as const,
          icon: Clock
        };
      case 'returned':
        return {
          text: 'Returned',
          color: 'green' as const,
          icon: CheckCircle
        };
      case 'overdue':
        return {
          text: `Overdue${loan.daysOverdue ? ` (${loan.daysOverdue} days)` : ''}`,
          color: 'red' as const,
          icon: AlertCircle
        };
      default:
        return {
          text: loan.status.charAt(0).toUpperCase() + loan.status.slice(1),
          color: 'gray' as const,
          icon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig();

  const InfoRow = ({ 
    icon: Icon, 
    label, 
    value, 
    variant = 'default' 
  }: { 
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | number | null | undefined;
    variant?: 'default' | 'success' | 'warning' | 'error';
  }) => {
    if (!value) return null;
    
    const variantClasses = {
      default: 'text-lavender-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    };
    
    return (
      <div className="flex items-start gap-3 py-1">
        <Icon 
          size={16} 
          className={`${variantClasses[variant]} mt-0.5 flex-shrink-0`}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className="ml-2 text-sm text-gray-900">{value}</span>
        </div>
      </div>
    );
  };

  // Modal variant - detailed view
  if (variant === 'modal') {
    return (
      <div className={`${variantStyles[variant]} ${className}`}>
        <div className={layoutStyles[variant]}>
          {/* Title - prominent display */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
              {loan.borrowerUsername} borrowed "{loan.mediaTitle}"
            </h2>
            {loan.mediaAuthor && (
              <p className="text-sm text-gray-600 mt-1">by {loan.mediaAuthor}</p>
            )}

          </div>

          {/* Status and overdue warning */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Loan Status</span>
              </div>
              <StatusBadge config={statusConfig} />
            </div>
            
            {loan.isOverdue && loan.daysOverdue && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle size={16} className="text-red-500" aria-hidden="true" />
                <span className="text-sm text-red-700 font-medium">
                  Overdue by {loan.daysOverdue} day{loan.daysOverdue !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* People involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Borrower</span>
              </div>
              <p className="font-semibold text-gray-900">{loan.borrowerUsername}</p>
              <p className="text-sm text-gray-600">ID: {loan.borrowerId}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Owner</span>
              </div>
              <p className="font-semibold text-gray-900">{loan.ownerUsername}</p>
              <p className="text-sm text-gray-600">ID: {loan.ownerId}</p>
            </div>
          </div>

          {/* Loan dates - more prominent */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-lavender-600 mr-2" />
              <span className="text-base font-semibold text-gray-900">Loan Period</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Start Date</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(loan.startDate)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Due Date</div>
                <div className={`text-lg font-semibold ${loan.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(loan.dueDate)}
                </div>
              </div>
            </div>
            
            {loan.returnedDate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Returned Date</div>
                <div className="text-lg font-semibold text-green-600">{formatDate(loan.returnedDate)}</div>
              </div>
            )}
          </div>

          {/* Copy information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <BookOpen className="w-4 h-4 text-lavender-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Copy Details</span>
            </div>
            <div className="space-y-2">
              <InfoRow icon={FileText} label="Condition" value={loan.copyCondition} />
            </div>
            {loan.copyNotes && loan.copyNotes.trim() !== '' && (
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 mt-3">
                <div className="flex items-center mb-1">
                  <FileText className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="font-medium">Copy Notes:</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{loan.copyNotes}</p>
              </div>
            )}
          </div>

          {/* Return details and notes */}
          {(loan.borrowerReturnedAt || loan.lenderConfirmedReturnAt || loan.borrowerReturnNotes || loan.lenderReturnNotes) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Return Details</span>
              </div>
              
              <div className="space-y-3">
                {loan.borrowerReturnedAt && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Borrower Returned</div>
                    <div className="text-sm text-gray-900">{formatDateTime(loan.borrowerReturnedAt)}</div>
                  </div>
                )}
                
                {loan.lenderConfirmedReturnAt && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Owner Confirmed</div>
                    <div className="text-sm text-gray-900">{formatDateTime(loan.lenderConfirmedReturnAt)}</div>
                  </div>
                )}
                
                {loan.borrowerReturnNotes && loan.borrowerReturnNotes.trim() !== '' && (
                  <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">
                    <div className="flex items-center mb-1">
                      <User className="w-3 h-3 text-blue-500 mr-1" />
                      <span className="font-medium">Borrower Notes:</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{loan.borrowerReturnNotes}</p>
                  </div>
                )}
                
                {loan.lenderReturnNotes && loan.lenderReturnNotes.trim() !== '' && (
                  <div className="p-2 bg-green-50 rounded text-xs text-green-600">
                    <div className="flex items-center mb-1">
                      <User className="w-3 h-3 text-green-500 mr-1" />
                      <span className="font-medium">Owner Notes:</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{loan.lenderReturnNotes}</p>
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
      aria-label={onClick ? `View loan for ${loan.mediaTitle}` : undefined}
    >
      <div className={layoutStyles[variant]}>
        {/* Top row: Loan title and status */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Loan info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 break-words">
              {loan.borrowerUsername} borrowed "{loan.mediaTitle}"
            </h3>
            {loan.mediaAuthor && (
              <p className="text-sm text-gray-600 mt-1 truncate">by {loan.mediaAuthor}</p>
            )}
          </div>

          {/* Right: Status badge */}
          <div className="flex-shrink-0">
            <StatusBadge config={statusConfig} />
          </div>
        </div>

        {/* Middle row: People and key dates aligned */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: People involved with labels */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-600">Borrower:</span>
              <span className="font-medium">{loan.borrowerUsername}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-600">Owner:</span>
              <span className="font-medium">{loan.ownerUsername}</span>
            </div>
          </div>

          {/* Right: Loan dates - aligned with people */}
          <div className="flex flex-col items-end gap-1 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Start:</span>
              <span className="font-semibold">{formatDate(loan.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Due:</span>
              <span className={`font-semibold ${loan.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(loan.dueDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row: Notes */}
        <div className="space-y-2">
          {/* Copy notes preview */}
          {loan.copyNotes && loan.copyNotes.trim() !== '' && (
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="w-3 h-3 text-gray-400" />
                <span className="font-medium">Copy Notes:</span>
              </div>
              <p className="line-clamp-2 leading-relaxed">
                {loan.copyNotes}
              </p>
            </div>
          )}

          {/* Return notes preview */}
          {(loan.borrowerReturnNotes || loan.lenderReturnNotes) && (
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle className="w-3 h-3 text-gray-400" />
                <span className="font-medium">Return Notes Available</span>
              </div>
              {loan.borrowerReturnNotes && (
                <p className="line-clamp-1 leading-relaxed">
                  Borrower: {loan.borrowerReturnNotes}
                </p>
              )}
              {loan.lenderReturnNotes && (
                <p className="line-clamp-1 leading-relaxed">
                  Owner: {loan.lenderReturnNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}