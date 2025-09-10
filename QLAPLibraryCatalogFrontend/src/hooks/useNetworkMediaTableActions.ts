import { useState } from 'react';
import { Media, MediaFormData, CreateMediaRequest, CreateMediaCopyRequest } from '../types/media';
import { mediaService } from '../services/mediaService';
import { useTableActions } from './useTableActions';

interface UseNetworkMediaTableActionsProps {
  userID: number | null;
  onRefresh: () => void;
}

export const useNetworkMediaTableActions = ({ userID, onRefresh }: UseNetworkMediaTableActionsProps) => {
  const { executeAction, isLoading: actionLoading } = useTableActions();
  
  // Modal states
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<Media | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedCopyForBorrow, setSelectedCopyForBorrow] = useState<number | null>(null);
  const [addingToCopyMediaId, setAddingToCopyMediaId] = useState<number | null>(null);

  // Modal handlers
  const openMediaModal = (media: Media) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedMedia(null);
  };

  const openAddMediaModal = () => {
    setIsAddMediaModalOpen(true);
  };

  const closeAddMediaModal = () => {
    setIsAddMediaModalOpen(false);
  };

  const openCopyModal = (media: Media) => {
    setAddingToCopyMediaId(media.mediaId);
    setSelectedMediaForCopy(media);
    setIsCopyModalOpen(true);
  };

  const closeCopyModal = () => {
    setIsCopyModalOpen(false);
    setSelectedMediaForCopy(null);
    setAddingToCopyMediaId(null);
  };

  const openBorrowModal = (media: Media, copyId: number) => {
    setSelectedMedia(media);
    setSelectedCopyForBorrow(copyId);
    setIsBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setIsBorrowModalOpen(false);
    setSelectedMedia(null);
    setSelectedCopyForBorrow(null);
  };

  // Action handlers
  const handleAddToCollection = (mediaItem: Media) => {
    openCopyModal(mediaItem);
  };

  const handleRequestItem = (mediaItem: Media) => {
    const availableCopies = mediaItem.copies?.filter(copy => copy.isAvailable) || [];
    
    if (availableCopies.length === 0) {
      executeAction(
        () => Promise.reject(new Error('No available copies for this item')),
        { errorMessage: 'No available copies for this item' }
      );
      return;
    }
    
    openBorrowModal(mediaItem, availableCopies[0].copyId);
  };

  const handleAddMedia = async (data: MediaFormData) => {
    const apiPayload: CreateMediaRequest = {
      mediaTypeId: data.mediaTypeId,
      title: data.title,
      creator: data.creator,
      subtitle: data.subtitle || null,
      publisher: data.publisher || null,
      publicationDate: data.publicationDate || null,
      language: data.language || null,
      genre: data.genre || null,
      description: data.description || null,
      coverImageUrl: data.coverImageUrl || null,
      isbn10: data.isbn10 || null,
      isbn13: data.isbn13 || null,
      pageCount: data.pageCount || null,
      issueNumber: data.issueNumber ? data.issueNumber.toString() : null,
      volume: data.volume ? data.volume.toString() : null,
    };

    return executeAction(
      () => mediaService.createNewMedia(apiPayload),
      {
        onSuccess: () => {
          closeAddMediaModal();
          onRefresh();
        },
        successMessage: 'Media added successfully!',
        errorMessage: 'Failed to create media'
      }
    );
  };

  const handleAddMediaCopy = async (data: CreateMediaCopyRequest) => {
    const copyData = selectedMediaForCopy 
      ? { ...data, mediaId: selectedMediaForCopy.mediaId }
      : data;

    const title = selectedMediaForCopy?.title || 'Media';
    
    return executeAction(
      () => mediaService.createNewMediaCopy(copyData),
      {
        onSuccess: () => {
          closeCopyModal();
          onRefresh();
        },
        successMessage: `"${title}" added to your collection!`,
        errorMessage: 'Failed to add media copy'
      }
    );
  };

  const handleBorrowRequestSubmit = async () => {
    return executeAction(
      () => Promise.resolve(),
      {
        onSuccess: () => {
          closeBorrowModal();
          onRefresh();
        },
        successMessage: 'Borrow request submitted successfully!'
      }
    );
  };

  return {
    // States
    selectedMedia,
    isMediaModalOpen,
    isAddMediaModalOpen,
    isCopyModalOpen,
    selectedMediaForCopy,
    isBorrowModalOpen,
    selectedCopyForBorrow,
    addingToCopyMediaId,
    actionLoading,

    // Modal handlers
    openMediaModal,
    closeMediaModal,
    openAddMediaModal,
    closeAddMediaModal,
    openCopyModal,
    closeCopyModal,
    openBorrowModal,
    closeBorrowModal,

    // Action handlers
    handleAddToCollection,
    handleRequestItem,
    handleAddMedia,
    handleAddMediaCopy,
    handleBorrowRequestSubmit,
  };
};