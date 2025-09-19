import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export interface DropdownItem {
  label: string;
  path: string;
  dropdownIcon: LucideIcon;
}

interface HeaderDropdownProps {
  label: string;
  icon?: LucideIcon;
  items: DropdownItem[];
  className?: string;
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ 
  label, 
  icon,
  items, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Check if any dropdown item is currently active
  const isAnyItemActive = items.some(item => location.pathname === item.path);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-Media transition-colors ${
                isAnyItemActive 
                ? 'text-white border-l-4 border-lavender-400 bg-charcoal-light' 
                : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
            }`}
            aria-expanded={isOpen}
            aria-haspopup="true"
            >
              {icon && (
                (() => {
                  const Icon = icon;
                  return <Icon size={16} className="mr-3" />;
                })()
              )}
            {label}
        </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <div className="py-1" role="menu">
            {items.map((item) => {
              const Icon = item.dropdownIcon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm transition-colors ${
                    isActive
                        ? 'bg-lavender-100 text-gray-700 border-l-4 border-lavender-600'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  role="menuitem"
                >
                  <Icon size={16} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};