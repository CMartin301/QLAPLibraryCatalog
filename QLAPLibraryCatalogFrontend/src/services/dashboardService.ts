
import { DashboardStats, RecentActivityItem, UpcomingDueDateItem } from "../types/dashboard";
import api from "./apiService";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/api/Dashboard/Stats");
    return response.data;
  },

  async getRecentActivity(count = 5): Promise<RecentActivityItem[]> {
    const response = await api.get<RecentActivityItem[]>(`/api/Dashboard/RecentActivity?count=${count}`);
    return response.data;
  },

  async getUpcomingDueDates(daysAhead = 7): Promise<UpcomingDueDateItem[]> {
    const response = await api.get<UpcomingDueDateItem[]>(`/api/Dashboard/UpcomingDueDates?daysAhead=${daysAhead}`);
    return response.data;
  },
};

