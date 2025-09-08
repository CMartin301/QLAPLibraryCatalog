// src/components/borrowing/BorrowingDashboard.tsx
import React, { useEffect } from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import useAuth from '../../hooks/useAuth';
import { BorrowRequestsTable } from './BorrowRequestsTable';
import LoansTable from './LoansTable';
import { useLoans } from '../../hooks/useLoans';
import { useBorrowRequests } from '../../hooks/useBorrowRequests';
import BorrowedLoansTable from './BorrowedLoansTable';
import LentLoansTable from './LentLoansTable';

const BorrowingDashboard: React.FC = () => {
  const { userID } = useAuth();

  // --- Borrow Requests ---
  const { requests: sentRequests, loading: sentLoading, error: sentError, refetch: refetchSent } = useBorrowRequests(userID, 'sent');
  const { requests: receivedRequests, loading: receivedLoading, error: receivedError, refetch: refetchReceived } = useBorrowRequests(userID, 'received');

  // --- Loans ---
  const { loans: borrowedLoans, loading: borrowedLoading, error: borrowedError, refetch: refetchBorrowed } = useLoans(userID, 'borrowed');
  const { loans: lentLoans, loading: lentLoading, error: lentError, refetch: refetchLent } = useLoans(userID, 'lent');

  useEffect(() => {
    if (!userID) return;
  }, [userID]);

  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
            Borrowing Dashboard
          </h1>
          <p className="text-muted">Manage your requests and loans</p>
        </div>
      </div>

      {/* Main Tabs with Headless UI */}
      <TabGroup>
        <TabList className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <Tab className={({ selected }) => 
              `py-3 px-1 border-b-2 font-medium text-sm ${
                selected
                  ? 'border-lavender-500 text-lavender-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }>
              <Calendar className="w-4 h-4 inline mr-1" />
              Borrow Requests
            </Tab>
            <Tab className={({ selected }) => 
              `py-3 px-1 border-b-2 font-medium text-sm ${
                selected
                  ? 'border-lavender-500 text-lavender-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }>
              <ArrowLeftRight className="w-4 h-4 inline mr-1" />
              Loans
            </Tab>
          </nav>
        </TabList>

        <TabPanels>
          {/* Requests Panel */}
          <TabPanel>
            <TabGroup>
              <TabList className="mb-4">
                <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1">
                  <Tab className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Requests I've Made
                  </Tab>
                  <Tab className={({ selected }) =>
                    `ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Requests for My Media
                  </Tab>
                </div>
              </TabList>

              <TabPanels>
                {/* Sent Requests */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
                    <BorrowRequestsTable
                      requests={sentRequests}
                      userRole="borrower"
                      onRefresh={refetchSent}
                      loading={sentLoading}
                      error={sentError}
                    />
                  </div>
                </TabPanel>

                {/* Received Requests */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
                    <BorrowRequestsTable
                      requests={receivedRequests}
                      userRole="lender"
                      onRefresh={refetchReceived}
                      loading={receivedLoading}
                      error={receivedError}
                    />
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </TabPanel>

          {/* Loans Panel */}
          <TabPanel>
            <TabGroup>
              <TabList className="mb-4">
                <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1">
                  <Tab className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Loans I Borrowed
                  </Tab>
                  <Tab className={({ selected }) =>
                    `ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Loans of My Media
                  </Tab>
                </div>
              </TabList>

              <TabPanels>
                {/* Borrowed Loans */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
    <BorrowedLoansTable 
      loans={borrowedLoans} 
      onRefresh={refetchBorrowed}
      loading={borrowedLoading}
      error={borrowedError}
    />
                  </div>
                </TabPanel>

                {/* Lent Loans */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
    <LentLoansTable 
      loans={lentLoans} 
      onRefresh={refetchLent}
      loading={lentLoading}
      error={lentError}
    />
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default BorrowingDashboard;