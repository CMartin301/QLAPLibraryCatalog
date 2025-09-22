import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { InfoIcon, Plus } from 'lucide-react';
import { Media, MediaCopy, MediaDto } from '../../../types/media';
import { StatusBadge } from '../../shared/StatusBadge';
import Button from '../../shared/Button';
import { TagDto } from '../../../types/tags';

const columnHelper = createColumnHelper<MediaDto>();

interface UseNetworkMediaColumnsProps {
  handlers: {
    onAddToCollection: (media: MediaDto) => void;
    onRequestItem: (media: MediaDto) => void;
  };
  addingToCopyMediaId: number | null;
}

export function useNetworkMediaColumns({ 
  handlers, 
  addingToCopyMediaId 
}: UseNetworkMediaColumnsProps) {
  const { onAddToCollection, onRequestItem } = handlers;

  return useMemo<ColumnDef<MediaDto, any>[]>(() => [
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
    columnHelper.accessor(row => row.mediaTypeName ?? "Unknown", {
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

    // Tags
    columnHelper.accessor(row => row.tags ?? "", {
      id: "tags",
      header: "Genre and Tags",
      cell: info => {
        const row = info.row.original;
        const tags = info.getValue();
        // if (!tags || tags.length === 0) {
        //   return <span className="text-sm text-gray-400">No tags</span>;
        // }
        
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag: TagDto) => {
              const config = {
                text: tag.tagName,
                color: 'gray' as const
              };
              return <StatusBadge key={tag.tagId} config={config} />;
            })}
          </div>
        );
      },
      enableSorting: false,
      size: 120,
    }),


    // Distance/Location column (only show when location data exists)
    columnHelper.accessor(row => row.nearestCopyDistance ?? null, {
      id: "distance",
      header: "Distance",
      cell: info => {
        const distance = info.getValue();
        const locationName = info.row.original.nearestCopyLocationName;
        
        if (distance === null || distance === undefined) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        
        const config = {
          text: `${distance.toFixed(1)} mi`,
          color: distance <= 5 ? 'green' as const : 
                distance <= 15 ? 'yellow' as const : 'red' as const
        };
        
        return (
          <div className="flex flex-col">
            <StatusBadge config={config} />
            {locationName && (
              <span className="text-xs text-gray-500 mt-1 truncate" title={locationName}>
                {locationName}
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 110,
    }),
    // Availability
    columnHelper.accessor(row => row.availableCopiesCount ?? 0, {
      id: "availability",
      header: "Availability",
      cell: info => {
        const hasAvailableCopies = info.getValue() > 0 ? true : false;
        
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
      header: "",
      size: 120,
      cell: info => {
        const mediaItem = info.row.original;
        const isAdding = addingToCopyMediaId === mediaItem.mediaId;

          return (
            <div className="flex flex-col gap-1">
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(mediaItem);
                }} 
                disabled={isAdding}
                loading={isAdding}
                aria-label={`Add ${mediaItem.title} to collection`}
              >
                {isAdding ? "Adding..." : "Add to Collection"}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestItem(mediaItem);
                }}
                aria-label={`Request ${mediaItem.title}`}
              >
                Request Item
              </Button>
            </div>
          );
        
      },
    }),
  ], [addingToCopyMediaId, onAddToCollection, onRequestItem]);
}