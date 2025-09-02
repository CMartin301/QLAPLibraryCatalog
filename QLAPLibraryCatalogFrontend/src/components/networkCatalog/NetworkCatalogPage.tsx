import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import BookTable from '../books/BookTable';
import { Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';

const NetworkCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mediaService.getMedia();
      console.log(response.data);
      setMedia(response.data);
    } catch (err: any) {
      setError('Failed to load media');
    } finally {
      setIsLoading(false);
    }
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
        {/* <BookTable /> */}


      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.mediaId} className="border rounded p-4">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-gray-600">{item.creator}</p>
            <p className="text-sm text-gray-500">{item.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkCatalogPage;