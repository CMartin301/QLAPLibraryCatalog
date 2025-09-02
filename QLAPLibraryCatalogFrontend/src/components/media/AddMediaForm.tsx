// components/forms/AddMediaForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MediaFormData } from "../../types/media"; // Update the import path

interface AddMediaFormProps {
  onSubmit: (data: MediaFormData) => void;
}

export function AddMediaForm({ onSubmit }: AddMediaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MediaFormData>();

  const submitHandler: SubmitHandler<MediaFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Media Type */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Media Type
        </label>
        <select
          {...register("mediaTypeId", { required: "Media Type is required", valueAsNumber: true })}
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
          <p className="text-red-500 text-xs mt-1">{errors.mediaTypeId.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Title
        </label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Subtitle
        </label>
        <input
          type="text"
          {...register("subtitle")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Creator */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Creator
        </label>
        <input
          type="text"
          {...register("creator", { required: "Creator is required" })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
        {errors.creator && (
          <p className="text-red-500 text-xs mt-1">{errors.creator.message}</p>
        )}
      </div>

      {/* Publisher */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Publisher
        </label>
        <input
          type="text"
          {...register("publisher")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Publication Date */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Publication Date
        </label>
        <input
          type="date"
          {...register("publicationDate")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Language
        </label>
        <input
          type="text"
          {...register("language")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Genre
        </label>
        <input
          type="text"
          {...register("genre")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Cover Image URL
        </label>
        <input
          type="url"
          {...register("coverImageUrl")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* ISBN-10 */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          ISBN-10
        </label>
        <input
          type="text"
          {...register("isbn10")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* ISBN-13 */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          ISBN-13
        </label>
        <input
          type="text"
          {...register("isbn13")}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Page Count */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Page Count
        </label>
        <input
          type="number"
          {...register("pageCount", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Issue Number */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Issue Number
        </label>
        <input
          type="number"
          {...register("issueNumber", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Volume */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Volume
        </label>
        <input
          type="number"
          {...register("volume", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 text-white rounded-lg
                     transition-all duration-200"
        >
          Save Media
        </button>
      </div>
    </form>
  );
}