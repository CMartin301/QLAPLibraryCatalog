import React, { useState, useEffect } from 'react';
import { MediaDto } from '../../types/media';
import { MediaSearchParams, mediaService } from '../../services/mediaService';
import { NetworkMediaTable } from '../media/networkMediaTable/NetworkMediaTable';
import { LocationZoneDto } from '../../types/locations';
import { LocationFilters, LocationParams } from '../shared/filters/LocationFilters';
import { locationService } from '../../services/locationService';

const NetworkCatalogPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [locationZones, setLocationZones] = useState<LocationZoneDto[]>([]);
  
  // Filter state
  const [locationParams, setLocationParams] = useState<LocationParams>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  
    const loadLocationZones = async () => {
      try {
        const zones = await locationService.getLocationZones();
        setLocationZones(zones);
      } catch (err) {
        console.error('Error loading location zones:', err);
        // Don't set error state for location zones - it's not critical
      }
    };
  // Load location zones on mount
  useEffect(() => {
    
    loadLocationZones();
  }, [locationParams, searchTerm]);

  useEffect(() => {
    loadMedia();
  }, [locationParams, searchTerm]);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchParams: MediaSearchParams = {
        includeCopies: false,
        ...(searchTerm && { search: searchTerm }),
        ...(locationParams.userLocationZoneId && { 
          userLocationZoneId: locationParams.userLocationZoneId 
        }),
        ...(locationParams.maxDistanceMiles && { 
          maxDistanceMiles: locationParams.maxDistanceMiles 
        }),
      };

      const response = await mediaService.getMedia(searchParams);

      setMedia(response);
    } catch (err: any) {
      setError('Failed to load media');
      console.error('Error loading media:', err);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle location filter changes
  const handleLocationChange = (newLocationParams: LocationParams) => {
    setLocationParams(newLocationParams);
  };

  // Handle search changes (you can wire this up to a search input if needed)
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
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

            {/* Location Filters
      <LocationFilters
        locationZones={locationZones}
        currentLocation={locationParams}
        onChange={handleLocationChange}
        className="mb-6"
      /> */}

<NetworkMediaTable 
  media={media} 
  onRefresh={loadMedia}
  mode='catalog'
  loading={isLoading}
  error={error}
  locationZones={locationZones}
/>

    </div>
  );
};

export default NetworkCatalogPage;