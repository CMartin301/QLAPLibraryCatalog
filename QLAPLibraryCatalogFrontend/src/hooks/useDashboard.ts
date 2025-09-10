import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardStats, RecentActivityItem, UpcomingDueDateItem } from "../types/dashboard";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useRecentActivity = (count = 5) => {
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getRecentActivity(count);
      setActivity(data);
    } catch (err) {
      console.error("Failed to fetch recent activity:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch recent activity");
      setActivity([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [count]);

  return { activity, loading, error, refetch: fetchActivity };
};

export const useUpcomingDueDates = (daysAhead = 7) => {
  const [dueDates, setDueDates] = useState<UpcomingDueDateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDueDates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getUpcomingDueDates(daysAhead);
      setDueDates(data);
    } catch (err) {
      console.error("Failed to fetch upcoming due dates:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch upcoming due dates");
      setDueDates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueDates();
  }, [daysAhead]);

  return { dueDates, loading, error, refetch: fetchDueDates };
};
