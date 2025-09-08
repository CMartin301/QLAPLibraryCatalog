import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar, X } from 'lucide-react';
import { LoanWithDetails } from '../../types/loans';

interface ExtendLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanWithDetails | null;
  onExtend: (loanId: number, newDueDate: string) => Promise<void>;
  isLoading: boolean;
}

export function ExtendLoanModal({ isOpen, onClose, loan, onExtend, isLoading }: ExtendLoanModalProps) {
  const [newDueDate, setNewDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan || !newDueDate) return;

    // Validate new due date is in the future
    const selectedDate = new Date(newDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError('New due date must be in the future');
      return;
    }

    // Validate new due date is after current due date
    if (loan.dueDate && selectedDate <= new Date(loan.dueDate)) {
      setError('New due date must be after the current due date');
      return;
    }

    try {
      setError(null);
      await onExtend(loan.loanId, newDueDate);
      handleClose();
    } catch (err) {
      setError('Failed to extend loan. Please try again.');
    }
  };

  const handleClose = () => {
    setNewDueDate('');
    setError(null);
    onClose();
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Extend Loan
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loan && (
                  <>
                    {/* Loan Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-900">{loan.mediaTitle}</span>
                          <span className="text-sm text-gray-500 ml-2">({loan.mediaType})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Borrower:</strong> {loan.borrowerUsername}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Current Due Date:</strong> {formatDate(loan.dueDate)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Status:</strong> 
                          <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="newDueDate" className="block text-sm font-medium text-gray-700 mb-2">
                          New Due Date
                        </label>
                        <input
                          type="date"
                          id="newDueDate"
                          value={newDueDate}
                          onChange={(e) => setNewDueDate(e.target.value)}
                          min={getMinDate()}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !newDueDate}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {isLoading ? 'Extending...' : 'Extend Loan'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}