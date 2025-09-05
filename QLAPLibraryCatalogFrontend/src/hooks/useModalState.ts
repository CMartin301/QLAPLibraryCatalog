import { useState, useCallback } from 'react';
import { Media } from '../types/media';

export interface ModalState {
  isAddMediaOpen: boolean;
  isAddCopyOpen: boolean;
  isBorrowRequestOpen: boolean;
  selectedMediaForCopy: Media | null;
  selectedMediaForBorrow: Media | null;
  selectedCopyForBorrow: number | null;
  addingToCopyMediaId: number | null;
}

export const useModalState = () => {
  const [state, setState] = useState<ModalState>({
    isAddMediaOpen: false,
    isAddCopyOpen: false,
    isBorrowRequestOpen: false,
    selectedMediaForCopy: null,
    selectedMediaForBorrow: null,
    selectedCopyForBorrow: null,
    addingToCopyMediaId: null,
  });

  const openAddMedia = useCallback(() => {
    setState(prev => ({ ...prev, isAddMediaOpen: true }));
  }, []);

  const closeAddMedia = useCallback(() => {
    setState(prev => ({ ...prev, isAddMediaOpen: false }));
  }, []);

  const openAddCopy = useCallback((media: Media) => {
    setState(prev => ({
      ...prev,
      isAddCopyOpen: true,
      selectedMediaForCopy: media,
      addingToCopyMediaId: media.mediaId,
    }));
  }, []);

  const closeAddCopy = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAddCopyOpen: false,
      selectedMediaForCopy: null,
      addingToCopyMediaId: null,
    }));
  }, []);

  const openBorrowRequest = useCallback((media: Media, copyId: number) => {
    setState(prev => ({
      ...prev,
      isBorrowRequestOpen: true,
      selectedMediaForBorrow: media,
      selectedCopyForBorrow: copyId,
    }));
  }, []);

  const closeBorrowRequest = useCallback(() => {
    setState(prev => ({
      ...prev,
      isBorrowRequestOpen: false,
      selectedMediaForBorrow: null,
      selectedCopyForBorrow: null,
    }));
  }, []);

  return {
    state,
    openAddMedia,
    closeAddMedia,
    openAddCopy,
    closeAddCopy,
    openBorrowRequest,
    closeBorrowRequest,
  };
};