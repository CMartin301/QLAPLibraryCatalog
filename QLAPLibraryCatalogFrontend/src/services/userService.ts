import { User } from '../types/auth';
import { Media, CreateMediaRequest } from '../types/media';
import { UserPreferences } from '../types/preferences';
import api from './apiService';

export const userService = {
  async getUser(userId: number): Promise<User> {    
    const response = await api.get<User>(`/api/Users/${userId}`);
    return response.data;
  },
 
  // Get user preferences from user endpoint
  async getUserPreferences(userId: number): Promise<UserPreferences> {    
    const user = await this.getUser(userId);
    return user.userPreferences;
  },

  // Update user preferences
  async updateUserPreferences(userId: number, preferences: UserPreferences): Promise<UserPreferences> {
    const response = await api.put<UserPreferences>(`/api/Users/${userId}/Preferences`, preferences);   
    // const response = await api.put<UserPreferences>(`/api/Users/${userId}/Preferences`, {
    //   defaultLoanDays: preferences.defaultLoanDays,
    //   autoApproveRequests: preferences.autoApproveRequests,
    //   emailNotifications: preferences.emailNotifications,
    //   smsNotifications: preferences.smsNotifications,
    //   notificationSettings: preferences.notificationSettings
    // });
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

};