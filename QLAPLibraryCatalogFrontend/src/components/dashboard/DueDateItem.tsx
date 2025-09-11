import { Book } from "lucide-react";
import { UpcomingDueDateItem } from "../../types/dashboard";

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

export default DueDateItem;