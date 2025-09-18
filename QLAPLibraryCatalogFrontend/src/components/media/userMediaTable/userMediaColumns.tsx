import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { MediaCopyDto } from '../../../types/media';

const columnHelper = createColumnHelper<MediaCopyDto>();

interface UseUserMediaColumnsProps {
  onAddCopy: (media: MediaCopyDto) => void;
}

export function useUserMediaColumns({ onAddCopy }: UseUserMediaColumnsProps) {
  return useMemo<ColumnDef<MediaCopyDto, any>[]>(() => [
    // Title & Creator
    columnHelper.accessor(row => row.media?.title ?? "—", {
      id: "title",
      header: "Title",
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex flex-col min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {row.media?.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {row.media?.creator || "Unknown author"}
            </p>
          </div>
        );
      },
      enableSorting: true,
      size: 280,
    }),

    // Media Type
    columnHelper.accessor(row => row.media?.mediaTypeName ?? "Unknown", {
      id: "mediaType",
      header: "Type",
      cell: info => (
        <span className="text-sm text-gray-900">{info.getValue()}</span>
      ),
      enableSorting: true,
      size: 120,
    }),

    // // Number of Copies
    // columnHelper.accessor(row => row.copies?.length ?? 0, {
    //   id: "copiesCount",
    //   header: "My Copies",
    //   cell: info => {
    //     const count = info.getValue();
    //     const row = info.row.original;
    //     const availableCount = row.copies?.filter((c: MediaCopy) => c.isAvailable).length ?? 0;
        
    //     return (
    //       <div className="text-sm text-gray-900">
    //         {count} total 
    //         {count > 0 && (
    //           <span className="text-green-600 ml-1">
    //             ({availableCount} available)
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    //   enableSorting: true,
    //   size: 140,
    // }),

    // Actions
    columnHelper.display({
      id: "actions",
      header: "",
      size: 160,
      cell: info => {
        const mediaItem = info.row.original;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddCopy(mediaItem);
            }}
            aria-label={`Add copy of ${mediaItem.media?.title}`}
            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 transition-colors gap-1"
          >
            <Plus size={14} />
            Add Copy
          </button>
        );
      },
    }),
  ], [onAddCopy]);
}