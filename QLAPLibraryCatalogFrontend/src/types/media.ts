// Types for Media objects
export interface MediaType {
  mediaTypeId: number;
  name: string;
  displayName: string;
  description: string;
}

export interface Media {
  mediaId: number;
  mediaTypeId: number;
  title: string;
  subtitle: string | null;
  creator: string;
  publisher: string;
  publicationDate: string;
  language: string;
  genre: string;
  description: string;
  coverImageUrl: string;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  issueNumber: number | null;
  volume: number | null;
  mediaType: MediaType;
  copies?: MediaCopy[];
}

export interface CreateMediaRequest {
  mediaTypeId: number;
  title: string;
  subtitle?: string | null;
  creator: string;
  publisher?: string | null;
  publicationDate?: string | null;
  language?: string | null;
  genre?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  isbn10?: string | null;
  isbn13?: string | null;
  pageCount?: number | null;
  issueNumber?: string | null; 
  volume?: string | null; 
}

export interface MediaFormData {
  mediaTypeId: number;
  title: string;
  subtitle?: string | null;
  creator: string;
  publisher?: string | null;
  publicationDate?: string | null;
  language?: string | null;
  genre?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  isbn10?: string | null;
  isbn13?: string | null;
  pageCount?: number | null;
  issueNumber?: number | null;
  volume?: number | null;
}

// Media Copies
export interface MediaCopy {
  copyId: number;
  mediaId: number;
  condition: string;
  maxLoanDays: number;
  requiresApproval: boolean;
  isAvailable: boolean;
  notes?: string;
}
export interface MediaCopyDisplay {
  copyId: number;
  condition: string;
  maxLoanDays: number;
  requiresApproval: boolean;
  isAvailable: boolean;
  notes?: string;
  
  // Media fields (following your existing pattern)
  mediaTitle: string;
  mediaCreator?: string;
  
  // Owner fields (following your BorrowRequestDto pattern)
  ownerUsername: string;
  ownerUserId: number;
}

export interface CreateMediaCopyRequest {
  userId: number;
  mediaId: number;
  condition: string;
  maxLoanDays: number;
  requiresApproval: boolean;
  notes?: string;
}
