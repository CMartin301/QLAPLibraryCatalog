// src/pages/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import MediaTable from '../media/MediaTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';

const MyLibraryPage: React.FC = () => {
  const { username, userID } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMedia, setUserMedia] = useState<Media[]>([]);
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'myCollection' | 'addToCollection'>('myCollection');

  useEffect(() => {
    loadData();
  }, []);

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
          ) : (
            <MediaTable 
              media={allMedia} 
              onRefresh={loadData}
              onSaveNewMedia={handleSaveMessage}
              mode='addToCollection'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;