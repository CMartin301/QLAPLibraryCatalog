// types/userProfile.ts
import { TagDto } from './tags';


// Update existing interfaces
export interface UserProfile {
  userId: number;
  email?: string | null;
  username?: string | null;
  profileDescription: string | null;
  createdAt: string;
  updatedAt: string;
  joinedDate?: string;
  mediaItemCount?: number;
  loanCount?: number;
  isOwnProfile?: boolean;
  userTags: TagDto[];
  userPronouns: UserPronoun[]; // Add this line
}


// export interface UserWithProfile {
//   userId: number;
//   email: string;
//   username?: string | null;
//   emailVerified?: boolean;
//   isActive?: boolean;
//   createdAt?: string | null;
//   userPreferences?: any; // you can refine this with your existing UserPreferences type
//   userProfile?: UserProfile;
//   userTags: TagDto[];
// }

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

