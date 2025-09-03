export interface UserPreferences {
  preferenceId: number | null;
  userId: number;
  defaultLoanDays: number;
  autoApproveRequests: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationSettings: any | null;
}

export interface UserPreferencesProps {
  initialPreferences?: UserPreferences;
  onSave?: (preferences: UserPreferences) => Promise<void>;
  isLoading?: boolean;
}

// export interface GetUserPreferencesResponse {
//   data: Media[];
// }