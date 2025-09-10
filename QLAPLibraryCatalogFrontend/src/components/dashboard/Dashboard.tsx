import React, { useState } from 'react';
import { Book, Calendar, ArrowLeftRight, Clock, User, TrendingUp, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useDashboardStats, useRecentActivity, useUpcomingDueDates } from '../../hooks/useDashboard';
import StatCard from '../shared/StatCard';
import { RecentActivityItem, UpcomingDueDateItem } from '../../types/dashboard';

// Loading component for better UX
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Error component for better error handling
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-lavender-500 text-white rounded-lg hover:bg-lavender-600 transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    )}
  </div>
);

// Activity Item Component (improved)
interface ActivityItemProps {
  activity: RecentActivityItem;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'loan':
        return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
      case 'request':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'return':
        return <Book className="w-4 h-4 text-green-500" />;
      default:
        return <Book className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString();
    } catch {
      return dateString; // fallback to original string if parsing fails
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {getIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <time className="text-xs text-gray-500 mt-1" dateTime={activity.date}>
          {formatDate(activity.date)}
        </time>
      </div>
    </div>
  );
};

// Due Date Item Component (improved)
interface DueDateItemProps {
  item: UpcomingDueDateItem;
}

const DueDateItem: React.FC<DueDateItemProps> = ({ item }) => {
  const isOverdue = item.daysUntilDue !== undefined && item.daysUntilDue < 0;
  const isDueSoon = item.daysUntilDue !== undefined && item.daysUntilDue <= 3 && item.daysUntilDue >= 0;

  const getStatusColor = () => {
    if (isOverdue) return 'bg-red-100 text-red-700';
    if (isDueSoon) return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getStatusText = () => {
    if (isOverdue) return `Overdue by ${Math.abs(item.daysUntilDue!)} day${Math.abs(item.daysUntilDue!) > 1 ? 's' : ''}`;
    if (item.daysUntilDue === 0) return 'Due today';
    if (item.daysUntilDue === 1) return 'Due tomorrow';
    if (isDueSoon) return `Due in ${item.daysUntilDue} days`;
    return `Due ${new Date(item.dueDate).toLocaleDateString()}`;
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
      <Book className="w-5 h-5 text-lavender-500 mt-1 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">{item.mediaTitle}</div>
        <div 
          className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${getStatusColor()}`}
          role="status"
          aria-label={`${item.mediaTitle} ${getStatusText()}`}
        >
          {getStatusText()}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const { username } = useAuth();
  
  // Use your custom hooks instead of mock data
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { activity, loading: activityLoading, error: activityError, refetch: refetchActivity } = useRecentActivity(5);
  const { dueDates, loading: dueDatesLoading, error: dueDatesError, refetch: refetchDueDates } = useUpcomingDueDates(7);


  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <header className="mb-8">
          <div className="text-center mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
              Welcome back, {username}!
            </h1>
            <div className="accent-stripes mx-auto mt-3" aria-hidden="true"></div>
          </div>
          <p className="text-gray-600 text-center">Here's what's happening with your library</p>
        </header>

        {/* Stats Grid */}
        <section aria-labelledby="stats-heading" className="mb-8">
          <h2 id="stats-heading" className="sr-only">Library Statistics</h2>
          
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-24" />
              ))}
            </div>
          ) : statsError ? (
            <ErrorDisplay message="Failed to load statistics" onRetry={refetchStats} />
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Book}
                title="Books in Collection"
                value={stats.totalBooks}
                description="Total items you own"
                color="lavender"
                to="/my-library"
              />
              <StatCard
                icon={ArrowLeftRight}
                title="Active Loans"
                value={stats.activeLoans}
                description="Currently borrowed/lent"
                color="blue"
                to="/borrowing"
              />
              <StatCard
                icon={Calendar}
                title="Pending Requests"
                value={stats.pendingRequests}
                description="Awaiting response"
                color="orange"
                to="/borrowing"
              />
              <StatCard
                icon={Clock}
                title="Overdue Items"
                value={stats.overdueItems}
                description="Need attention"
                color="red"
                to="/borrowing"
              />
            </div>
          ) : null}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <section aria-labelledby="activity-heading" className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 id="activity-heading" className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 text-lavender-500 mr-2" aria-hidden="true" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-4">
                {activityLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <LoadingSkeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : activityError ? (
                  <ErrorDisplay message="Failed to load recent activity" onRetry={refetchActivity} />
                ) : activity.length > 0 ? (
                  <div className="space-y-2" role="feed" aria-label="Recent library activity">
                    {activity.map((activityItem, index) => (
                      <ActivityItem key={`activity-${index}`} activity={activityItem} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Upcoming Due Dates */}
          <section aria-labelledby="due-dates-heading" className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 id="due-dates-heading" className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-lavender-500 mr-2" aria-hidden="true" />
                  Due Soon
                </h2>
              </div>
              <div className="p-4">
                {dueDatesLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <LoadingSkeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : dueDatesError ? (
                  <ErrorDisplay message="Failed to load due dates" onRetry={refetchDueDates} />
                ) : dueDates.length > 0 ? (
                  <div className="space-y-4" role="list" aria-label="Upcoming due dates">
                    {dueDates.map((item) => (
                      <DueDateItem key={`due-${item.loanId}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm">No upcoming due dates</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        {/* <section aria-labelledby="quick-actions-heading" className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="group">
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2">
                <Book className="w-5 h-5 mr-2" aria-hidden="true" />
                Browse Library
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2">
                <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                View Requests
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2">
                <ArrowLeftRight className="w-5 h-5 mr-2" aria-hidden="true" />
                Manage Loans
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2">
                <User className="w-5 h-5 mr-2" aria-hidden="true" />
                Profile Settings
              </button>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default Dashboard;