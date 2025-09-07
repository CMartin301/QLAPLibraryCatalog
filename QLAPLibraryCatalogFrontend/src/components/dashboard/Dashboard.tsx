import React from 'react';
import { Book, Calendar, ArrowLeftRight, Clock, User, TrendingUp } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatCard from '../shared/StatCard';

// Mock data
const mockData = {
  stats: {
    totalBooks: 24,
    activeLoans: 3,
    pendingRequests: 2,
    overdueItems: 1
  },
  recentActivity: [
    { id: 1, type: 'loan', message: '"The Great Gatsby" borrowed from John Doe', time: '2 hours ago' },
    { id: 2, type: 'request', message: 'New borrow request for "1984"', time: '1 day ago' },
    { id: 3, type: 'return', message: '"To Kill a Mockingbird" returned', time: '2 days ago' }
  ],
  upcomingDueDates: [
    { id: 1, title: 'Dune', author: 'Frank Herbert', dueDate: '2025-09-10', overdue: false },
    { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', dueDate: '2025-09-08', overdue: true }
  ]
};


interface Activity {
  id: number;
  type: 'loan' | 'request' | 'return' | string;
  message: string;
  time: string;
}

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = (type: Activity['type']) => {
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

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-0.5">{getIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
const Dashboard: React.FC = () => {
  const { username } = useAuth();

  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="text-center mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
              Welcome back, {username}!
            </h1>
            <div className="accent-stripes mx-auto mt-3"></div>
          </div>
          <p className="text-gray-600 text-center">Here's what's happening with your library</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Book}
            title="Books in Collection"
            value={mockData.stats.totalBooks}
            description="Total items you own"
            color="lavender"
          />
          <StatCard
            icon={ArrowLeftRight}
            title="Active Loans"
            value={mockData.stats.activeLoans}
            description="Currently borrowed/lent"
            color="blue"
          />
          <StatCard
            icon={Calendar}
            title="Pending Requests"
            value={mockData.stats.pendingRequests}
            description="Awaiting response"
            color="orange"
          />
          <StatCard
            icon={Clock}
            title="Overdue Items"
            value={mockData.stats.overdueItems}
            description="Need attention"
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 text-lavender-500 mr-2" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-4">
                {mockData.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {mockData.recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Due Dates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-lavender-500 mr-2" />
                  Due Soon
                </h2>
              </div>
              <div className="p-4">
                {mockData.upcomingDueDates.length > 0 ? (
                  <div className="space-y-4">
                    {mockData.upcomingDueDates.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                        <Book className="w-5 h-5 text-lavender-500 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500 mb-2">{item.author}</div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            item.overdue 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            Due {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm">No upcoming due dates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200">
                <Book className="w-5 h-5 mr-2" />
                Browse Library
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200">
                <Calendar className="w-5 h-5 mr-2" />
                View Requests
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200">
                <ArrowLeftRight className="w-5 h-5 mr-2" />
                Manage Loans
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 rounded-lg transition-colors border border-lavender-200">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
