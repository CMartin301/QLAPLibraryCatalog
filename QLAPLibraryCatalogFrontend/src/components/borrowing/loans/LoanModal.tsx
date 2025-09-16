import React from 'react';
import { LoanWithDetails } from '../../../types/loans';
import { Modal } from '../../shared/Modal';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Hash 
} from 'lucide-react';
import { LoanDisplay } from '../../shared/displays/LoanDisplay';

interface LoanModalProps {
  loan: LoanWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanModal({ loan, isOpen, onClose }: LoanModalProps) {
  if (!loan) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <div className="flex items-start gap-3 py-2">
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

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = () => {
      switch (status.toLowerCase()) {
        case 'active':
          return {
            classes: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: Clock,
            label: 'Active'
          };
        case 'returned':
          return {
            classes: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle,
            label: 'Returned'
          };
        case 'overdue':
          return {
            classes: 'bg-red-100 text-red-800 border-red-200',
            icon: AlertCircle,
            label: 'Overdue'
          };
        default:
          return {
            classes: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            label: status.charAt(0).toUpperCase() + status.slice(1)
          };
      }
    };

    const { classes, icon: StatusIcon, label } = getStatusConfig();

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${classes}`}>
        <StatusIcon size={14} aria-hidden="true" />
        {label}
      </span>
    );
  };

  const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-lg font-semibold text-gray-900 mb-3 ${className}`}>
      {children}
    </h3>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-lavender-500" aria-hidden="true" />
          <span>Loan Details</span>
        </div>
      }
      size="lg"
    >

      <LoanDisplay loan={loan} variant={'card'}/>

      <div className="space-y-6">
        {/* Status and Key Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <StatusBadge status={loan.status} />
            <div className="text-sm text-gray-600">
              <strong>Loan ID:</strong> #{loan.loanId}
            </div>
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

        {/* Media Information */}
        <div>
          <SectionTitle>Media Information</SectionTitle>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <BookOpen size={20} className="text-lavender-500 mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1">
                  {loan.mediaTitle}
                </h4>
                <p className="text-sm text-gray-600">
                  {loan.mediaType}
                  {loan.mediaAuthor && ` by ${loan.mediaAuthor}`}
                  {loan.mediaGenre && ` • ${loan.mediaGenre}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Timeline */}
        <div>
          <SectionTitle>Loan Timeline</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <InfoRow 
                icon={Calendar} 
                label="Start Date" 
                value={formatDate(loan.startDate)}
              />
              <InfoRow 
                icon={Calendar} 
                label="Due Date" 
                value={formatDate(loan.dueDate)}
                variant={loan.isOverdue ? 'error' : 'default'}
              />
            </div>
            <div className="space-y-1">
              <InfoRow 
                icon={Calendar} 
                label="Borrower Returned" 
                value={formatDateTime(loan.borrowerReturnedAt)}
                variant={loan.borrowerReturnedAt ? 'success' : 'default'}
              />
              <InfoRow 
                icon={Calendar} 
                label="Lender Confirmed" 
                value={formatDateTime(loan.lenderConfirmedReturnAt)}
                variant={loan.lenderConfirmedReturnAt ? 'success' : 'default'}
              />
            </div>
          </div>
        </div>

        {/* People Involved */}
        <div>
          <SectionTitle>People Involved</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <InfoRow 
                icon={User} 
                label="Borrower" 
                value={loan.borrowerUsername}
              />
            </div>
            <div className="space-y-1">
              <InfoRow 
                icon={User} 
                label="Owner" 
                value={loan.ownerUsername}
              />
            </div>
          </div>
        </div>

        {/* Copy Information */}
        <div>
          <SectionTitle>Copy Information</SectionTitle>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <InfoRow 
              icon={Hash} 
              label="Copy ID" 
              value={`#${loan.copyId}`}
            />
            <InfoRow 
              icon={FileText} 
              label="Condition" 
              value={loan.copyCondition}
            />
            {loan.copyNotes && (
              <div className="pt-2 border-t">
                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-lavender-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-700">Copy Notes:</span>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {loan.copyNotes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Return Notes */}
        {(loan.borrowerReturnNotes || loan.lenderReturnNotes) && (
          <div>
            <SectionTitle>Return Notes</SectionTitle>
            <div className="space-y-3">
              {loan.borrowerReturnNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Borrower Notes:
                  </h4>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {loan.borrowerReturnNotes}
                  </p>
                </div>
              )}
              {loan.lenderReturnNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">
                    Lender Notes:
                  </h4>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">
                    {loan.lenderReturnNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}