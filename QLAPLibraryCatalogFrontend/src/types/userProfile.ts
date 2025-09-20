// types/userProfile.ts
import { TagDto } from './tags';


// Update existing interfaces
export interface UserProfile {
  userId: number;
  profileDescription: string | null;
  createdAt: string;
  updatedAt: string;
  username?: string | null;
  email?: string | null;
  userTags: TagDto[];
  userPronouns: UserPronoun[]; // Add this line
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

// Add these new interfaces
export interface UserPronoun {
  pronounId: number;
  pronounText: string;
  displayOrder: number;
}

export interface PronounSet {
  pronounId: number;
  pronounText: string;
  displayOrder: number;
  isCommon: boolean;
}

export interface UpdateUserPronouns {
  pronouns: UserPronoun[];
}

export interface CreatePronounSet {
  pronounText: string;
}


// Update the extended interface in your component as well
export interface ExtendedUserProfile extends UserProfile {
  email?: string;
  pronouns?: string; // Keep for backward compatibility, but we'll derive this from userPronouns
  location?: string;
  joinedDate?: string;
  mediaItemCount?: number;
  loanCount?: number;
  reviewCount?: number;
  averageRating?: number;
  isOwnProfile?: boolean;
}