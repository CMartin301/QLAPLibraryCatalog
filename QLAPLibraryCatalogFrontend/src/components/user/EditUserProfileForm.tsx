// components/UserProfile/EditUserProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserProfile, CreateOrUpdateUserProfile, UserPronoun, PronounSet, CreatePronounSet } from '../../types/userProfile';
import { userProfileService } from '../../services/userProfileService';
import Button from '../shared/Button';
import { StatusBadge } from '../shared/StatusBadge';
import { Save, X, Plus, Trash2 } from 'lucide-react';

// Extended form data for future implementation
interface ExtendedProfileFormData extends CreateOrUpdateUserProfile {
  location?: string;
}

interface EditUserProfileFormProps {
  profile: UserProfile & {
    location?: string;
  };
  onSubmit: (data: ExtendedProfileFormData) => Promise<UserProfile>;
  onCancel: () => void;
}

function EditUserProfileForm({ profile, onSubmit, onCancel }: EditUserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Pronoun-related state
  const [commonPronouns, setCommonPronouns] = useState<PronounSet[]>([]);
  const [selectedPronouns, setSelectedPronouns] = useState<UserPronoun[]>([]);
  const [customPronounText, setCustomPronounText] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [pronounsLoading, setPronounsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ExtendedProfileFormData>({
    defaultValues: {
      profileDescription: profile.profileDescription || '',
      location: profile.location || ''
    }
  });

  // Load common pronouns and user's current pronouns
  useEffect(() => {
    loadPronounData();
  }, []);

  const loadPronounData = async () => {
    try {
      setPronounsLoading(true);
      const [commonPronounsData, userPronounsData] = await Promise.all([
        userProfileService.getCommonPronouns(),
        userProfileService.getMyPronouns()
      ]);
      
      setCommonPronouns(commonPronounsData);
      setSelectedPronouns(userPronounsData || profile.userPronouns || []);
    } catch (error) {
      console.error('Failed to load pronoun data:', error);
      // Fallback to profile data if available
      setSelectedPronouns(profile.userPronouns || []);
    } finally {
      setPronounsLoading(false);
    }
  };

  const handleAddPronoun = (pronoun: PronounSet) => {
    // Check if pronoun is already selected
    const isAlreadySelected = selectedPronouns.some(p => p.pronounId === pronoun.pronounId);
    if (isAlreadySelected) return;

    const newPronoun: UserPronoun = {
      pronounId: pronoun.pronounId,
      pronounText: pronoun.pronounText,
      displayOrder: selectedPronouns.length
    };

    setSelectedPronouns([...selectedPronouns, newPronoun]);
  };

  const handleRemovePronoun = (pronounId: number) => {
    const updatedPronouns = selectedPronouns
      .filter(p => p.pronounId !== pronounId)
      .map((p, index) => ({ ...p, displayOrder: index })); // Reorder
    
    setSelectedPronouns(updatedPronouns);
  };

  const handleCreateCustomPronoun = async () => {
    if (!customPronounText.trim()) return;

    try {
      const newPronounSet = await userProfileService.createCustomPronoun({ 
        pronounText: customPronounText.trim() 
      });
      
      // Add to common pronouns list
      setCommonPronouns([...commonPronouns, newPronounSet]);
      
      // Add to selected pronouns
      handleAddPronoun(newPronounSet);
      
      // Reset custom input
      setCustomPronounText('');
      setIsAddingCustom(false);
    } catch (error) {
      console.error('Failed to create custom pronoun:', error);
      setSubmitError('Failed to create custom pronoun. Please try again.');
    }
  };

  const handleReorderPronoun = (index: number, direction: 'up' | 'down') => {
    const newPronouns = [...selectedPronouns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPronouns.length) return;
    
    // Swap positions
    [newPronouns[index], newPronouns[targetIndex]] = [newPronouns[targetIndex], newPronouns[index]];
    
    // Update display orders
    newPronouns.forEach((pronoun, idx) => {
      pronoun.displayOrder = idx;
    });
    
    setSelectedPronouns(newPronouns);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    const newPronouns = [...selectedPronouns];
    const draggedPronoun = newPronouns[dragIndex];
    
    // Remove from original position
    newPronouns.splice(dragIndex, 1);
    
    // Insert at new position
    newPronouns.splice(dropIndex, 0, draggedPronoun);
    
    // Update display orders
    newPronouns.forEach((pronoun, idx) => {
      pronoun.displayOrder = idx;
    });
    
    setSelectedPronouns(newPronouns);
  };

  const handleFormSubmit: SubmitHandler<ExtendedProfileFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Update profile
      await onSubmit(data);
      
      // Update pronouns if they've changed
      const currentPronounIds = (profile.userPronouns || []).map(p => p.pronounId).sort();
      const selectedPronounIds = selectedPronouns.map(p => p.pronounId).sort();
      const pronounsChanged = JSON.stringify(currentPronounIds) !== JSON.stringify(selectedPronounIds);
      
      if (pronounsChanged || selectedPronouns.some((p, index) => p.displayOrder !== index)) {
        await userProfileService.updateMyPronouns({
          pronouns: selectedPronouns
        });
      }
      
      // Success handled by parent component (modal closes)
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSubmitError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has changes (including pronouns)
  const hasChanges = isDirty || 
    JSON.stringify((profile.userPronouns || []).map(p => p.pronounId).sort()) !== 
    JSON.stringify(selectedPronouns.map(p => p.pronounId).sort());

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
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
            Pronouns
          </label>
          
          {pronounsLoading ? (
            <div className="text-sm text-[var(--color-muted)]">Loading pronouns...</div>
          ) : (
            <div className="space-y-3">
              {/* Selected Pronouns */}
              {selectedPronouns.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-[var(--color-muted)]">Selected pronouns (drag to reorder or use arrow buttons):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPronouns.map((pronoun, index) => (
                      <div
                        key={pronoun.pronounId}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="relative group cursor-move"
                      >
                        <StatusBadge 
                          config={{
                            text: pronoun.pronounText,
                            color: 'purple',
                            icon: undefined
                          }}
                          size="lg"
                        />
                        
                        {/* Control buttons - only show on hover */}
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-0.5 bg-white rounded border shadow-sm">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleReorderPronoun(index, 'up')}
                                className="p-0.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-gray-100"
                                title="Move up"
                              >
                                ↑
                              </button>
                            )}
                            {index < selectedPronouns.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleReorderPronoun(index, 'down')}
                                className="p-0.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-gray-100"
                                title="Move down"
                              >
                                ↓
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePronoun(pronoun.pronounId)}
                              className="p-0.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Remove"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Available Common Pronouns */}
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-2">Add from common options:</p>
                <div className="flex flex-wrap gap-2">
                  {commonPronouns
                    .filter(pronoun => !selectedPronouns.some(p => p.pronounId === pronoun.pronounId))
                    .map(pronoun => (
                      <button
                        key={pronoun.pronounId}
                        type="button"
                        onClick={() => handleAddPronoun(pronoun)}
                        className="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        + {pronoun.pronounText}
                      </button>
                    ))}
                </div>
              </div>
              
              {/* Custom Pronoun Input */}
              <div>
                {!isAddingCustom ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(true)}
                    className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                  >
                    <Plus size={14} />
                    Add custom pronouns
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPronounText}
                      onChange={(e) => setCustomPronounText(e.target.value)}
                      placeholder="e.g., xe/xem"
                      className="flex-1 px-3 py-1 text-sm border border-[var(--color-border)] rounded
                                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateCustomPronoun();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleCreateCustomPronoun}
                      disabled={!customPronounText.trim()}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setIsAddingCustom(false);
                        setCustomPronounText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Select multiple pronouns if you use them. They'll be displayed in the order shown above.
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
          disabled={!hasChanges}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

export default EditUserProfileForm;