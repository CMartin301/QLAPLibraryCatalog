// components/forms/AddMediaForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MediaFormData, MediaType } from "../../types/media";
import { mediaService } from "../../services/mediaService";
import { Select } from "../shared/Select";

interface AddMediaFormProps {
  onSubmit: (data: MediaFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddMediaForm({ onSubmit, isSubmitting = false, submitError }: AddMediaFormProps) {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [mediaTypesError, setMediaTypesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control, // Add this for Controller
    reset,
    formState: { errors },
  } = useForm<MediaFormData>();

  // Fetch media types when component mounts
  useEffect(() => {
    const fetchMediaTypes = async () => {
      try {
        setIsLoadingTypes(true);
        setMediaTypesError(null);
        const types = await mediaService.getMediaTypes();
        setMediaTypes(types);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load media types';
        setMediaTypesError(errorMessage);
        console.error('Error fetching media types:', error);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchMediaTypes();
  }, []);

  const submitHandler: SubmitHandler<MediaFormData> = (data) => {
    onSubmit(data);
  };

  // Convert media types to select options
  const mediaTypeOptions = mediaTypes.map(type => ({
    value: type.mediaTypeId,
    label: type.displayName,
    disabled: false
  }));

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Error Banner */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Media Types Loading Error */}
      {mediaTypesError && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert">
          <p className="text-yellow-700 text-sm">
            Warning: {mediaTypesError}. The form may not work correctly.
          </p>
        </div>
      )}

      {/* Media Type & Title Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Media Type - Using Select */}
        <div>
          <label className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Media Type
          </label>
          <Controller
            name="mediaTypeId"
            control={control}
            rules={{ required: "Please select a media type" }}
            render={({ field, fieldState }) => (
              <Select
                options={mediaTypeOptions}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={isLoadingTypes ? "Loading media types..." : "Select a media type"}
                disabled={isLoadingTypes || isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Title - Keep existing */}
        <div>
          <label htmlFor="title" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { 
              required: "Title is required",
              minLength: { value: 1, message: "Title cannot be empty" },
              maxLength: { value: 255, message: "Title must be less than 255 characters" }
            })}
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={errors.title ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.title && (
            <p id="title-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
      </div>

      {/* Rest of form remains exactly the same... */}
      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
          Subtitle
        </label>
        <input
          id="subtitle"
          type="text"
          {...register("subtitle", {
            maxLength: { value: 255, message: "Subtitle must be less than 255 characters" }
          })}
          aria-describedby={errors.subtitle ? "subtitle-error" : undefined}
          aria-invalid={errors.subtitle ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.subtitle && (
          <p id="subtitle-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.subtitle.message}
          </p>
        )}
      </div>

      {/* Creator & Publisher Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Creator */}
        <div>
          <label htmlFor="creator" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Creator
          </label>
          <input
            id="creator"
            type="text"
            {...register("creator", { 
              required: "Creator is required",
              minLength: { value: 1, message: "Creator cannot be empty" },
              maxLength: { value: 255, message: "Creator must be less than 255 characters" }
            })}
            aria-describedby={errors.creator ? "creator-error" : undefined}
            aria-invalid={errors.creator ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.creator && (
            <p id="creator-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.creator.message}
            </p>
          )}
        </div>

        {/* Publisher */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Publisher
          </label>
          <input
            id="publisher"
            type="text"
            {...register("publisher", {
              maxLength: { value: 255, message: "Publisher must be less than 255 characters" }
            })}
            aria-describedby={errors.publisher ? "publisher-error" : undefined}
            aria-invalid={errors.publisher ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.publisher && (
            <p id="publisher-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.publisher.message}
            </p>
          )}
        </div>
      </div>
      
      {/* Publication Date, Language & Genre Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Publication Date */}
        <div>
          <label htmlFor="publicationDate" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Publication Date
          </label>
          <input
            id="publicationDate"
            type="date"
            {...register("publicationDate", {
              validate: (value) => {
                if (!value) return true;
                const date = new Date(value);
                const now = new Date();
                return date <= now || "Publication date cannot be in the future";
              }
            })}
            aria-describedby={errors.publicationDate ? "publicationDate-error" : undefined}
            aria-invalid={errors.publicationDate ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.publicationDate && (
            <p id="publicationDate-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.publicationDate.message}
            </p>
          )}
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Language
          </label>
          <input
            id="language"
            type="text"
            {...register("language", {
              maxLength: { value: 50, message: "Language must be less than 50 characters" }
            })}
            aria-describedby={errors.language ? "language-error" : undefined}
            aria-invalid={errors.language ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.language && (
            <p id="language-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.language.message}
            </p>
          )}
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            {...register("genre", {
              maxLength: { value: 100, message: "Genre must be less than 100 characters" }
            })}
            aria-describedby={errors.genre ? "genre-error" : undefined}
            aria-invalid={errors.genre ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.genre && (
            <p id="genre-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.genre.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || isLoadingTypes}
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
                     disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : isLoadingTypes ? 'Loading...' : 'Save Media'}
        </button>
      </div>
    </form>
  );
}