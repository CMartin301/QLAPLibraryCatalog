// components/shared/StatusBadge.tsx
import { StatusConfig } from "../../utilities/statusDisplayHelpers";

const colorMap = {
  gray: "bg-gray-100 text-gray-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-lavender-100 text-lavender-500",
};

const sizeMap = {
  xs: {
    badge: "px-2 py-0.5 text-xs",
    icon: "w-3 h-3"
  },
  sm: {
    badge: "px-2.5 py-0.5 text-xs",
    icon: "w-3 h-3"
  },
  md: {
    badge: "px-3 py-1 text-sm",
    icon: "w-4 h-4"
  },
  lg: {
    badge: "px-4 py-1.5 text-sm",
    icon: "w-4 h-4"
  }
};

interface StatusBadgeProps {
  config: StatusConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function StatusBadge({ config, size = 'sm' }: StatusBadgeProps) {
  const Icon = config.icon;
  const sizeStyles = sizeMap[size];
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium gap-1 ${colorMap[config.color]} ${sizeStyles.badge}`}
    >
      {Icon && <Icon className={`${sizeStyles.icon}`} aria-hidden="true" />}
      {config.text}
    </span>
  );
}