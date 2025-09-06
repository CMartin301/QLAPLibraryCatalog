// src/components/borrowing/BorrowingDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, User, Book, ArrowLeftRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { Loan } from '../../types/loans';
import { borrowRequestService } from '../../services/borrowRequestService';
import { loanService } from '../../services/loanService';
import { BorrowRequestsTable } from './BorrowRequestsTable';
import LoansTable from './LoansTable';
import { useLoans } from '../../hooks/useLoans';
import { useBorrowRequests } from '../../hooks/useBorrowRequests';

type MainTab = 'requests' | 'loans';
type RequestTab = 'sent' | 'received';
type LoanTab = 'borrowed' | 'lent';

const BorrowingDashboard: React.FC = () => {
  const { userID } = useAuth();

  const [mainTab, setMainTab] = useState<MainTab>('requests');

  // --- Borrow Requests ---
  const [requestTab, setRequestTab] = useState<RequestTab>('sent');
  const { requests: borrowRequests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useBorrowRequests(userID, requestTab);

  // --- Loans ---
  const [loanTab, setLoanTab] = useState<LoanTab>('borrowed');
  const { loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans(userID, loanTab);
  // const [loans, setLoans] = useState<Loan[]>([]);
  // const [loansLoading, setLoansLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;
  }, [mainTab, requestTab, loanTab, userID]);


  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lavender-600 mb-2">
            Borrowing Dashboard
          </h1>
          <p className="text-gray-600">Manage your requests and loans</p>
        </div>

        {/* Main Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setMainTab('requests')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                mainTab === 'requests'
                  ? 'border-lavender-500 text-lavender-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Borrow Requests
            </button>
            <button
              onClick={() => setMainTab('loans')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                mainTab === 'loans'
                  ? 'border-lavender-500 text-lavender-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 inline mr-1" />
              Loans
            </button>
          </nav>
        </div>

        {/* Requests Section */}
        {mainTab === 'requests' && (
          <div>
            {/* Subtabs */}
            <div className="mb-4">
              <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1">
                <button
                  onClick={() => setRequestTab('sent')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    requestTab === 'sent'
                      ? 'bg-white text-lavender-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                Requests I've Made
                </button>
                <button
                  onClick={() => setRequestTab('received')}
                  className={`ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    requestTab === 'received'
                      ? 'bg-white text-lavender-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                Requests for My Media
                </button>
              </div>
            </div>

            {/* Subtabs for Requests */}
            {/* <div className="mb-4 flex gap-4">
              <button
                onClick={() => setRequestTab('sent')}
                className={`px-4 py-2 rounded ${
                  requestTab === 'sent' ? 'bg-lavender-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Requests I've Made
              </button>
              <button
                onClick={() => setRequestTab('received')}
                className={`px-4 py-2 rounded ${
                  requestTab === 'received' ? 'bg-lavender-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Requests for My Media
              </button>
            </div> */}

            {/* Requests Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <BorrowRequestsTable
                requests={borrowRequests}
                userRole={requestTab === 'sent' ? 'borrower' : 'lender'}  
                onRefresh={refetchRequests}
                loading={requestsLoading}
                error={requestsError}
              />
            </div>
          </div>
        )}

        {/* Loans Section */}
        {mainTab === 'loans' && (
          <div>
            {/* Subtabs */}
            <div className="mb-4">
              <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1">
                <button
                  onClick={() => setLoanTab('borrowed')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    loanTab === 'borrowed'
                      ? 'bg-white text-lavender-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Loans I Borrowed
                </button>
                <button
                  onClick={() => setLoanTab('lent')}
                  className={`ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    loanTab === 'lent'
                      ? 'bg-white text-lavender-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Loans of My Media
                </button>
              </div>
            </div>


            {/* Loans Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <LoansTable loans={loans} onRefresh={refetchLoans} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingDashboard;
