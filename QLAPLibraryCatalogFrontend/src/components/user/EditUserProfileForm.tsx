// components/UserProfile/EditUserProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserProfile, CreateOrUpdateUserProfile, UserPronoun, PronounSet, CreatePronounSet } from '../../types/userProfile';
import { userProfileService } from '../../services/userProfileService';
import Button from '../shared/Button';
import { StatusBadge } from '../shared/StatusBadge';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { TagDto } from '../../types/tags';
import { tagService } from '../../services/tagService';

// Extended form data for future implementation
interface ExtendedProfileFormData extends CreateOrUpdateUserProfile {
}

interface EditUserProfileFormProps {
  profile: UserProfile 
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
  const [isEditingPronounOrder, setIsEditingPronounOrder] = useState(false);

  // Tag-related state
const [allTags, setAllTags] = useState<TagDto[]>([]);
const [selectedTags, setSelectedTags] = useState<TagDto[]>([]);
const [tagsLoading, setTagsLoading] = useState(true);


const loadTagData = async () => {
  try {
    setTagsLoading(true);
    const [allTagsData, userTagsData] = await Promise.all([
      tagService.getTags(),
      userProfileService.getMyTags()
    ]);
    
    setAllTags(allTagsData);
    setSelectedTags(userTagsData || profile.userTags || []);
  } catch (error) {
    console.error('Failed to load tag data:', error);
    setSelectedTags(profile.userTags || []);
  } finally {
    setTagsLoading(false);
  }
};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ExtendedProfileFormData>({
    defaultValues: {
      profileDescription: profile.profileDescription || ''
    }
  });

  // Load common pronouns and user's current pronouns
  useEffect(() => {
    loadPronounData();
    loadTagData();
  }, []);

  const handleAddTag = (tag: TagDto) => {
  const isAlreadySelected = selectedTags.some(t => t.tagId === tag.tagId);
  if (isAlreadySelected) return;
  setSelectedTags([...selectedTags, tag]);
};

const handleRemoveTag = (tagId: number) => {
  setSelectedTags(selectedTags.filter(t => t.tagId !== tagId));
};

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
    
// Update tags if they've changed
const currentTagIds = (profile.userTags || []).map(t => t.tagId).sort();
const selectedTagIds = selectedTags.map(t => t.tagId).sort();
const tagsChanged = JSON.stringify(currentTagIds) !== JSON.stringify(selectedTagIds);

if (tagsChanged) {
  // Remove tags that are no longer selected
  const tagsToRemove = currentTagIds.filter(id => !selectedTagIds.includes(id));
  for (const tagId of tagsToRemove) {
    await userProfileService.removeTagFromMyProfile(tagId);
  }
  
  // Add new tags
  const tagsToAdd = selectedTagIds.filter(id => !currentTagIds.includes(id));
  for (const tagId of tagsToAdd) {
    await userProfileService.addTagToMyProfile(tagId);
  }
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
// Check if form has changes (including pronouns and tags)
const hasChanges = isDirty || 
  JSON.stringify((profile.userPronouns || []).map(p => p.pronounId).sort()) !== 
  JSON.stringify(selectedPronouns.map(p => p.pronounId).sort()) ||
  JSON.stringify((profile.userTags || []).map(t => t.tagId).sort()) !== 
  JSON.stringify(selectedTags.map(t => t.tagId).sort());
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
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setIsEditingPronounOrder(!isEditingPronounOrder)}
        className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline"
      >
        {isEditingPronounOrder ? 'Done editing order' : 'Edit order'}
      </button>
    </div>
    
    <div className="flex flex-wrap gap-2">
      {selectedPronouns.map((pronoun, index) => (
        <div key={pronoun.pronounId} className="relative inline-flex items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-lavender-100 text-lavender-500 pr-8">
            {/* Show order number only in edit mode */}
            {isEditingPronounOrder && (
              <select
                value={index}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value);
                  if (newIndex === index) return;
                  
                  const newPronouns = [...selectedPronouns];
                  const [movedPronoun] = newPronouns.splice(index, 1);
                  newPronouns.splice(newIndex, 0, movedPronoun);
                  
                  // Update display orders
                  newPronouns.forEach((p, idx) => {
                    p.displayOrder = idx;
                  });
                  
                  setSelectedPronouns(newPronouns);
                }}
                className="text-xs bg-transparent border-none mr-2 w-8 text-lavender-600 font-medium
                           focus:outline-none cursor-pointer"
              >
                {selectedPronouns.map((_, idx) => (
                  <option key={idx} value={idx}>
                    {idx + 1}
                  </option>
                ))}
              </select>
            )}
            
            {/* Pronoun Text */}
            {pronoun.pronounText}
            
            {/* Remove Button - always visible */}
            <button
              type="button"
              onClick={() => handleRemovePronoun(pronoun.pronounId)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lavender-700 hover:text-red-600 
                         transition-colors w-4 h-4 flex items-center justify-center text-sm font-bold"
              title="Remove this pronoun"
            >
              ×
            </button>
          </span>
        </div>
      ))}
    </div>
    
    <p className="text-xs text-[var(--color-muted)]">
      {isEditingPronounOrder 
        ? 'Click the numbers to change display order. Click "Done editing order" when finished.'
        : ''
        // : 'Click × to remove pronouns, or "Edit order" to change the display sequence.'
      }
    </p>
  </div>
)}
              {/* Available Pronouns Dropdown */}
<div className="flex gap-2">
  <select
    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
    onChange={(e) => {
      const pronounId = parseInt(e.target.value);
      const pronoun = commonPronouns.find(p => p.pronounId === pronounId);
      if (pronoun) {
        handleAddPronoun(pronoun);
        e.target.value = ''; // Reset dropdown
      }
    }}
    defaultValue=""
  >
    <option value="" disabled>Select pronouns to add...</option>
    {commonPronouns
      .filter(pronoun => !selectedPronouns.some(p => p.pronounId === pronoun.pronounId))
      .map(pronoun => (
        <option key={pronoun.pronounId} value={pronoun.pronounId}>
          {pronoun.pronounText}
        </option>
      ))}
  </select>
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
            <p className={`text-xs ${descriptionLength > 900 ? 'text-amber-600' : 'text-[var(--color-muted)]'}`}>
              {descriptionLength}/1000
            </p>
          </div>
        </div>
      </div>

      {/* User Interests Tags */}
<div>
  <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
    Interests & Tags
  </label>
  
  {tagsLoading ? (
    <div className="text-sm text-[var(--color-muted)]">Loading tags...</div>
  ) : (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
  <div key={tag.tagId} className="relative inline-flex items-center">
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 pr-8">
      {/* Tag Name */}
      {tag.tagName}
      
      {/* Remove Button */}
      <button
        type="button"
        onClick={() => handleRemoveTag(tag.tagId)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-700 hover:text-red-600 
                   transition-colors w-4 h-4 flex items-center justify-center text-sm font-bold"
        title="Remove this tag"
      >
        ×
      </button>
    </span>
  </div>
))}
          </div>
        </div>
      )}
      
      {/* Available Tags Dropdown */}
      <div className="flex gap-2">
        <select
          className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          onChange={(e) => {
            const tagId = parseInt(e.target.value);
            const tag = allTags.find(t => t.tagId === tagId);
            if (tag) {
              handleAddTag(tag);
              e.target.value = ''; // Reset dropdown
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Select an interest to add...</option>
          {allTags
            .filter(tag => !selectedTags.some(t => t.tagId === tag.tagId))
            .map(tag => (
              <option key={tag.tagId} value={tag.tagId}>
                {tag.tagName}
              </option>
            ))}
        </select>
      </div>
    </div>
  )}
  
  <p className="text-xs text-[var(--color-muted)] mt-2">
    Add tags to help others discover your interests and preferences.
  </p>
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