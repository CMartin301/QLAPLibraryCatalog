// src/pages/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useMedia } from '../../hooks/useMedia';
import { UserMediaTable } from '../media/userMediaTable/UserMediaTable';
import { mediaService } from '../../services/mediaService';
import { MediaCopyDto } from '../../types/media';


const MyLibraryPage: React.FC = () => {
  const { username, userID } = useAuth();
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
      const [userMedia, setUserMedia] = useState<MediaCopyDto[]>([]);

  //  const { 
  //   media: userMedia, 
  //   loading: userMediaLoading, 
  //   error: userMediaError, 
  //   refetch: refetchUserMedia 
  // } = useMedia(userID, true);


  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(undefined);
    
    try {

      const response = await mediaService.getUserMediaCopies();
      setUserMedia(response);
    } catch (err: any) {
      setError('Failed to load media');
      console.error('Error loading media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMessage = (message: string) => {
    setSaveMessage(message);
    // Auto-hide message after 3 seconds
    setTimeout(() => setSaveMessage(undefined), 3000);
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
              onRefresh={loadMedia}
              onSaveMessage={handleSaveMessage}
              loading={isLoading}
              error={error}
            />
         
        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;