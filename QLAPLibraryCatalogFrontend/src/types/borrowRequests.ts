import { MediaCopy, Media } from './media';

export interface BorrowRequestDto {
  requestId: number;
  borrowerId: number;
  copyId: number;
  status?: string;
  message?: string;
  requestedStartDate?: string; // DateOnly as string
  requestedEndDate?: string;   // DateOnly as string
  approvedAt?: string;         // DateTime as ISO string
  deniedAt?: string;           // DateTime as ISO string
  denialReason?: string;
  createdAt?: string;          // DateTime as ISO string
  updatedAt?: string;          // DateTime as ISO string
  copy?: MediaCopy;
  media?: Media;
}

export interface CreateBorrowRequestDto {
  borrowerId: number;
  copyId: number;
  message?: string;
  requestedStartDate?: string; // DateOnly as string (YYYY-MM-DD)
  requestedEndDate?: string;   // DateOnly as string (YYYY-MM-DD)
}