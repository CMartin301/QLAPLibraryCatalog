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
}

export interface CreateMediaRequest {
  mediaTypeId: number;
  title: string;
  subtitle: string | null;
  creator: string;
}
// export interface CreateMediaRequest {
//   mediaTypeId: number;
//   title: string;
//   subtitle: string | null;
//   creator: string | null;
//   publisher: string | null;
//   publicationDate: string | null;
//   language: string | null;
//   genre: string | null;
//   description: string | null;
//   coverImageUrl: string | null;
//   isbn10: string | null;
//   isbn13: string | null;
//   pageCount: number | null;
//   issueNumber: number | null;
//   volume: number | null;
// }

export interface MediaFormData {
  mediaTypeId: number;
  title: string;
  subtitle: string | null;
  creator: string;
  publisher?: string;
  publicationDate?: string;
  language?: string;
  genre?: string;
  description?: string;
  coverImageUrl?: string;
  isbn10?: string | null;
  isbn13?: string | null;
  pageCount?: number | null;
  issueNumber?: number | null;
  volume?: number | null;
}

// API request/response types
// export interface GetMediaResponse {
//   data: Media[];
//   total: number;
//   page: number;
//   pageSize: number;
// }
export interface GetMediaResponse {
  data: Media[];
}

export interface MediaSearchParams {
  search?: string;
  genre?: string;
  mediaTypeId?: number;
  page?: number;
  pageSize?: number;
}