// src/pages/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import MediaTable from '../media/MediaTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';
import { BorrowRequestsTable } from '../borrowing/BorrowRequestsTable';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { borrowRequestService } from '../../services/borrowRequestService';


const MyLibraryPage: React.FC = () => {
  const { username, userID } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMedia, setUserMedia] = useState<Media[]>([]);
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'myCollection' | 'addToCollection' | 'borrowRequests' >('myCollection');
    const [borrowRequests, setBorrowRequests] = useState<BorrowRequestDto[]>([]);

  useEffect(() => {
    loadData();
    loadBorrowRequests();
  }, []);

const loadBorrowRequests = async () => {
    if (!userID) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let requests: BorrowRequestDto[];
      
        // Requests sent to this user (as lender)
        requests = await borrowRequestService.getBorrowRequestsForLender(userID);
      
      
      setBorrowRequests(requests);
    } catch (err: any) {
      setError('Failed to load borrow requests');
      console.error('Error loading borrow requests:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!userID) return;
      
      // Load both user's media and all available media
      const [userMediaResponse, allMediaResponse] = await Promise.all([
        mediaService.getUserMedia(userID, true),
        mediaService.getMedia(true)
      ]);
      
      setUserMedia(userMediaResponse);
      setAllMedia(allMediaResponse);
    } catch (err: any) {
      setError('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

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
                        onRefresh={loadData}
                        onSaveNewMedia={handleSaveMessage}
                        onSwitchToAddTab={handleSwitchToAddTab}
                        mode='myLibrary'
                      />
          ) : activeTab === 'addToCollection' ? (
            <MediaTable 
                        media={allMedia} 
                        onRefresh={loadData}
                        onSaveNewMedia={handleSaveMessage}
                        mode='addToCollection'
                      />
          ) : (
            <BorrowRequestsTable 
                        requests={borrowRequests}
                        userRole={'lender'}
                        onRefresh={loadBorrowRequests}
                      />
          )}

        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;