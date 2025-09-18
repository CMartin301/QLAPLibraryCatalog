import React, { useState, useEffect } from 'react';
import { CreateTagRequest, TagDto, TagFormData } from '../../types/tags';
import { tagService } from '../../services/tagService';
import { Tag, Search, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import Button from '../shared/Button';
import { Modal } from '../shared/Modal';
import { AddTagForm } from './AddTagForm';
import { mediaService } from '../../services/mediaService';
import { MediaFormData, CreateMediaRequest } from '../../types/media';
import { useTableActions } from '../../hooks/useTableActions';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
    const { executeAction, isLoading: actionLoading } = useTableActions();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await tagService.getTags();
      setTags(response);
    } catch (err: any) {
      setError('Failed to load tags');
      console.error('Error loading tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (data: TagFormData) => {
  const apiPayload: CreateTagRequest = {
    tagName: data.tagName,
  };

  return executeAction(
    () => tagService.createNewTag(apiPayload),
    {
      onSuccess: () => {
        setIsAddMediaModalOpen(false);
        loadTags();
      },
      successMessage: 'Media added successfully!',
      errorMessage: 'Failed to create media'
    }
  );
};
  // Filter tags based on search term
  const filteredTags = tags.filter(tag =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort tags by count (descending) then by name
  const sortedTags = [...filteredTags].sort((a, b) => {
    const countA = a.mediaTagCount ?? 0;
    const countB = b.mediaTagCount ?? 0;
    
    if (countB !== countA) {
      return countB - countA; // Sort by count descending
    }
    return a.tagName.localeCompare(b.tagName); // Then by name ascending
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-lavender-500" />
          <span className="ml-3 text-lg text-gray-600">Loading tags...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-3 text-lg text-red-600">{error}</span>
          <button
            onClick={loadTags}
            className="ml-4 px-4 py-2 bg-lavender-500 text-white rounded-md hover:bg-lavender-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">Browse Tags</h1>
        <p className="text-gray-600">
          Explore all available tags and see how many media items use each one.
        </p>
      </div>

    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4">


          <div className="flex items-center justify-between gap-4 mb-4">
            
            {/* Search Bar */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                />
              </div>
            {/* Stats */}
            <div className="mb-6 text-sm text-gray-600">
              Showing {sortedTags.length} of {tags.length} tags
              {searchTerm && (
                <span className="ml-2">
                  for "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-lavender-500 hover:text-lavender-700"
                  >
                    (clear)
                  </button>
                </span>
              )}
            </div>


              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={() => setIsAddMediaModalOpen(true)}
                className="whitespace-nowrap"
              >
                Add Tag
              </Button>

        </div>



        {/* Tags Grid */}
        {sortedTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No tags found' : 'No tags available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No tags match "${searchTerm}". Try a different search term.`
                : 'There are no tags in the system yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedTags.map((tag) => (
              <div
                key={tag.tagId}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-lavender-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <Tag className="h-5 w-5 text-lavender-500 flex-shrink-0" />
                    <span 
                      className="ml-3 font-medium text-gray-900 truncate group-hover:text-lavender-700 transition-colors"
                      title={tag.tagName}
                    >
                      {tag.tagName}
                    </span>
                  </div>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lavender-100 text-lavender-800 flex-shrink-0">
                    {tag.mediaTagCount ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

          {/* Add Media Modal */}
          <Modal
            isOpen={isAddMediaModalOpen}
            onClose={() => setIsAddMediaModalOpen(false)}
            title="Add New Tag"
          >
            <AddTagForm 
              onSubmit={handleAddTag}
              isSubmitting={actionLoading}
              submitError={null}
            />
          </Modal>
          </>
  );
};

export default TagsPage;