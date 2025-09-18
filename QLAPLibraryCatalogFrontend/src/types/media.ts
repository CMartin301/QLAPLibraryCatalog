import { TagDto } from "./tags";

// Types for Media objects
export interface MediaType {
  mediaTypeId: number;
  name: string;
  displayName: string;
  description: string;
}


// Location-related interfaces
export interface LocationInfo {
  zoneId: number;
  zoneName: string;
  distance: number;
  availableCopiesCount: number;
}


export interface MediaDto {
  mediaId: number;
  mediaTypeId: number;
  mediaTypeName?: string;
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
  totalCopiesCount: number | null;
  availableCopiesCount: number | null;

  // New location-related properties
  nearbyLocations?: LocationInfo[];
  nearestCopyDistance?: number;
  nearestCopyLocationName?: string;


  tags?: TagDto[];
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
export interface MediaCopyDto {
  copyId: number;
  condition: string;
  isAvailable: boolean;
  notes?: string;
  currentLocationZoneName?: string;
  homeLocationZoneName?: string;
  
  // Media fields (following your existing pattern)
  mediaTitle: string;
  mediaCreator?: string;
  
  // Owner fields (following your BorrowRequestDto pattern)
  ownerUsername: string;
  ownerUserId: number;
}

export interface UserMediaCopyDto {
  mediaId: number;
  mediaTypeId: number;
  mediaTypeName?: string;
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


  copyId: number;
  condition: string;
  isAvailable: boolean;
  notes?: string;
  currentLocationZoneName?: string;
  homeLocationZoneName?: string;
}
export interface CreateMediaCopyRequest {
  userId: number;
  mediaId: number;
  condition: string;
  homeLocationZoneId?: number;
  notes?: string;
}
