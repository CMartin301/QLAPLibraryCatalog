import { useForm, SubmitHandler } from "react-hook-form";
import { CreateBorrowRequestDto } from "../../../types/borrowRequests";
import { borrowRequestService } from "../../../services/borrowRequestService";
import { MediaCopyDisplay } from "../../../types/media";
import { CopyDisplay } from "../../shared/CopyDisplay";
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { useState } from "react";

interface BorrowRequestFormData {
  borrowerId: number;
  message?: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
}

interface AddBorrowRequestFormProps {
  copyId: number | undefined; 
  borrowerId: number;
  availableCopies: MediaCopyDisplay[];  
  onCopySelect: (copyId: number) => void; 
  onSubmit: (data: BorrowRequestFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddBorrowRequestForm({ 
  copyId, 
  borrowerId, 
  availableCopies,
  onCopySelect,
  onSubmit, 
  isSubmitting = false, 
  submitError 
}: AddBorrowRequestFormProps) {
const [isCopySelectionExpanded, setIsCopySelectionExpanded] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,  
    clearErrors,
  } = useForm<BorrowRequestFormData>({
    defaultValues: {
      borrowerId,
    }
  });

  const submitHandler: SubmitHandler<BorrowRequestFormData> = async (data) => {
    // Validate copyId before submission
    if (!copyId) {
      setError('root', { 
        type: 'required', 
        message: 'Please select a copy before submitting' 
      });
      return;
    }

    try {
      // Convert form data to API format
      const requestData: CreateBorrowRequestDto = {
        borrowerId: data.borrowerId,
        copyId: copyId, // Use the copyId from props
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

      {/* Root-level form errors (like copy selection) */}
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{errors.root.message}</p>
        </div>
      )}
{/* Copy Selection */}
{availableCopies.length > 0 && (
  <div className="space-y-3">
    {/* Header with toggle */}
    <div className="flex items-center justify-between">
      <label className="block text-sm font-medium text-gray-700">
        Choose a Copy <span className="text-red-500">*</span>
      </label>
      
      {copyId && (
        <button
          type="button"
          onClick={() => setIsCopySelectionExpanded(!isCopySelectionExpanded)}
          className="flex items-center gap-1 text-sm text-lavender-600 hover:text-lavender-700 
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-1 rounded-md px-2 py-1"
          aria-expanded={isCopySelectionExpanded}
        >
          {isCopySelectionExpanded ? (
            <><ChevronUp className="w-4 h-4" />Hide Options</>
          ) : (
            <><ChevronDown className="w-4 h-4" />Change Selection</>
          )}
        </button>
      )}
    </div>

    {/* Copy display */}
    <div className="grid grid-cols-1 gap-3">
      {(isCopySelectionExpanded || !copyId ? availableCopies : availableCopies.filter(c => c.copyId === copyId))
        .map((copy) => (
          <CopyDisplay
            key={copy.copyId}
            copy={copy}
            variant={"selection"}
            selected={copyId === copy.copyId}
            onClick={!isCopySelectionExpanded && copyId ? undefined : () => {
              onCopySelect(copy.copyId);
              clearErrors('root');
              setIsCopySelectionExpanded(false);
            }}
            showSelection={true}
            className={copyId === copy.copyId && !isCopySelectionExpanded ? "border-lavender-200 bg-lavender-50" : ""}
          />
        ))}
    </div>

    {/* Error message */}
    {!copyId && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Please select a copy to continue</span>
      </div>
    )}
  </div>
)}

      {/* Hidden field for borrowerId only */}
      <input type="hidden" {...register("borrowerId", { valueAsNumber: true })} />

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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
           focus:outline-none focus:border-2 focus:border-lavender-400"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
           focus:outline-none focus:border-2 focus:border-lavender-400"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
           focus:outline-none focus:border-2 focus:border-lavender-400
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
  disabled={isSubmitting || !copyId}
  className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
             disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2
             flex items-center gap-2" // Add flex for loading spinner
>
  {isSubmitting && (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )}
  {isSubmitting ? 'Submitting Request...' : 'Submit Borrow Request'}
</button>
        {/* <button
          type="submit"
          disabled={isSubmitting || !copyId}
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
                     disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Borrow Request'}
        </button> */}
      </div>
    </form>
  );
}