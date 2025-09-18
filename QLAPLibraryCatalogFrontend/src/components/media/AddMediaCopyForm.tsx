import { useForm } from 'react-hook-form';
import { CreateMediaCopyRequest, MediaDto } from '../../types/media';
import useAuth from '../../hooks/useAuth';
import Button from '../shared/Button';
import { MediaDisplay } from '../shared/displays/MediaDisplay';

interface AddMediaCopyFormProps {
  onSubmit: (data: CreateMediaCopyRequest) => void;
  isSubmitting: boolean;
  submitError: string | undefined;
  preselectedMedia?: MediaDto;
}

export function AddMediaCopyForm({ onSubmit, isSubmitting, submitError, preselectedMedia }: AddMediaCopyFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateMediaCopyRequest>({
    defaultValues: {
      condition: 'Good',
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
      <MediaDisplay media={preselectedMedia} variant="compact" />

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