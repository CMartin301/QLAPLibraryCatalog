// components/forms/AddBorrowRequestForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateBorrowRequestDto } from "../../types/borrowRequests";
import { borrowRequestService } from "../../services/borrowRequestService";

interface BorrowRequestFormData {
  borrowerId: number;
  copyId: number;
  message?: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
}

interface AddBorrowRequestFormProps {
  copyId: number;
  borrowerId: number;
  onSubmit: (data: BorrowRequestFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddBorrowRequestForm({ 
  copyId, 
  borrowerId, 
  onSubmit, 
  isSubmitting = false, 
  submitError 
}: AddBorrowRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BorrowRequestFormData>({
    defaultValues: {
      borrowerId,
      copyId,
    }
  });

  const submitHandler: SubmitHandler<BorrowRequestFormData> = async (data) => {
    try {
      // Convert form data to API format
      const requestData: CreateBorrowRequestDto = {
        borrowerId: data.borrowerId,
        copyId: data.copyId,
        message: data.message || undefined,
        requestedStartDate: data.requestedStartDate || undefined,
        requestedEndDate: data.requestedEndDate || undefined,
      };

      await borrowRequestService.createBorrowRequest(requestData);
      onSubmit(data); // Call parent callback for success handling
    } catch (error) {
      throw error; // Let parent handle the error
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Error Banner */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Hidden fields for IDs */}
      <input type="hidden" {...register("borrowerId", { valueAsNumber: true })} />
      <input type="hidden" {...register("copyId", { valueAsNumber: true })} />

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requested Start Date */}
        <div>
          <label htmlFor="requestedStartDate" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Requested Start Date
          </label>
          <input
            id="requestedStartDate"
            type="date"
            min={today}
            {...register("requestedStartDate", {
              validate: (value) => {
                if (!value) return true;
                const startDate = new Date(value);
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Reset time for fair comparison
                return startDate >= now || "Start date cannot be in the past";
              }
            })}
            aria-describedby={errors.requestedStartDate ? "startDate-error" : undefined}
            aria-invalid={errors.requestedStartDate ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.requestedStartDate && (
            <p id="startDate-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.requestedStartDate.message}
            </p>
          )}
        </div>

        {/* Requested End Date */}
        <div>
          <label htmlFor="requestedEndDate" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Requested End Date
          </label>
          <input
            id="requestedEndDate"
            type="date"
            min={today}
            {...register("requestedEndDate", {
              validate: (value, formValues) => {
                if (!value) return true;
                if (!formValues.requestedStartDate) return true;
                
                const startDate = new Date(formValues.requestedStartDate);
                const endDate = new Date(value);
                return endDate >= startDate || "End date must be after start date";
              }
            })}
            aria-describedby={errors.requestedEndDate ? "endDate-error" : undefined}
            aria-invalid={errors.requestedEndDate ? "true" : "false"}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          {errors.requestedEndDate && (
            <p id="endDate-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.requestedEndDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-muted)] mb-1">
          Message to Owner (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Any additional information or special requests..."
          {...register("message", {
            maxLength: { value: 500, message: "Message must be less than 500 characters" }
          })}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={errors.message ? "true" : "false"}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                     resize-y"
        />
        {errors.message && (
          <p id="message-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
                     disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Borrow Request'}
        </button>
      </div>
    </form>
  );
}