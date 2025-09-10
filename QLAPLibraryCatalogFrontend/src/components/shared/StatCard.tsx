import React from 'react';
import { Link } from 'react-router-dom';

export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number | string;
  description?: string;
  color?: string;
  to: string; // navigation target
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  color = 'lavender',
  to,
}) => (
  <Link
    to={to}
    className={`
      group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm
      transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
      hover:shadow-md hover:bg-gray-50
    `}
    aria-label={`${title}: ${value} ${description ?? ''}`} // ✅ Screen reader context
  >
    <div className="flex items-center">
      <div
        className={`flex-shrink-0 p-3 bg-${color}-100 rounded-lg group-hover:scale-105 transition-transform`}
      >
        <Icon className={`w-6 h-6 text-${color}-600`} aria-hidden="true" />
      </div>
      <div className="ml-4 flex-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </div>
    </div>
  </Link>
);

export default StatCard;
