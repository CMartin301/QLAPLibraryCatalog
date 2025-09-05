// src/components/borrowing/BorrowingDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Book, Calendar, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { borrowRequestService } from '../../services/borrowRequestService';
import { BorrowRequestsTable } from './BorrowRequestsTable';

type StatusFilter = 'all' | 'pending' | 'approved' | 'denied' | 'cancelled';

const BorrowingDashboard: React.FC = () => {
  const { username, userID } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequestDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    loadBorrowRequests();
  }, [userID, activeTab]);

  const loadBorrowRequests = async () => {
    if (!userID) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let requests: BorrowRequestDto[];
      
      if (activeTab === 'sent') {
        // Requests this user has made (as borrower)
        requests = await borrowRequestService.getBorrowRequestsForBorrower(userID);
      } else {
        // Requests sent to this user (as lender)
        requests = await borrowRequestService.getBorrowRequestsForLender(userID);
      }
      
      setBorrowRequests(requests);
    } catch (err: any) {
      setError('Failed to load borrow requests');
      console.error('Error loading borrow requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter requests by status
  const filteredRequests = borrowRequests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  // Calculate statistics for dashboard cards
  const stats = {
    total: borrowRequests.length,
    pending: borrowRequests.filter(r => r.status === 'pending').length,
    approved: borrowRequests.filter(r => r.status === 'approved').length,
    denied: borrowRequests.filter(r => r.status === 'denied').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Book className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'approved':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'denied':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4 bg-pattern min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-500"></div>
            <p className="mt-4 text-gray-600">Loading your borrowing activity...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div>
            <div>
              <h1 className="text-3xl font-bold text-lavender-600 mb-2">
                Borrowing Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your book borrowing requests and lending approvals
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-colors ${
                statusFilter === 'all' ? 'bg-lavender-50 border-lavender-300' : 'hover:bg-gray-50'
            }`}
            onClick={() => setStatusFilter('all')}
            >
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Book className="w-8 h-8 text-lavender-500" />
            </div>
            </div>

          <div 
            className={`rounded-lg shadow-sm border p-6 cursor-pointer transition-colors ${
              statusFilter === 'pending' ? 'bg-yellow-100 border-yellow-300' : getStatusColor('pending')
            }`}
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div 
            className={`rounded-lg shadow-sm border p-6 cursor-pointer transition-colors ${
              statusFilter === 'approved' ? 'bg-green-100 border-green-300' : getStatusColor('approved')
            }`}
            onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div 
            className={`rounded-lg shadow-sm border p-6 cursor-pointer transition-colors ${
              statusFilter === 'denied' ? 'bg-red-100 border-red-300' : getStatusColor('denied')
            }`}
            onClick={() => setStatusFilter(statusFilter === 'denied' ? 'all' : 'denied')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Denied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.denied}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div> */}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sent'
                    ? 'border-lavender-500 text-lavender-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Requests I've Made</span>
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {activeTab === 'sent' ? borrowRequests.length : 0}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('received')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'received'
                    ? 'border-lavender-500 text-lavender-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Requests to Me</span>
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {activeTab === 'received' ? borrowRequests.length : 0}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <BorrowRequestsTable 
            requests={filteredRequests}
            userRole={activeTab === 'sent' ? 'borrower' : 'lender'}
            onRefresh={loadBorrowRequests}
          />
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'sent' ? 'No requests sent yet' : 'No requests received yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {activeTab === 'sent' 
                ? 'Start browsing the network catalog to request books from other users.'
                : 'Other users will see your books in the network catalog and can request to borrow them.'
              }
            </p>
            {activeTab === 'sent' && (
              <button 
                onClick={() => window.location.href = '/network-catalog'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lavender-600 hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500"
              >
                <Book className="w-4 h-4 mr-2" />
                Browse Books
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingDashboard;