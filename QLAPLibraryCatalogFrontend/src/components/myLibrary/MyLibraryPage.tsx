// src/pages/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useMedia } from '../../hooks/useMedia';
import { UserMediaTable } from '../media/userMediaTable/UserMediaTable';


const MyLibraryPage: React.FC = () => {
  const { username, userID } = useAuth();
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);

   const { 
    media: userMedia, 
    loading: userMediaLoading, 
    error: userMediaError, 
    refetch: refetchUserMedia 
  } = useMedia(userID, true);


  useEffect(() => {
  }, []);

  const handleSaveMessage = (message: string) => {
    setSaveMessage(message);
    // Auto-hide message after 3 seconds
    setTimeout(() => setSaveMessage(undefined), 3000);
  };

  if (userMediaLoading) {
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

  // const handleSwitchToAddTab = () => {
  //   setActiveTab('addToCollection');
  // };

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
                onClick={() => setSaveMessage(undefined)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
            <UserMediaTable 
              media={userMedia} 
              onRefresh={refetchUserMedia}
              onSaveMessage={handleSaveMessage}
              loading={userMediaLoading}
              error={userMediaError}
            />
         
        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;