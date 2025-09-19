// Create a new file: components/media/EditCopyForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../shared/Button";
import { MediaCopyDto } from "../../types/media";

// Define the editable fields - following your existing patterns
interface EditCopyFormData {
  condition: string;
  notes?: string;
  // Add other editable fields as needed
}

interface EditCopyFormProps {
  copy: MediaCopyDto;
  onSubmit: (data: EditCopyFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function EditCopyForm({ 
  copy, 
  onSubmit, 
  onCancel, 
  isSubmitting = false, 
  submitError 
}: EditCopyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditCopyFormData>({
    defaultValues: {
      condition: copy.condition,
      notes: copy.notes || '',
    }
  });

  const submitHandler: SubmitHandler<EditCopyFormData> = (data) => {
    onSubmit(data);
  };

  // Condition options - you may want to move this to a constant file
  const conditionOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' },
  ];

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Error Banner */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Condition Field */}
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
          Condition <span className="text-red-500">*</span>
        </label>
        <select
          id="condition"
          {...register("condition", { 
            required: "Condition is required" 
          })}
          aria-describedby={errors.condition ? "condition-error" : undefined}
          aria-invalid={errors.condition ? "true" : "false"}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
        >
          {conditionOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.condition && (
          <p id="condition-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.condition.message}
          </p>
        )}
      </div>

      {/* Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes", {
            maxLength: { value: 500, message: "Notes must be less than 500 characters" }
          })}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          aria-invalid={errors.notes ? "true" : "false"}
          placeholder="Add any notes about this copy..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
        />
        {errors.notes && (
          <p id="notes-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          disabled={!isDirty} // Only enable if form has changes
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}