// types/userProfile.ts
import { TagDto } from './tags';

export interface UserProfile {
  userId: number;
  profileDescription: string | null;
  createdAt: string;
  updatedAt: string;
  username?: string | null;
  email?: string | null;
  userTags: TagDto[];
}

export interface UserWithProfile {
  userId: number;
  email: string;
  username?: string | null;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string | null;
  userPreferences?: any; // you can refine this with your existing UserPreferences type
  userProfile?: UserProfile;
  userTags: TagDto[];
}

export interface CreateOrUpdateUserProfile {
  profileDescription?: string | null;
}
