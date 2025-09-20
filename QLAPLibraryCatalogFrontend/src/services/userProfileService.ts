// services/userProfileService.ts
import api from './apiService';
import { UserProfile, UserWithProfile, CreateOrUpdateUserProfile } from '../types/userProfile';
import { TagDto } from '../types/tags';

export const userProfileService = {
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/api/UserProfile');
    return response.data;
  },

  async getMyCompleteProfile(): Promise<UserWithProfile> {
    const response = await api.get<UserWithProfile>('/api/UserProfile/Complete');
    return response.data;
  },

  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/api/UserProfile/User/${userId}`);
    return response.data;
  },

  async getUserWithProfile(userId: number): Promise<UserWithProfile> {
    const response = await api.get<UserWithProfile>(`/api/UserProfile/User/${userId}/Complete`);
    return response.data;
  },

  async createOrUpdateMyProfile(profile: CreateOrUpdateUserProfile): Promise<UserProfile> {
    const response = await api.post<UserProfile>('/api/UserProfile', profile);
    return response.data;
  },

  async deleteMyProfile(): Promise<void> {
    await api.delete('/api/UserProfile');
  },

  async getMyTags(): Promise<TagDto[]> {
    const response = await api.get<TagDto[]>('/api/UserProfile/Tags');
    return response.data;
  },

  async addTagToMyProfile(tagId: number): Promise<void> {
    await api.post(`/api/UserProfile/Tags/${tagId}`);
  },

  async removeTagFromMyProfile(tagId: number): Promise<void> {
    await api.delete(`/api/UserProfile/Tags/${tagId}`);
  }
};
