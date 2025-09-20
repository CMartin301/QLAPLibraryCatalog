// components/UserProfile/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { userProfileService } from '../../services/userProfileService';
import { UserProfile, CreateOrUpdateUserProfile, UserPronoun } from '../../types/userProfile';
import useAuth from '../../hooks/useAuth';
import { 
  Edit, 
  User, 
  Loader2, 
  Tag, 
  Calendar,
  BookOpen,
  Clock
} from 'lucide-react';
import Button from '../shared/Button';
import { Modal } from '../shared/Modal';
import { TagDto } from '../../types/tags';
import StatCard from '../shared/StatCard';
import EditUserProfileForm from '../user/EditUserProfileForm';
import { StatusBadge } from '../shared/StatusBadge';


interface UserProfilePageProps {
  userId?: number; // If provided, shows another user's profile
}

function UserProfilePage({ userId: targetUserId }: UserProfilePageProps) {
  const { userID } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Determine if this is the user's own profile
  const isOwnProfile = !targetUserId || targetUserId === userID;
  const profileUserId = targetUserId || userID || 0;

  // Add this helper function inside the component or as a utility function
const formatPronounsDisplay = (userPronouns: UserPronoun[]): string => {
  if (!userPronouns || userPronouns.length === 0) return '';
  
  return userPronouns
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(p => p.pronounText)
    .join(' / ');
};

  useEffect(() => {
    if (profileUserId) loadProfile();
  }, [profileUserId, isOwnProfile]);
  const loadProfile = async () => {
  setIsLoading(true);
  setError(null);
  try {
    if (isOwnProfile) {
      const data = await userProfileService.getMyProfile();
      setProfile({
        ...data,
        email: data.email || undefined, // Convert null to undefined
        isOwnProfile: true,
        // Add placeholder data for fields not yet implemented
        mediaItemCount: 47,
        loanCount: 12,
        joinedDate: data.createdAt // Use profile creation as join date for now
      });
    } else {
      const data = await userProfileService.getUserProfile(profileUserId);
      setProfile({
        ...data,
        email: data.email || undefined, // Convert null to undefined
        isOwnProfile: false,
        // Add placeholder data for fields not yet implemented
        mediaItemCount: 23,
        loanCount: 8,
        joinedDate: data.createdAt
      });
    }
  } catch (err: any) {
    console.error('Failed to load profile:', err);
    setError('Failed to load profile');
    // Use placeholder data as fallback
  } finally {
    setIsLoading(false);
  }
};

  const handleEditSubmit = async (data: CreateOrUpdateUserProfile) => {
    try {
      // TODO: Replace with actual service call
      const updated = await userProfileService.createOrUpdateMyProfile(data);
      
      setProfile(updated);
      setIsEditModalOpen(false);
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
          <span className="ml-3 text-[var(--color-text)]">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={loadProfile}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return <p>No profile</p>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with User Info */}
      <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* User Info */}
          <div className="flex items-start gap-4">
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0 w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[var(--color-text)] truncate">
                  {profile.username || 'Anonymous User'}
                </h1>
                {/* {profile.userPronouns && profile.userPronouns.length > 0 && (
                  <span className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] px-2 py-1 rounded">
                    {formatPronounsDisplay(profile.userPronouns)}
                  </span>
                )} */}
                  {profile.userPronouns && profile.userPronouns.length && profile.userPronouns.map((pronoun) => (
                        <StatusBadge 
                          config={{
                            text: pronoun.pronounText,
                            color: 'purple',
                            icon: undefined
                          }}
                          size="md"
                        />
                    ))}

              </div>
              
              {/* User Details */}
              <div className="space-y-1 text-sm text-[var(--color-muted)]">
                
                {profile.joinedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Joined {formatJoinDate(profile.joinedDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button (only for own profile) */}
          {isOwnProfile && (
            <Button
              variant="primary"
              size="md"
              icon={Edit}
              onClick={() => setIsEditModalOpen(true)}
              className="flex-shrink-0"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          title="Media Items"
          value={profile.mediaItemCount || 0}
          description="Books in collection"
          to={isOwnProfile ? "/my-library" : `/users/${profile.userId}/library`}
        />
        
        <StatCard
          icon={Clock}
          title="Active Loans"
          value={profile.loanCount || 0}
          description="Currently borrowed"
          to={isOwnProfile ? "/my-loans" : `/users/${profile.userId}/loans`}
        />
        
      </div>

      {/* About Section */}
      <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
          {isOwnProfile ? 'About Me' : `About ${profile.username}`}
        </h2>
        
        <div className="min-h-[100px] p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg">
          {profile.profileDescription ? (
            <p className="text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
              {profile.profileDescription}
            </p>
          ) : (
            <p className="text-[var(--color-muted)] italic">
              {isOwnProfile 
                ? 'No description added yet. Click "Edit Profile" to add information about yourself.'
                : 'This user hasn\'t added a description yet.'
              }
            </p>
          )}
        </div>
      </div>

      {/* Tags Section */}
      {profile.userTags && profile.userTags.length > 0 && (
        <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="text-[var(--color-primary)]" size={20} />
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {isOwnProfile ? 'My Interests' : 'Interests'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.userTags.map((tag: TagDto) => (
              <span
                key={tag.tagId}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                         bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] 
                         transition-colors cursor-pointer"
              >
                {tag.tagName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profile Metadata (only for own profile) */}
      {isOwnProfile && (
        <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-[var(--color-muted)] font-medium mb-1">
                Profile Created
              </label>
              <p className="text-[var(--color-text)]">{formatDate(profile.createdAt)}</p>
            </div>
            <div>
              <label className="block text-[var(--color-muted)] font-medium mb-1">
                Last Updated
              </label>
              <p className="text-[var(--color-text)]">{formatDate(profile.updatedAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile"
          size="md"
        >
          <EditUserProfileForm
            profile={profile}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );

}


export default UserProfilePage;