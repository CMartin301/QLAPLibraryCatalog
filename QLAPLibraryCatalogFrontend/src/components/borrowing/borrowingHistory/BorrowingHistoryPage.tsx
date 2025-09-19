// src/components/borrowing/BorrowingDashboard.tsx
import React, { useEffect } from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import useAuth from '../../../hooks/useAuth';
import { useLoans } from '../../../hooks/useLoans';
import BorrowedLoansTable from '../loans/borrowedLoans/BorrowedLoansTable';
import LentLoansTable from '../loans/lentLoans/LentLoansTable';
import HistoricalLoansTable from './historicalLoans/HistoricalLoansTable';

const BorrowingHistoryPage: React.FC = () => {
  const { userID } = useAuth();

  // --- Loans ---
//   const { loans: borrowedLoans, loading: borrowedLoading, error: borrowedError, refetch: refetchBorrowed } = useLoans(userID, 'borrowed');
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
            Borrowing History
          </h1>
          <p className="text-muted">Review loans that have been returned</p>
        </div>
      </div>
      
      <HistoricalLoansTable 
                    loans={lentLoans} 
                    onRefresh={refetchLent}
                    loading={lentLoading}
                    error={lentError}
                    />
    </div>
  );
};

export default BorrowingHistoryPage;