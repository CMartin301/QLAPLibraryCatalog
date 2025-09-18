import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MediaFormData, MediaType } from "../../types/media";
import { mediaService } from "../../services/mediaService";
import { Select } from "../shared/Select";
import Button from "../shared/Button";
import { TagFormData } from "../../types/tags";

interface AddTagFormProps {
  onSubmit: (data: TagFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddTagForm({ onSubmit, isSubmitting = false, submitError }: AddTagFormProps) {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [mediaTypesError, setMediaTypesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control, // Add this for Controller
    reset,
    formState: { errors },
  } = useForm<TagFormData>();

  const submitHandler: SubmitHandler<TagFormData> = (data) => {
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

        <div>
          <label htmlFor="tag-name" className="block text-sm font-Media text-[var(--color-muted)] mb-1">
            Tag Name
          </label>
          <input
            id="tag-name"
            type="text"
            {...register("tagName", { 
              required: "Tag name is required",
              minLength: { value: 1, message: "Tag name cannot be empty" },
              maxLength: { value: 255, message: "Tag name must be less than 255 characters" }
            })}
            aria-describedby={errors.tagName ? "tag-name-error" : undefined}
            aria-invalid={errors.tagName ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.tagName && (
            <p id="tag-name-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.tagName.message}
            </p>
          )}
        </div>
      </div>


      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Tag'}
        </Button>
      </div>
    </form>
  );
}