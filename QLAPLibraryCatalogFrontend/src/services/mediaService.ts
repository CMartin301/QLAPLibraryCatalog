import { Media, CreateMediaRequest, MediaType } from '../types/media';
import api from './apiService';

export const mediaService = {
  async getMedia(): Promise<Media[]> {    
    const response = await api.get<Media[]>('/api/Media');
    console.log(response.data);
    return response.data;
  },

  // Get a single media item by ID
  async getMediaById(mediaId: number): Promise<Media> {
    const response = await api.get<Media>(`/api/Media/${mediaId}`);
    return response.data;
  },
  
  async createNewMedia(newMedia: CreateMediaRequest): Promise<Media> {
    const response = await api.post<Media>('/api/Media', newMedia);
    return response.data;
  },

  async getMediaTypes(): Promise<MediaType[]> {    
    const response = await api.get<MediaType[]>('/api/MediaTypes');
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