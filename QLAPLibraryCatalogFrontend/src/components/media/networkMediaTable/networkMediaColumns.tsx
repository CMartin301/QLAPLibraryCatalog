import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Media, MediaCopy } from '../../../types/media';
import { StatusBadge } from '../../shared/StatusBadge';

const columnHelper = createColumnHelper<Media>();

interface UseNetworkMediaColumnsProps {
  handlers: {
    onAddToCollection: (media: Media) => void;
    onRequestItem: (media: Media) => void;
  };
  addingToCopyMediaId: number | null;
}

export function useNetworkMediaColumns({ 
  handlers, 
  addingToCopyMediaId 
}: UseNetworkMediaColumnsProps) {
  const { onAddToCollection, onRequestItem } = handlers;

  return useMemo<ColumnDef<Media, any>[]>(() => [
    // Title & Creator
    columnHelper.accessor(row => row.title ?? "—", {
      id: "title",
      header: "Title",
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex flex-col min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {row.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {row.creator || "Unknown author"}
            </p>
          </div>
        );
      },
      enableSorting: true,
      size: 280,
    }),

    // Media Type
    columnHelper.accessor(row => row.mediaType?.displayName ?? "Unknown", {
      id: "mediaType",
      header: "Type",
      cell: info => (
        <span className="text-sm text-gray-900">{info.getValue()}</span>
      ),
      enableSorting: true,
      size: 120,
    }),

    // Genre
    columnHelper.accessor(row => row.genre ?? "Unknown", {
      id: "genre",
      header: "Genre",
      cell: info => {
        const config = {
          text: info.getValue(),
          color: 'purple' as const
        };
        return <StatusBadge config={config} />;
      },
      enableSorting: true,
      size: 140,
    }),

    // Availability
    columnHelper.accessor(row => row.copies ?? [], {
      id: "availability",
      header: "Availability",
      cell: info => {
        const copies = info.getValue();
        const hasAvailableCopies = copies.some((c: MediaCopy) => c.isAvailable);
        
        const config = {
          text: hasAvailableCopies ? 'Available' : 'Not Available',
          color: hasAvailableCopies ? 'green' as const : 'red' as const
        };
        return <StatusBadge config={config} />;
      },
      enableSorting: false,
      size: 120,
    }),

    // Actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 180,
      cell: info => {
        const mediaItem = info.row.original;
        const isAdding = addingToCopyMediaId === mediaItem.mediaId;

          return (
           <> 
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCollection(mediaItem);
                    }}
                    disabled={isAdding}
                    aria-label={`Add ${mediaItem.title} to collection`}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 disabled:bg-gray-300 transition-colors gap-1"
                >
                    <Plus size={14} />
                    {isAdding ? "Adding..." : "Add to Collection"}
                </button>
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    onRequestItem(mediaItem);
                    }}
                    aria-label={`Request ${mediaItem.title}`}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 transition-colors gap-1"
                >
                    Request Item
                </button>
            </>
          );
        
      },
    }),
  ], [addingToCopyMediaId, onAddToCollection, onRequestItem]);
}