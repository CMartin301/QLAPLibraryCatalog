// src/pages/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import MediaTable from '../media/MediaTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';
import { BorrowRequestsTable } from '../borrowing/borrowRequests/BorrowRequestsTable';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { borrowRequestService } from '../../services/borrowRequestService';
import { useBorrowRequests } from '../../hooks/useBorrowRequests';
import { useMedia } from '../../hooks/useMedia';


const MyLibraryPage: React.FC = () => {
  const { username, userID } = useAuth();
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'myCollection' | 'addToCollection' | 'borrowRequests' >('myCollection');
   const { 
    media: userMedia, 
    loading: userMediaLoading, 
    error: userMediaError, 
    refetch: refetchUserMedia 
  } = useMedia(userID, true);

  const { 
    media: allMedia, 
    loading: allMediaLoading, 
    error: allMediaError, 
    refetch: refetchAllMedia 
  } = useMedia(null, true);
  const { 
    requests: borrowRequests, 
    loading: requestsLoading, 
    error: requestsError, 
    refetch: refetchBorrowRequests 
  } = useBorrowRequests(userID, 'received');
const isLoading = userMediaLoading || allMediaLoading;
const error = userMediaError || allMediaError;

const handleRefresh = () => {
  refetchUserMedia();
  refetchAllMedia();
};

  useEffect(() => {
  }, []);

  const handleSaveMessage = (message: string) => {
    setSaveMessage(message);
    // Auto-hide message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4 bg-pattern">
        <div className="text-center">
          <div className="spinner-border text-lavender-500" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSwitchToAddTab = () => {
    setActiveTab('addToCollection');
  };

  return (
    <div className="container-fluid py-4 bg-pattern">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
            {username}'s Library
          </h1>
          <p className="text-muted">Manage your library collection</p>
        </div>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="row mb-4">
          <div className="col">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {saveMessage}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSaveMessage(null)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="row mb-4">
        <div className="col">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'myCollection'
                  ? 'border-lavender-500 text-lavender-600 bg-lavender-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'myCollection'}
              onClick={() => setActiveTab('myCollection')}
            >
              My Collection ({userMedia.length})
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'addToCollection'
                  ? 'border-lavender-500 text-lavender-600 bg-lavender-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'addToCollection'}
              onClick={() => setActiveTab('addToCollection')}
            >
              Add to Collection
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'borrowRequests'
                  ? 'border-lavender-500 text-lavender-600 bg-lavender-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'borrowRequests'}
              onClick={() => setActiveTab('borrowRequests')}
            >
              Borrow Requests
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col">
          {activeTab === 'myCollection' ? (
            <MediaTable 
              media={userMedia} 
              onRefresh={refetchUserMedia}
              onSaveNewMedia={handleSaveMessage}
              onSwitchToAddTab={handleSwitchToAddTab}
              mode='myLibrary'
              loading={userMediaLoading}
              error={userMediaError}
            />
          ) : activeTab === 'addToCollection' ? (
            <MediaTable 
              media={allMedia} 
              onRefresh={refetchAllMedia}
              onSaveNewMedia={handleSaveMessage}
              mode='addToCollection'
              loading={allMediaLoading}
              error={allMediaError}
            />
          ) : (
            <BorrowRequestsTable 
              requests={borrowRequests}
              userRole={'lender'}
              onRefresh={refetchBorrowRequests}
              error={requestsError}
              loading={requestsLoading}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;