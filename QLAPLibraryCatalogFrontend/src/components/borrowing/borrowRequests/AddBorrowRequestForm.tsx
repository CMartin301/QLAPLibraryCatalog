import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { CreateBorrowRequestDto } from "../../../types/borrowRequests";
import { borrowRequestService } from "../../../services/borrowRequestService";
import { Media, MediaCopyDto, MediaDto } from "../../../types/media";
import { CopyDisplay } from "../../shared/CopyDisplay";
import { ErrorAlert, FormFieldError, SubmitError } from '../../shared/ErrorAlert';
import { MediaDisplay } from '../../shared/MediaDisplay';

interface BorrowRequestFormData {
  borrowerId: number;
  message?: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
}

interface AddBorrowRequestFormProps {
  copyId: number | undefined; 
  borrowerId: number;
  selectedMedia: MediaDto | undefined;
  availableCopies: MediaCopyDto[];  
  onCopySelect: (copyId: number) => void; 
  onSubmit: (data: BorrowRequestFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function AddBorrowRequestForm({ 
  copyId, 
  borrowerId, 
  selectedMedia,
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

    // // Enterprise safety check - verify the copy is still available
    // const selectedCopy = availableCopies.find(c => c.copyId === copyId);
    // if (!selectedCopy?.isAvailable) {
    //   setError('root', {
    //     type: 'validation',
    //     message: 'Selected copy is no longer available. Please choose another.'
    //   });
    //   return;
    // }

    try {
      // Convert form data to API format
      const requestData: CreateBorrowRequestDto = {
        borrowerId: data.borrowerId,
        copyId: copyId,
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

  const handleCopySelection = (selectedCopyId: number) => {
    onCopySelect(selectedCopyId);
    clearErrors('root');
    setIsCopySelectionExpanded(false);
  };

  const handleKeyboardCopySelection = (e: React.KeyboardEvent, selectedCopyId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopySelection(selectedCopyId);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  const displayedCopies = isCopySelectionExpanded || !copyId 
    ? availableCopies 
    : availableCopies.filter(c => c.copyId === copyId);

  return (
    <form 
      onSubmit={handleSubmit(submitHandler)} 
      className="space-y-4"
      aria-labelledby="borrow-request-title"
      noValidate
    >
      <SubmitError message={submitError} />
      <ErrorAlert message={errors.root?.message} variant="validation" />

      {selectedMedia && (<MediaDisplay media={selectedMedia} variant="compact" />)}
            

      {/* Copy Selection */}
      {availableCopies.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="sr-only">Available copies for borrowing</legend>
          
          {/* Header with toggle */}
          <div className="flex items-center justify-between">
            <label 
              id="copy-selection-label" 
              className="block text-sm font-medium text-gray-700"
            >
              Choose a Copy <span className="text-red-500">*</span>
            </label>
            
            {copyId && (
              <button
                type="button"
                onClick={() => setIsCopySelectionExpanded(!isCopySelectionExpanded)}
                className="flex items-center gap-1 text-sm text-lavender-600 hover:text-lavender-700 
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-1 rounded-md px-2 py-1"
                aria-expanded={isCopySelectionExpanded}
                aria-controls="copy-selection-options"
              >
                {isCopySelectionExpanded ? (
                  <><ChevronUp className="w-4 h-4" />Hide Options</>
                ) : (
                  <><ChevronDown className="w-4 h-4" />Change Selection</>
                )}
              </button>
            )}
          </div>

          {/* Copy options */}
          <div 
            id="copy-selection-options"
            className="grid grid-cols-1 gap-3"
            role="radiogroup"
            aria-labelledby="copy-selection-label"
            aria-required="true"
          >
            {displayedCopies.map((copy, index) => (
              <div
                key={copy.copyId}
                role="radio"
                tabIndex={copyId === copy.copyId ? 0 : -1}
                aria-checked={copyId === copy.copyId}
                onClick={() => handleCopySelection(copy.copyId)}
                onKeyDown={(e) => handleKeyboardCopySelection(e, copy.copyId)}
                className={`focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2 rounded-lg ${
                  !isCopySelectionExpanded && copyId ? '' : 'cursor-pointer'
                }`}
                aria-describedby={`copy-${copy.copyId}-description`}
              >
                <CopyDisplay
                  copy={copy}
                  variant={"selection"}
                  selected={copyId === copy.copyId}
                  showSelection={true}
                  className={copyId === copy.copyId && !isCopySelectionExpanded ? "border-lavender-200 bg-lavender-50" : ""}
                />
                <div id={`copy-${copy.copyId}-description`} className="sr-only">
                  Copy owned by {copy.ownerUsername}, condition: {copy.condition}
                </div>
              </div>
            ))}
          </div>

          {/* Error message */}
          {!copyId && (
            <div 
              className="flex items-center gap-2 text-red-500 text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Please select a copy to continue</span>
            </div>
          )}
        </fieldset>
      )}

      {/* Hidden field for borrowerId */}
      <input type="hidden" {...register("borrowerId", { valueAsNumber: true })} />

      {/* Date Range */}
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <legend className="sr-only">Loan period preferences</legend>
        
        {/* Requested Start Date */}
        <div>
          <label htmlFor="requestedStartDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                now.setHours(0, 0, 0, 0);
                return startDate >= now || "Start date cannot be in the past";
              }
            })}
            aria-describedby={errors.requestedStartDate ? "startDate-error" : undefined}
            aria-invalid={errors.requestedStartDate ? "true" : "false"}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:border-2 focus:border-lavender-400"
          />
          <FormFieldError 
            message={errors.requestedStartDate?.message} 
            fieldId="requestedStartDate" 
          />
        </div>

        {/* Requested End Date */}
        <div>
          <label htmlFor="requestedEndDate" className="block text-sm font-medium text-gray-700 mb-1">
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
          <FormFieldError 
            message={errors.requestedEndDate?.message} 
            fieldId="requestedEndDate" 
          />
        </div>
      </fieldset>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message to Owner (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Any additional information or special requests..."
          {...register("message", {
            maxLength: { value: 500, message: "Message must be less than 500 characters" }
          })}
          aria-describedby={errors.message ? "message-error" : "message-help"}
          aria-invalid={errors.message ? "true" : "false"}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:border-2 focus:border-lavender-400
                     resize-y"
        />
        <FormFieldError 
          message={errors.message?.message} 
          fieldId="message" 
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !copyId}
          className="py-2 px-4 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300 
                     disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2
                     flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? 'Submitting Request...' : 'Submit Borrow Request'}
        </button>
      </div>
    </form>
  );
}