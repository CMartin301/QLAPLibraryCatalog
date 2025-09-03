
import { useEffect } from 'react';

/**
 * A hook that disables scrolling on the document body when a component is mounted.
 * @param isOpen - A boolean indicating whether the modal is open.
 */
export const useModalScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Clean up the style on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
};