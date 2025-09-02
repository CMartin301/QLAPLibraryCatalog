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