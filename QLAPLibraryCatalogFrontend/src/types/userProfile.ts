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
  mediaItemCount?: number;
  loanCount?: number;
  isOwnProfile?: boolean;
  userTags: TagDto[];
  userPronouns: UserPronoun[]; 
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

