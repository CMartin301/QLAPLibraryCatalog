import { Media, CreateMediaRequest, MediaType, CreateMediaCopyRequest, MediaCopy, MediaCopyDto, MediaDto } from '../types/media';
import api from './apiService';

export const mediaService = {
  async getMedia(): Promise<MediaDto[]> {    
    const response = await api.get<MediaDto[]>(`/api/Media`);
    return response.data;
  },

  async getMediaById(mediaId: number): Promise<MediaDto> {
    const response = await api.get<MediaDto>(`/api/Media/${mediaId}`);
    return response.data;
  },
  
  async createNewMedia(newMedia: CreateMediaRequest): Promise<Media> {
    const response = await api.post<Media>('/api/Media', newMedia);
    return response.data;
  },
  
  async getUserMedia(userId: number): Promise<MediaDto[]> {    
    const response = await api.get<MediaDto[]>(`/api/Media/User/${userId}`);
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
  async getMediaCopiesByMediaID(mediaId: number): Promise<MediaCopyDto[]> {    
    const response = await api.get<MediaCopyDto[]>(`/api/MediaCopy/Media/${mediaId}`);
    return response.data;
  },
};