import { FilterConfig, Filter, SelectFilter, MultiSelectFilter, BooleanFilter, RangeFilter } from '../types/filters';
import { MediaCopyDto, MediaDto } from '../types/media';

// Helper function to get unique values from media array
const getUniqueValues = (data: MediaCopyDto[], accessor: (item: MediaCopyDto) => string | null | undefined): string[] => {
  const values = data
    .map(accessor)
    .filter((value): value is string => Boolean(value))
    .map(value => value.trim())
    .filter(value => value.length > 0);
  
  return [...new Set(values)].sort();
};

// Helper function to get value counts for filter options
const getValueCounts = (data: MediaCopyDto[], accessor: (item: MediaCopyDto) => string | null | undefined): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  data.forEach(item => {
    const value = accessor(item);
    if (value && value.trim()) {
      const trimmedValue = value.trim();
      counts[trimmedValue] = (counts[trimmedValue] || 0) + 1;
    }
  });
  
  return counts;
};

const getUniqueTags = (data: MediaCopyDto[]): string[] => {
  const tags = new Set<string>();
  
  data.forEach(item => {
    if (item.media && item.media.tags && Array.isArray(item.media.tags)) {
      item.media.tags.forEach(tag => {
        if (tag.tagName && tag.tagName.trim()) {
          tags.add(tag.tagName.trim());
        }
      });
    }
  });
  
  return Array.from(tags).sort();
};

// Helper function to get tag counts
const getTagCounts = (data: MediaCopyDto[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  data.forEach(item => {
    if (item.media && item.media.tags && Array.isArray(item.media.tags)) {
      item.media.tags.forEach(tag => {
        if (tag.tagName && tag.tagName.trim()) {
          const tagName = tag.tagName.trim();
          counts[tagName] = (counts[tagName] || 0) + 1;
        }
      });
    }
  });
  
  return counts;
};

// Create initial filter configuration based on available data
export const createMediaCopiesFilterConfig = (data: MediaCopyDto[]): FilterConfig<MediaCopyDto> => {
  // Get unique values and counts for each filterable field
  const mediaTypes = getUniqueValues(data, item => item.media?.mediaTypeName);
  const mediaTypeCounts = getValueCounts(data, item => item.media?.mediaTypeName);
  
  const genres = getUniqueValues(data, item => item.media?.genre);
  const genreCounts = getValueCounts(data, item => item.media?.genre);
  
  const languages = getUniqueValues(data, item => item.media?.language);
  const languageCounts = getValueCounts(data, item => item.media?.language);
  
  const publishers = getUniqueValues(data, item => item.media?.publisher);
  const publisherCounts = getValueCounts(data, item => item.media?.publisher);
  
  // Calculate year range from publication dates
  const years = data
    .map(item => item.media?.publicationDate ? new Date(item.media?.publicationDate).getFullYear() : null)
    .filter((year): year is number => year !== null && !isNaN(year));
  
  const minYear = years.length > 0 ? Math.min(...years) : 1900;
  const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

  const filters: Filter[] = [
    // Media Type filter
    {
      id: 'mediaType',
      label: 'Media Type',
      type: 'select',
      active: false,
    priority: 'primary', 
      value: null,
      options: mediaTypes.map(type => ({
        value: type,
        label: type,
        count: mediaTypeCounts[type]
      }))
    } as SelectFilter,

    // Genre multi-select filter
    {
      id: 'genre',
      label: 'Genre',
      type: 'multiselect',
      active: false,
    priority: 'primary', 
      value: [],
      options: genres.map(genre => ({
        value: genre,
        label: genre,
        count: genreCounts[genre]
      }))
    } as MultiSelectFilter,

    // Language filter
    {
      id: 'language',
      label: 'Language',
      type: 'select',
      active: false,
    priority: 'advanced', 
      value: null,
      options: languages.map(lang => ({
        value: lang,
        label: lang,
        count: languageCounts[lang]
      }))
    } as SelectFilter,

    // Publisher filter (only show if there are multiple publishers)
    ...(publishers.length > 1 ? [{
      id: 'publisher',
      label: 'Publisher',
      type: 'select',
      active: false,
    priority: 'advanced', 
      value: null,
      options: publishers.map(pub => ({
        value: pub,
        label: pub,
        count: publisherCounts[pub]
      }))
    } as SelectFilter] : []),

    // Availability filter
    {
      id: 'availability',
      label: 'Availability',
      type: 'boolean',
      active: false,
    priority: 'primary', 
      value: null,
      trueLabel: 'Available',
      falseLabel: 'Not Available'
    } as BooleanFilter,

    // Publication Year range filter
    {
      id: 'publicationYear',
      label: 'Publication Year',
      type: 'range',
      active: false,
    priority: 'advanced', 
      value: { min: null, max: null },
      min: minYear,
      max: maxYear,
      step: 1
    } as RangeFilter,
    {
      id: 'tags',
      label: 'Tags',
      type: 'multiselect',
      active: false,
      priority: 'primary',
      value: [],
      options: (() => {
        const uniqueTags = getUniqueTags(data);
        const tagCounts = getTagCounts(data);
        return uniqueTags.map(tag => ({
          value: tag,
          label: tag,
          count: tagCounts[tag]
        }));
      })()
    } as MultiSelectFilter,
  ];

  return {
    filters,
    applyFilters: (data: MediaCopyDto[], activeFilters: Filter[]) => {
      return data.filter(item => {
        return activeFilters.every(filter => {
          if (!filter.active) return true;

          switch (filter.type) {
            case 'select': {
              const selectFilter = filter as SelectFilter;
              if (!selectFilter.value) return true;
              if (!item.media) return false;
              
              const itemValue = getFilterValue(item.media, filter.id);
              return itemValue === selectFilter.value;
            }

            case 'multiselect': {
              const multiFilter = filter as MultiSelectFilter;
              if (multiFilter.value.length === 0) return true;
              if (!item.media) return false;
              
              // Handle tags filtering (AND logic - item must have ALL selected tags)
              if (filter.id === 'tags') {
                if (!item.media || !item.media.tags || item.media.tags.length === 0) return false;
                
                // Get all tag names for this item
                const itemTagNames = item.media.tags
                  .map(tag => tag.tagName?.trim())
                  .filter((tagName): tagName is string => Boolean(tagName));
                
                // Check if the item has ALL of the selected tags (AND logic)
                return multiFilter.value.every(selectedTag => 
                  itemTagNames.includes(selectedTag)
                );
              }
              const itemValue = getFilterValue(item.media, filter.id);
              return itemValue ? multiFilter.value.includes(itemValue) : false;
            }

            case 'boolean': {
              const boolFilter = filter as BooleanFilter;
              if (boolFilter.value === null) return true;
              
            //   const isAvailable = (item.availableCopiesCount ?? 0) > 0;
              return item.isAvailable === boolFilter.value;
            }

            case 'range': {
              const rangeFilter = filter as RangeFilter;
              const { min, max } = rangeFilter.value;
              if (min === null && max === null) return true;
              
              if (!item.media) return false;

              const itemYear = item.media.publicationDate ? new Date(item.media.publicationDate).getFullYear() : null;
              if (itemYear === null) return false;
              
              if (min !== null && itemYear < min) return false;
              if (max !== null && itemYear > max) return false;
              
              return true;
            }

            default:
              return true;
          }
        });
      });
    }
  };
};

// Helper function to get filter value from media item
const getFilterValue = (item: MediaDto, filterId: string): string | null => {
  switch (filterId) {
    case 'mediaType':
      return item.mediaTypeName || null;
    case 'genre':
      return item.genre || null;
    case 'language':
      return item.language || null;
    case 'publisher':
      return item.publisher || null;
    default:
      return null;
  }
};