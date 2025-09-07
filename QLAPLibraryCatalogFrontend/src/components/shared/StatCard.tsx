import React from 'react';

export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number | string;
  description?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  color = 'lavender',
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`flex-shrink-0 p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div className="ml-4 flex-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </div>
    </div>
  </div>
);

export default StatCard;
