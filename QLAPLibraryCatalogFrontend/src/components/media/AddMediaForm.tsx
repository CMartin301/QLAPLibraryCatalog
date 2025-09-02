// components/forms/AddMediaForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface MediaFormData {
  title: string;
  creator: string;
  genre: string;
}

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
