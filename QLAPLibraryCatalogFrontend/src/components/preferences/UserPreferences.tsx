import React, { useState, useEffect } from 'react';
import { Save, Settings, Bell, Mail, MessageSquare, Calendar, CheckSquare, Loader2 } from 'lucide-react';

interface UserPreferences {
  preferenceId: number | null;
  userId: number;
  defaultLoanDays: number;
  autoApproveRequests: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationSettings: any | null;
}

interface UserPreferencesProps {
  initialPreferences?: UserPreferences;
  onSave?: (preferences: UserPreferences) => Promise<void>;
  isLoading?: boolean;
}

const defaultPreferences: UserPreferences = {
  preferenceId: null,
  userId: 20,
  defaultLoanDays: 14,
  autoApproveRequests: true,
  emailNotifications: true,
  smsNotifications: true,
  notificationSettings: null
};

export function UserPreferences({ 
  initialPreferences = defaultPreferences, 
  onSave,
  isLoading = false 
}: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  const handleInputChange = (field: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(preferences);
      setIsDirty(false);
      setSaveMessage('Preferences saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Failed to save preferences. Please try again.');
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="text-[var(--color-primary)]" size={24} />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">User Preferences</h1>
        </div>
        <p className="text-[var(--color-muted)]">Manage your account settings and notification preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg border ${
          saveMessage.includes('Failed') 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Loan Settings */}
      <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-[var(--color-primary)]" size={20} />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Loan Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="defaultLoanDays" className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Default Loan Period (Days)
            </label>
            <input
              type="number"
              id="defaultLoanDays"
              min="1"
              max="90"
              value={preferences.defaultLoanDays}
              onChange={(e) => handleInputChange('defaultLoanDays', parseInt(e.target.value) || 14)}
              disabled={isLoading}
              className="w-32 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
            <p className="text-xs text-[var(--color-muted)] mt-1">
              How many days books are loaned by default (1-90 days)
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="autoApproveRequests"
              checked={preferences.autoApproveRequests}
              onChange={(e) => handleInputChange('autoApproveRequests', e.target.checked)}
              disabled={isLoading}
              className="mt-1 h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded
                       focus:ring-[var(--color-primary)] focus:ring-2"
            />
            <div>
              <label htmlFor="autoApproveRequests" className="text-sm font-medium text-[var(--color-text)]">
                Auto-approve loan requests
              </label>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                Automatically approve incoming requests for your books
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-[var(--color-primary)]" size={20} />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={preferences.emailNotifications}
              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              disabled={isLoading}
              className="mt-1 h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded
                       focus:ring-[var(--color-primary)] focus:ring-2"
            />
            <div className="flex items-start gap-2">
              <Mail size={16} className="text-[var(--color-muted)] mt-0.5" />
              <div>
                <label htmlFor="emailNotifications" className="text-sm font-medium text-[var(--color-text)]">
                  Email notifications
                </label>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Receive email updates for loan requests, due dates, and messages
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={preferences.smsNotifications}
              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              disabled={isLoading}
              className="mt-1 h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded
                       focus:ring-[var(--color-primary)] focus:ring-2"
            />
            <div className="flex items-start gap-2">
              <MessageSquare size={16} className="text-[var(--color-muted)] mt-0.5" />
              <div>
                <label htmlFor="smsNotifications" className="text-sm font-medium text-[var(--color-text)]">
                  SMS notifications
                </label>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Receive text message alerts for urgent notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                   text-white rounded-lg font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default UserPreferences;