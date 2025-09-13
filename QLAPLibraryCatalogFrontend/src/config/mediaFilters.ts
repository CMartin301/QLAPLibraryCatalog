import { FilterConfig, Filter, SelectFilter, MultiSelectFilter, BooleanFilter, RangeFilter } from '../types/filters';
import { MediaDto } from '../types/media';

// Helper function to get unique values from media array
const getUniqueValues = (data: MediaDto[], accessor: (item: MediaDto) => string | null | undefined): string[] => {
  const values = data
    .map(accessor)
    .filter((value): value is string => Boolean(value))
    .map(value => value.trim())
    .filter(value => value.length > 0);
  
  return [...new Set(values)].sort();
};

// Helper function to get value counts for filter options
const getValueCounts = (data: MediaDto[], accessor: (item: MediaDto) => string | null | undefined): Record<string, number> => {
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

// Create initial filter configuration based on available data
export const createMediaFilterConfig = (data: MediaDto[]): FilterConfig<MediaDto> => {
  // Get unique values and counts for each filterable field
  const mediaTypes = getUniqueValues(data, item => item.mediaTypeName);
  const mediaTypeCounts = getValueCounts(data, item => item.mediaTypeName);
  
  const genres = getUniqueValues(data, item => item.genre);
  const genreCounts = getValueCounts(data, item => item.genre);
  
  const languages = getUniqueValues(data, item => item.language);
  const languageCounts = getValueCounts(data, item => item.language);
  
  const publishers = getUniqueValues(data, item => item.publisher);
  const publisherCounts = getValueCounts(data, item => item.publisher);
  
  // Calculate year range from publication dates
  const years = data
    .map(item => item.publicationDate ? new Date(item.publicationDate).getFullYear() : null)
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
  ];

  return {
    filters,
    applyFilters: (data: MediaDto[], activeFilters: Filter[]) => {
      return data.filter(item => {
        return activeFilters.every(filter => {
          if (!filter.active) return true;

          switch (filter.type) {
            case 'select': {
              const selectFilter = filter as SelectFilter;
              if (!selectFilter.value) return true;
              
              const itemValue = getFilterValue(item, filter.id);
              return itemValue === selectFilter.value;
            }

            case 'multiselect': {
              const multiFilter = filter as MultiSelectFilter;
              if (multiFilter.value.length === 0) return true;
              
              const itemValue = getFilterValue(item, filter.id);
              return itemValue ? multiFilter.value.includes(itemValue) : false;
            }

            case 'boolean': {
              const boolFilter = filter as BooleanFilter;
              if (boolFilter.value === null) return true;
              
              const isAvailable = (item.availableCopiesCount ?? 0) > 0;
              return isAvailable === boolFilter.value;
            }

            case 'range': {
              const rangeFilter = filter as RangeFilter;
              const { min, max } = rangeFilter.value;
              if (min === null && max === null) return true;
              
              const itemYear = item.publicationDate ? new Date(item.publicationDate).getFullYear() : null;
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