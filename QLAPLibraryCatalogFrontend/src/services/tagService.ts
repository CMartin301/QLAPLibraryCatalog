import { CreateTagRequest, TagDto } from '../types/tags';
import api from './apiService';

export const tagService = {
  async getTags(): Promise<TagDto[]> {    
    const response = await api.get<TagDto[]>(`/api/Tag`);
    return response.data;
  },
  async getTagById(tagId: number): Promise<TagDto> {
    const response = await api.get<TagDto>(`/api/Tag/${tagId}`);
    return response.data;
  },
  async createNewTag(newTag: CreateTagRequest): Promise<TagDto> {
    const response = await api.post<TagDto>('/api/Tag', newTag);
    return response.data;
  },
 
};