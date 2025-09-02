// components/forms/AddMediaForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MediaFormData } from "../../types/media";

interface AddMediaFormProps {
  onSubmit: (data: MediaFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddMediaForm({ onSubmit, isSubmitting = false, submitError }: AddMediaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MediaFormData>();

  const submitHandler: SubmitHandler<MediaFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Error Banner */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Media Type */}
      <div>
        <label htmlFor="mediaTypeId" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Media Type
        </label>
        <select
          id="mediaTypeId"
          {...register("mediaTypeId", { 
            required: "Please select a media type",
            valueAsNumber: true 
          })}
          aria-describedby={errors.mediaTypeId ? "mediaType-error" : undefined}
          aria-invalid={errors.mediaTypeId ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        >
          <option value="">Select a media type</option>
          <option value="1">Movie</option>
          <option value="2">Series</option>
          <option value="3">Book</option>
          <option value="4">Podcast</option>
        </select>
        {errors.mediaTypeId && (
          <p id="mediaType-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.mediaTypeId.message}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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

      {/* Creator */}
      <div>
        <label htmlFor="creator" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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
        <label htmlFor="publisher" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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

      {/* Publication Date */}
      <div>
        <label htmlFor="publicationDate" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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
        <label htmlFor="language" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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
        <label htmlFor="genre" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
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

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description", {
            maxLength: { value: 2000, message: "Description must be less than 2000 characters" }
          })}
          aria-describedby={errors.description ? "description-error" : undefined}
          aria-invalid={errors.description ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.description && (
          <p id="description-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="coverImageUrl" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Cover Image URL
        </label>
        <input
          id="coverImageUrl"
          type="url"
          {...register("coverImageUrl", {
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Please enter a valid URL starting with http:// or https://"
            }
          })}
          aria-describedby={errors.coverImageUrl ? "coverImageUrl-error" : undefined}
          aria-invalid={errors.coverImageUrl ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.coverImageUrl && (
          <p id="coverImageUrl-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.coverImageUrl.message}
          </p>
        )}
      </div>

      {/* ISBN-10 */}
      <div>
        <label htmlFor="isbn10" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          ISBN-10
        </label>
        <input
          id="isbn10"
          type="text"
          {...register("isbn10", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "ISBN-10 must be exactly 10 digits"
            }
          })}
          aria-describedby={errors.isbn10 ? "isbn10-error" : undefined}
          aria-invalid={errors.isbn10 ? "true" : "false"}
          maxLength={10}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.isbn10 && (
          <p id="isbn10-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.isbn10.message}
          </p>
        )}
      </div>

      {/* ISBN-13 */}
      <div>
        <label htmlFor="isbn13" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          ISBN-13
        </label>
        <input
          id="isbn13"
          type="text"
          {...register("isbn13", {
            pattern: {
              value: /^[0-9]{13}$/,
              message: "ISBN-13 must be exactly 13 digits"
            }
          })}
          aria-describedby={errors.isbn13 ? "isbn13-error" : undefined}
          aria-invalid={errors.isbn13 ? "true" : "false"}
          maxLength={13}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.isbn13 && (
          <p id="isbn13-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.isbn13.message}
          </p>
        )}
      </div>

      {/* Page Count */}
      <div>
        <label htmlFor="pageCount" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Page Count
        </label>
        <input
          id="pageCount"
          type="number"
          min="1"
          {...register("pageCount", { 
            valueAsNumber: true,
            min: { value: 1, message: "Page count must be at least 1" },
            max: { value: 10000, message: "Page count cannot exceed 10,000" }
          })}
          aria-describedby={errors.pageCount ? "pageCount-error" : undefined}
          aria-invalid={errors.pageCount ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.pageCount && (
          <p id="pageCount-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.pageCount.message}
          </p>
        )}
      </div>

      {/* Issue Number */}
      <div>
        <label htmlFor="issueNumber" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Issue Number
        </label>
        <input
          id="issueNumber"
          type="number"
          min="1"
          {...register("issueNumber", { 
            valueAsNumber: true,
            min: { value: 1, message: "Issue number must be at least 1" }
          })}
          aria-describedby={errors.issueNumber ? "issueNumber-error" : undefined}
          aria-invalid={errors.issueNumber ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.issueNumber && (
          <p id="issueNumber-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.issueNumber.message}
          </p>
        )}
      </div>

      {/* Volume */}
      <div>
        <label htmlFor="volume" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Volume
        </label>
        <input
          id="volume"
          type="number"
          min="1"
          {...register("volume", { 
            valueAsNumber: true,
            min: { value: 1, message: "Volume must be at least 1" }
          })}
          aria-describedby={errors.volume ? "volume-error" : undefined}
          aria-invalid={errors.volume ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.volume && (
          <p id="volume-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.volume.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
                     disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : 'Save Media'}
        </button>
      </div>
    </form>
  );
}