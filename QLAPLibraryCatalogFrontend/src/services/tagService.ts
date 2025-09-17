import { User } from '../types/auth';
import { Media, CreateMediaRequest } from '../types/media';
import { UserPreferences } from '../types/preferences';
import { TagDto } from '../types/tags';
import api from './apiService';

export const tagService = {
  async getTags(): Promise<TagDto[]> {    
    const response = await api.get<TagDto[]>(`/api/Tag`);
    return response.data;
  },
 
};