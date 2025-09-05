
import { BorrowRequestDto, CreateBorrowRequestDto } from '../types/borrowRequests';
import api from './apiService';

export const borrowRequestService = {
  async getBorrowRequests(): Promise<BorrowRequestDto[]> {
    const response = await api.get<BorrowRequestDto[]>('/api/BorrowRequest');
    return response.data;
  },

  async getBorrowRequestById(requestId: number): Promise<BorrowRequestDto> {
    const response = await api.get<BorrowRequestDto>(`/api/BorrowRequest/${requestId}`);
    return response.data;
  },

  async createBorrowRequest(newRequest: CreateBorrowRequestDto): Promise<BorrowRequestDto> {
    const response = await api.post<BorrowRequestDto>('/api/BorrowRequest', newRequest);
    return response.data;
  },

  async denyBorrowRequest(requestId: number, reason?: string): Promise<BorrowRequestDto> {
    const response = await api.post<BorrowRequestDto>(`/api/BorrowRequest/${requestId}/Deny`, {
      reason
    });
    return response.data;
  },

  async cancelBorrowRequest(requestId: number, userId: number): Promise<void> {
    await api.post(`/api/BorrowRequest/${requestId}/Cancel?userId=${userId}`);
  }
};