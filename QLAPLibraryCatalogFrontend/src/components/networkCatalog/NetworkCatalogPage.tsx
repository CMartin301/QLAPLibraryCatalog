import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import MediaTable from '../media/MediaTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';

const NetworkCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Media[]>([]);

    const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mediaService.getMedia(true);
      // console.log(response.data);
      setMedia(response);
    } catch (err: any) {
      setError('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this handler function:
  const handleSaveNewMedia = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  
  return (
    <div className="container-fluid py-4 bg-pattern">
        {/* Page Header */}
        <div className="row mb-4">
            <div className="col">
                <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
                    Browse the Network Catalog
                </h1>
            </div>
        </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 mb-4 rounded-lg border ${
          saveMessage.includes('Failed') 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {saveMessage}
        </div>
      )}
        <MediaTable 
          media={media} 
          onRefresh={loadMedia}
          onSaveNewMedia={handleSaveNewMedia}
        />

    </div>
  );
};

export default NetworkCatalogPage;