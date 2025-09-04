// AddMediaCopyForm.tsx
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useForm } from 'react-hook-form';
import { CreateMediaCopyRequest, Media } from '../../types/media';
import { mediaService } from '../../services/mediaService';
import useAuth from '../../hooks/useAuth';

interface AddMediaCopyFormProps {
  onSubmit: (data: CreateMediaCopyRequest) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function AddMediaCopyForm({
  onSubmit,
  isSubmitting,
  submitError,
}: AddMediaCopyFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateMediaCopyRequest>();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const { username, userID } = useAuth();

  // Load options from backend as user types
  const loadMediaOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    const result = await mediaService.getMedia();
    return result.map((m: Media) => ({
      value: m.mediaId,
      label: `${m.title} (${m.creator ?? 'Unknown'})`,
      media: m,
    }));
  };

  const handleFormSubmit = (data: CreateMediaCopyRequest) => {
    if (!selectedMedia) return;
    if (!userID) return;

    data.mediaId = selectedMedia.mediaId;
    data.userId = userID;

    onSubmit(data);
    reset();
    setSelectedMedia(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Media</label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadMediaOptions}
          onChange={(option) => setSelectedMedia(option ? (option as any).media : null)}
          placeholder="Search media..."
        />
      </div>

      {selectedMedia && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <input
              {...register('condition', { required: true })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Loan Days</label>
            <input
              type="number"
              {...register('maxLoanDays', { required: true })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('requiresApproval')} />
            <span className="text-sm">Requires Approval</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...register('notes')}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </>
      )}

      {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !selectedMedia}
        className="w-full py-2 px-4 bg-lavender-500 text-white rounded-lg hover:bg-lavender-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add Copy'}
      </button>
    </form>
  );
}
