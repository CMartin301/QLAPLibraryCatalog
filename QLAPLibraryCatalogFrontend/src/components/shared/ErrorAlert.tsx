import React from 'react';
import { AlertCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

type ErrorVariant = 'error' | 'warning' | 'info' | 'validation';

interface ErrorAlertProps {
  message: string | undefined | null;
  variant?: ErrorVariant;
  title?: string;
  showIcon?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  fieldId?: string;
}

const variantConfig = {
  error: {
    containerClass: 'bg-red-50 border-red-200 border-l-red-400',
    textClass: 'text-red-700',
    titleClass: 'text-red-800 font-medium',
    icon: XCircle,
    iconClass: 'text-red-500'
  },
  warning: {
    containerClass: 'bg-yellow-50 border-yellow-200 border-l-yellow-400',
    textClass: 'text-yellow-700',
    titleClass: 'text-yellow-800 font-medium',
    icon: AlertTriangle,
    iconClass: 'text-yellow-500'
  },
  info: {
    containerClass: 'bg-blue-50 border-blue-200 border-l-blue-400',
    textClass: 'text-blue-700',
    titleClass: 'text-blue-800 font-medium',
    icon: Info,
    iconClass: 'text-blue-500'
  },
  validation: {
    containerClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-700',
    titleClass: 'text-red-800 font-medium',
    icon: AlertCircle,
    iconClass: 'text-red-500'
  }
} as const;

export function ErrorAlert({
  message,
  variant = 'error',
  title,
  showIcon = true,
  action,
  className = '',
  fieldId
}: ErrorAlertProps) {
  // Early return if no message - this is the key improvement
  if (!message) {
    return null;
  }

  const config = variantConfig[variant];
  const Icon = config.icon;
  
  // Generate consistent IDs for accessibility
  const errorId = fieldId ? `${fieldId}-error` : `error-${React.useId()}`;
  
  return (
    <div
      id={errorId}
      role="alert"
      aria-live="polite"
      className={`
        p-3 border border-l-4 rounded-lg ${config.containerClass} ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && (
          <Icon 
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.iconClass}`} 
            aria-hidden="true" 
          />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {title && (
            <h4 className={`text-sm ${config.titleClass} mb-1`}>
              {title}
            </h4>
          )}
          
          {/* Message */}
          <p className={`text-sm ${config.textClass}`}>
            {message}
          </p>
        </div>
        
        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`
              text-sm underline font-medium transition-colors
              ${config.textClass} hover:opacity-80 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-current rounded
            `}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Convenience components for specific use cases
export function FormFieldError({ 
  message, 
  fieldId 
}: { 
  message: string | undefined; 
  fieldId: string; 
}) {
  // No need for manual null check - ErrorAlert handles it
  return (
    <ErrorAlert
      message={message}
      variant="validation"
      fieldId={fieldId}
      showIcon={true}
      className="mt-1"
    />
  );
}

export function SubmitError({ 
  message, 
  onRetry 
}: { 
  message: string | undefined | null; 
  onRetry?: () => void; 
}) {
  // No need for manual null check - ErrorAlert handles it
  return (
    <ErrorAlert
      message={message}
      variant="error"
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
}