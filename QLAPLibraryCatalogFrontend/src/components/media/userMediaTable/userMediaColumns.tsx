import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { MediaCopyDto } from '../../../types/media';
import { StatusBadge } from '../../shared/StatusBadge';
import { TagDto } from '../../../types/tags';

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

          <div className="flex flex-wrap gap-1 mt-1">
            {row.media?.mediaTypeName && (
              <StatusBadge 
                            config={{
                              text: row.media?.mediaTypeName,
                              color: 'purple'
                            }}
                          />
            )}
            {row.condition && (
              <StatusBadge 
                            config={{
                              text: 'Condition: ' + row.condition,
                              color: row.condition=="Good"? 'green' : 'yellow'
                            }}
                          />
            )}
          </div>

          </div>
        );
      },
      enableSorting: true,
      size: 280,
    }),

    // // Media Type
    // columnHelper.accessor(row => row.media?.mediaTypeName ?? "Unknown", {
    //   id: "mediaType",
    //   header: "Type",
    //   cell: info => (
    //     // <span className="text-sm text-gray-900">{info.getValue()}</span>

    //                     <StatusBadge 
    //                                   config={{
    //                                     text: info.getValue(),
    //                                     color: 'purple'
    //                                   }}
    //                                 />
    //   ),
    //   enableSorting: true,
    //   size: 120,
    // }),
    // // Condition
    // columnHelper.accessor(row => row.condition ?? "Unknown", {
    //   id: "condition",
    //   header: "Condition",
    //   cell: info => (
    //     <span className="text-sm text-gray-900">{info.getValue()}</span>
    //   ),
    //   enableSorting: true,
    //   size: 120,
    // }),

    columnHelper.accessor(row => (row.media && row.media.tags) ?? "", {
      id: "tags",
      header: "Genres and Tags",
      cell: info => {
    const tags = info.getValue();
    if (!tags || tags.length === 0) {
      return <span className="text-sm text-gray-400">No tags</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {/* Display genre tags first */}
        {tags.filter((tag: TagDto) => tag.isGenre).map((tag: TagDto) => {
          const config = {
            text: tag.tagName,
            color: 'purple' as const
          };
          return <StatusBadge key={tag.tagId} config={config} />;
        })}
        
        {/* Then display non-genre tags */}
        {tags.filter((tag: TagDto) => !tag.isGenre).map((tag: TagDto) => {
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
      size: 200,
    }),
    // Status
    columnHelper.accessor(row => row.isAvailable , {
      id: "status",
      header: "Status",
      cell: info => (
        // <span className="text-sm text-gray-900">{info.getValue()}</span>

                        <StatusBadge 
                                      config={{
                                        text: info.getValue() ? 'Available' : 'On Loan',
                                        color: info.getValue() ? 'green' : 'gray'
                                      }}
                                    />
      ),
      enableSorting: true,
      size: 80,
    }),


    // Actions
    columnHelper.display({
      id: "actions",
      header: "",
      size: 100,
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