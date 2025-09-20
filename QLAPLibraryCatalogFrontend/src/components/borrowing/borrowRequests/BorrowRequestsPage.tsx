// src/components/borrowing/BorrowingDashboard.tsx
import React, { useEffect } from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import useAuth from '../../../hooks/useAuth';
import { useBorrowRequests } from '../../../hooks/useBorrowRequests';
import SentBorrowRequestsTable from './sentBorrowRequests/SentBorrowRequestsTable';
import ReceivedBorrowRequestsTable from './receivedBorrowRequests/ReceivedBorrowRequestsTable';

const BorrowRequestsPage: React.FC = () => {
  const { userID } = useAuth();

  // --- Borrow Requests ---
  const { requests: sentRequests, loading: sentLoading, error: sentError, refetch: refetchSent } = useBorrowRequests(userID, 'sent');
  const { requests: receivedRequests, loading: receivedLoading, error: receivedError, refetch: refetchReceived } = useBorrowRequests(userID, 'received');


  useEffect(() => {
    if (!userID) return;
  }, [userID]);

  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
            Borrow Requests
          </h1>
          <p className="text-muted">Manage your borrow requests</p>
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
                    Sent Requests
                  </Tab>
                  <Tab className={({ selected }) =>
                    `ml-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selected
                        ? 'bg-white text-lavender-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`
                  }>
                    Recieved Requests
                  </Tab>
                </div>
              </TabList>

              <TabPanels>
                {/* Sent Requests */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
                    <SentBorrowRequestsTable
                      requests={sentRequests}
                      onRefresh={refetchSent}
                      loading={sentLoading}
                      error={sentError}
                    />
                  </div>
                </TabPanel>

                {/* Received Requests */}
                <TabPanel>
                  <div className="bg-white rounded-lg shadow-sm">
                    <ReceivedBorrowRequestsTable
                      requests={receivedRequests}
                      onRefresh={refetchReceived}
                      loading={receivedLoading}
                      error={receivedError}
                    />
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
    </div>
  );
};

export default BorrowRequestsPage;