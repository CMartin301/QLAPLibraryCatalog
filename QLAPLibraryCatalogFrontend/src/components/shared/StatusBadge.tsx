// components/shared/StatusBadge.tsx
import { StatusConfig } from "../../utilities/statusDisplayHelpers";

const colorMap = {
  gray: "bg-gray-100 text-gray-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
};

export function StatusBadge({ config }: { config: StatusConfig }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[config.color]}`}
    >
      {config.text}
    </span>
  );
}
