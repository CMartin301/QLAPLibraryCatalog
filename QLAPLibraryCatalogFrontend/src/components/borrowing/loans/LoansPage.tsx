// src/components/borrowing/BorrowingDashboard.tsx
import React, { useEffect } from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import useAuth from '../../../hooks/useAuth';
import { useLoans } from '../../../hooks/useLoans';
import LentLoansTable from './lentLoans/LentLoansTable';
import BorrowedLoansTable from './borrowedLoans/BorrowedLoansTable';

const LoansPage: React.FC = () => {
  const { userID } = useAuth();

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
            Loans
          </h1>
          <p className="text-muted">Manage your loans</p>
        </div>
      </div>
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
                    Borrowed Loans
                  </Tab>
                  <Tab className={({ selected }) =>
                    `ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Lent Loans
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
    </div>
  );
};

export default LoansPage;