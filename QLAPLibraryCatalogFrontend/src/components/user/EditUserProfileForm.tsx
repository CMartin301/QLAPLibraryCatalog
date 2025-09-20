// components/UserProfile/EditUserProfileForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserProfile, CreateOrUpdateUserProfile } from '../../types/userProfile';
import Button from '../shared/Button';
import { Save, X } from 'lucide-react';

// Extended form data for future implementation
interface ExtendedProfileFormData extends CreateOrUpdateUserProfile {
  pronouns?: string;
  location?: string;
}

interface EditUserProfileFormProps {
  profile: UserProfile & {
    pronouns?: string;
    location?: string;
  };
  onSubmit: (data: ExtendedProfileFormData) => Promise<UserProfile>;
  onCancel: () => void;
}

const pronounOptions = [
  { value: '', label: 'Not specified' },
  { value: 'he/him', label: 'he/him' },
  { value: 'she/her', label: 'she/her' },
  { value: 'they/them', label: 'they/them' },
  { value: 'he/they', label: 'he/they' },
  { value: 'she/they', label: 'she/they' },
  { value: 'other', label: 'Other' }
];

function EditUserProfileForm({ profile, onSubmit, onCancel }: EditUserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ExtendedProfileFormData>({
    defaultValues: {
      profileDescription: profile.profileDescription || '',
      pronouns: profile.pronouns || '',
      location: profile.location || ''
    }
  });

  const handleFormSubmit: SubmitHandler<ExtendedProfileFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit(data);
      // Success handled by parent component (modal closes)
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSubmitError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch the description field to show character count
  const descriptionValue = watch('profileDescription', '');
  const descriptionLength = descriptionValue?.length || 0;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Error Banner */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
          Personal Information
        </h3>
        
        {/* Pronouns */}
        <div>
          <label 
            htmlFor="pronouns" 
            className="block text-sm font-medium text-[var(--color-muted)] mb-2"
          >
            Pronouns
          </label>
          <select
            id="pronouns"
            {...register('pronouns')}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                       disabled:opacity-50 disabled:bg-gray-50"
            disabled={isSubmitting}
          >
            {pronounOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Help others know how to refer to you
          </p>
        </div>

        {/* Location */}
        <div>
          <label 
            htmlFor="location" 
            className="block text-sm font-medium text-[var(--color-muted)] mb-2"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location', {
              maxLength: { 
                value: 100, 
                message: 'Location must be less than 100 characters' 
              }
            })}
            placeholder="e.g., Seattle, WA"
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                       disabled:opacity-50 disabled:bg-gray-50"
            disabled={isSubmitting}
            aria-describedby={errors.location ? 'location-error' : undefined}
            aria-invalid={errors.location ? 'true' : 'false'}
          />
          {errors.location && (
            <p id="location-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.location.message}
            </p>
          )}
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Your general location (city, state/region)
          </p>
        </div>
      </div>

      {/* About Me Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
          About Me
        </h3>
        
        <div>
          <label 
            htmlFor="profileDescription" 
            className="block text-sm font-medium text-[var(--color-muted)] mb-2"
          >
            Description
          </label>
          <textarea
            id="profileDescription"
            rows={6}
            {...register('profileDescription', {
              maxLength: { 
                value: 1000, 
                message: 'Profile description must be less than 1000 characters' 
              }
            })}
            placeholder="Tell others about yourself, your interests, favorite books, or what kinds of books you enjoy reading and lending..."
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                       disabled:opacity-50 disabled:bg-gray-50 resize-none"
            disabled={isSubmitting}
            aria-describedby={errors.profileDescription ? 'profileDescription-error' : 'profileDescription-help'}
            aria-invalid={errors.profileDescription ? 'true' : 'false'}
          />
          {errors.profileDescription && (
            <p id="profileDescription-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.profileDescription.message}
            </p>
          )}
          
          {/* Character count */}
          <div className="flex justify-between items-center mt-1">
            <p id="profileDescription-help" className="text-xs text-[var(--color-muted)]">
              Share your reading interests and personality
            </p>
            <p className={`text-xs ${descriptionLength > 900 ? 'text-amber-600' : 'text-[var(--color-muted)]'}`}>
              {descriptionLength}/1000
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
        <Button
          type="button"
          variant="secondary"
          size="md"
          icon={X}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Save}
          loading={isSubmitting}
          disabled={!isDirty}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

export default EditUserProfileForm;