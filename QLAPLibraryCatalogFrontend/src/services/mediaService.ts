import { Media, GetMediaResponse, MediaSearchParams } from '../types/media';
import api from './apiService';

export const mediaService = {
//   // Get all media with optional filtering/pagination
//   async getMedia(params: MediaSearchParams = {}): Promise<GetMediaResponse> {
//     // Build query string from parameters
//     const queryParams = new URLSearchParams();
    
//     if (params.search) queryParams.append('search', params.search);
//     if (params.genre) queryParams.append('genre', params.genre);
//     if (params.mediaTypeId) queryParams.append('mediaTypeId', params.mediaTypeId.toString());
//     if (params.page) queryParams.append('page', params.page.toString());
//     if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

//     const queryString = queryParams.toString();
//     const url = queryString ? `/api/Media?${queryString}` : '/api/Media';
    
//     const response = await api.get<GetMediaResponse>(url);
//     return response.data;
//   },
  async getMedia(): Promise<GetMediaResponse> {    
    const response = await api.get<GetMediaResponse>('/api/Media');
    return response.data;
  },

  // Get a single media item by ID
  async getMediaById(mediaId: number): Promise<Media> {
    const response = await api.get<Media>(`/api/Media/${mediaId}`);
    return response.data;
  },

//   // Get media by genre
//   async getMediaByGenre(genre: string): Promise<Media[]> {
//     const response = await this.getMedia({ genre });
//     return response.data;
//   },

//   // Search media by title/creator
//   async searchMedia(searchTerm: string): Promise<Media[]> {
//     const response = await this.getMedia({ search: searchTerm });
//     return response.data;
//   }
};