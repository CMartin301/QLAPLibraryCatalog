import { ReactNode } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';

interface TableContainerProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  emptyMessage?: string;
  searchPlaceholder?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  } | null;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function TableContainer<T>({
  data,
  columns,
  loading = false,
  error = null,
  onRefresh,
  emptyMessage = 'No records found',
  searchPlaceholder = 'Search...',
  actionButton,
  header,
  footer,
  className = 'bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]',
}: TableContainerProps<T>) {
  return (
    <div className={className}>
      {/* Optional header section */}
      {header}

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">Error: {error}</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="mt-2 text-red-600 underline hover:text-red-700"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Table content */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading...
        </div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          emptyMessage={emptyMessage}
          searchPlaceholder={searchPlaceholder}
          actionButton={actionButton}
          error={error}
          onRefresh={onRefresh}
        />
      )}

      {/* Optional footer section */}
      {footer}
    </div>
  );
}