import { useState, useCallback } from 'react';
import {
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from '@tanstack/react-table';

export interface TableStateConfig {
  initialPageSize?: number;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
}

export function useTableState<T>(config: TableStateConfig = {}) {
  const {
    initialPageSize = 10,
    enableGlobalFilter = true,
    enableColumnFilters = false,
  } = config;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Reset pagination when filters change
  const setGlobalFilterWithReset = useCallback((value: string) => {
    setGlobalFilter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const setColumnFiltersWithReset = useCallback((filters: ColumnFiltersState) => {
    setColumnFilters(filters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setGlobalFilter('');
    setColumnFilters([]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    // State
    sorting,
    globalFilter,
    columnFilters,
    pagination,
    
    // Setters
    setSorting,
    setGlobalFilter: enableGlobalFilter ? setGlobalFilterWithReset : undefined,
    setColumnFilters: enableColumnFilters ? setColumnFiltersWithReset : undefined,
    setPagination,
    
    // Utilities
    resetFilters,
    
    // Table state object (for passing to useReactTable)
    tableState: {
      sorting,
      ...(enableGlobalFilter && { globalFilter }),
      ...(enableColumnFilters && { columnFilters }),
      pagination,
    },
    
    // Table state handlers (for passing to useReactTable)
    tableStateHandlers: {
      onSortingChange: setSorting,
      ...(enableGlobalFilter && { onGlobalFilterChange: setGlobalFilterWithReset }),
      ...(enableColumnFilters && { onColumnFiltersChange: setColumnFiltersWithReset }),
      onPaginationChange: setPagination,
    },
  };
}