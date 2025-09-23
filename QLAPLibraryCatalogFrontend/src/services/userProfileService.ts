// services/userProfileService.ts
import api from './apiService';
import { UserProfile, CreateOrUpdateUserProfile, CreatePronounSet, PronounSet, UpdateUserPronouns, UserPronoun } from '../types/userProfile';
import { TagDto } from '../types/tags';

export const userProfileService = {
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/api/UserProfile');
    return response.data;
  },

  // async getMyCompleteProfile(): Promise<UserProfile> {
  //   const response = await api.get<UserProfile>('/api/UserProfile/Complete');
  //   return response.data;
  // },

  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/api/UserProfile/User/${userId}`);
    return response.data;
  },

  async getUserWithProfile(userId: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/api/UserProfile/User/${userId}/Complete`);
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
  },
  // Add these new service methods
async getMyPronouns(): Promise<UserPronoun[]> {
  const response = await api.get<UserPronoun[]>('/api/UserProfile/Pronouns');
  return response.data;
},

async updateMyPronouns(pronouns: UpdateUserPronouns): Promise<void> {
  await api.put('/api/UserProfile/Pronouns', pronouns);
},

async getCommonPronouns(): Promise<PronounSet[]> {
  const response = await api.get<PronounSet[]>('/api/UserProfile/Pronouns/Common');
  return response.data;
},

async createCustomPronoun(pronoun: CreatePronounSet): Promise<PronounSet> {
  const response = await api.post<PronounSet>('/api/UserProfile/Pronouns/Custom', pronoun);
  return response.data;
}
};
