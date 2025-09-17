// types/dashboard.ts - Updated types to match your component needs

export interface DashboardStats {
  totalBooks: number;
  activeLoans: number;
  pendingRequests: number;
  overdueItems: number;
}

export interface RecentActivityDto {
  mediaTitle: string;
  activityType: string; 
  activityDate: string;
}
export interface RecentActivityItem {
  type: "loan" | "return" | "request";
  date: string; // ISO date string
  description: string;
}

export interface UpcomingDueDateItem {
  loanId: number;
  mediaTitle: string;
  dueDate: string; // ISO date string
  daysUntilDue?: number; // Should be calculated on the backend
}