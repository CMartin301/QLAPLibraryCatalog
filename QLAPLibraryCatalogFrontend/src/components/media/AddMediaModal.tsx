// components/AddMediaModal.tsx
import React, { useState } from "react";
import { Media, MediaFormData } from "../../types/media";
import { mediaService } from "../../services/mediaService";
import { AddMediaForm } from "./AddMediaForm";
import { useModalScrollLock } from "../../hooks/useModalScrollLock";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMediaModal({ isOpen, onClose }: AddMediaModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMedia, setCreatedMedia] = useState<Media | null>(null);

  // Lock the background scroll when the modal is open
  useModalScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = async (data: MediaFormData) => {
    setLoading(true);
    setError(null);
    setCreatedMedia(null);

    const mediaToCreate = {
      mediaTypeId: data.mediaTypeId,
      title: data.title,
      subtitle: data.subtitle ?? null,
      creator: data.creator,
    };

    // try {
    //   const newMedia = await mediaService.createNewMedia(mediaToCreate);
    //   setCreatedMedia(newMedia);
    //   console.log("Media created successfully:", newMedia);
    // } catch (err: any) {
    //   console.error("Failed to create media:", err);
    //   setError("Failed to save media. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    // The main overlay to dim the background and capture clicks
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      {/* The modal container that stops the click from closing it */}
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Media</h2>
            <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
              &times;
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* The scrollable content area */}
            {loading && <p>Saving media...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {createdMedia && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <p>Media saved successfully! ID: {createdMedia.mediaId}</p>
              </div>
            )}
            <AddMediaForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}