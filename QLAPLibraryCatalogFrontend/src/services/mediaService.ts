import { Media, CreateMediaRequest, MediaType, CreateMediaCopyRequest, MediaCopy } from '../types/media';
import api from './apiService';

export const mediaService = {
  async getMedia(includeCopies: boolean = false): Promise<Media[]> {    
    const response = await api.get<Media[]>(`/api/Media?includeCopies=${includeCopies}`);
    console.log(response.data);
    return response.data;
  },

  // Get a single media item by ID
  async getMediaById(mediaId: number, includeCopies: boolean = false): Promise<Media> {
    const response = await api.get<Media>(`/api/Media/${mediaId}?includeCopies=${includeCopies}`);
    return response.data;
  },
  
  async createNewMedia(newMedia: CreateMediaRequest): Promise<Media> {
    const response = await api.post<Media>('/api/Media', newMedia);
    return response.data;
  },
  
  async getUserMedia(userId: number, includeCopies: boolean = false): Promise<Media[]> {    
    const response = await api.get<Media[]>(`/api/Media/User/${userId}?includeCopies=${includeCopies}`);
    console.log(response.data);
    return response.data;
  },
  async createNewMediaCopy(newMediaCopy: CreateMediaCopyRequest): Promise<MediaCopy> {
    const response = await api.post<MediaCopy>('/api/MediaCopy', newMediaCopy);
    return response.data;
  },

  async getMediaTypes(): Promise<MediaType[]> {    
    const response = await api.get<MediaType[]>('/api/MediaTypes');
    return response.data;
  },
};