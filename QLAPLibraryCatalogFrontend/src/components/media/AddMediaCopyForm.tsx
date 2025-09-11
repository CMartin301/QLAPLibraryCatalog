import { useForm } from 'react-hook-form';
import { CreateMediaCopyRequest, Media } from '../../types/media';
import useAuth from '../../hooks/useAuth';
import Button from '../shared/Button';

interface AddMediaCopyFormProps {
  onSubmit: (data: CreateMediaCopyRequest) => void;
  isSubmitting: boolean;
  submitError: string | null;
  preselectedMedia?: Media;
}

export function AddMediaCopyForm({ onSubmit, isSubmitting, submitError, preselectedMedia }: AddMediaCopyFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateMediaCopyRequest>({
    defaultValues: {
      condition: 'Good',
      maxLoanDays: 14,
      requiresApproval: false,
    }
  });
  const { userID } = useAuth();

  const handleFormSubmit = (data: CreateMediaCopyRequest) => {
    if (!preselectedMedia || !userID) return;

    const submitData = {
      ...data,
      mediaId: preselectedMedia.mediaId,
      userId: userID,
    };

    onSubmit(submitData);
    reset();
  };

  if (!preselectedMedia) {
    return <div className="text-red-600">No media selected</div>;
  }

  return (
    <div className="space-y-6">
      {/* Media Info Display */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {preselectedMedia.title}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div><span className="font-medium">Author:</span> {preselectedMedia.creator || 'Unknown'}</div>
          <div><span className="font-medium">Genre:</span> {preselectedMedia.genre || 'N/A'}</div>
          {preselectedMedia.publisher && (
            <div><span className="font-medium">Publisher:</span> {preselectedMedia.publisher}</div>
          )}
          {preselectedMedia.publicationDate && (
            <div><span className="font-medium">Published:</span> {preselectedMedia.publicationDate}</div>
          )}
        </div>
      </div>

      {/* Copy Details Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition <span className="text-red-500">*</span>
          </label>
          <select
            {...register('condition', { required: 'Condition is required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
          >
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Loan Days <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="365"
            {...register('maxLoanDays', { 
              required: 'Max loan days is required',
              min: { value: 1, message: 'Must be at least 1 day' },
              max: { value: 365, message: 'Cannot exceed 365 days' }
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="requiresApproval"
            {...register('requiresApproval')}
            className="rounded border-gray-300 text-lavender-500 focus:ring-lavender-500"
          />
          <label htmlFor="requiresApproval" className="text-sm font-medium text-gray-700">
            Requires approval before lending
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Any additional notes about this copy..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 resize-none"
          />
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Adding to Collection...' : 'Add to My Collection'}
        </Button>
      </form>
    </div>
  );
}