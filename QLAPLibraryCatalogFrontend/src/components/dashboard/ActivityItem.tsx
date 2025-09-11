import { parseISO, formatDistanceToNow } from "date-fns";
import { ArrowLeftRight, Calendar, Book } from "lucide-react";
import { RecentActivityDto, RecentActivityItem } from "../../types/dashboard";

// Activity Item Component (improved)
interface ActivityItemProps {
  activity: RecentActivityDto;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
        return <Book className="w-4 h-4 text-gray-500" />;
    
  };

    //   const getIcon = (type: RecentActivityDto['type']) => {
//     switch (type) {
//       case 'loan':
//         return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
//       case 'request':
//         return <Calendar className="w-4 h-4 text-orange-500" />;
//       case 'return':
//         return <Book className="w-4 h-4 text-green-500" />;
//       default:
//         return <Book className="w-4 h-4 text-gray-500" />;
//     }
//   };
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString); 
      const diffText = formatDistanceToNow(date, { addSuffix: true });

      return diffText;
    } catch {
      return dateString; // fallback
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.mediaTitle} {activity.activityType}</p>
        <time className="text-xs text-gray-500 mt-1" dateTime={activity.activityDate}>
          {formatDate(activity.activityDate)}
        </time>
      </div>
    </div>
  );
};

export default ActivityItem;