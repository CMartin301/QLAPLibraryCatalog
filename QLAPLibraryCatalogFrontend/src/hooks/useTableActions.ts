import { useState, useCallback } from "react";

export interface ActionState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncActionConfig {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string; // let caller decide if they want toast
}

export function useTableActions() {
  const [actionState, setActionState] = useState<ActionState>({
    isLoading: false,
    error: null,
  });

  const executeAction = useCallback(
    async (action: () => Promise<unknown>, config: AsyncActionConfig = {}) => {
      const { onSuccess, onError, successMessage } = config;
      setActionState({ isLoading: true, error: null });

      try {
        await action();
        if (successMessage) {
          // Hook into your app’s toast/notification system
          console.info(successMessage);
        }
        onSuccess?.();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unexpected error occurred");
        setActionState({ isLoading: false, error: error.message });
        onError?.(error);
        throw error; // rethrow so the component can react if it wants
      } finally {
        setActionState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setActionState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    actionState,
    executeAction,
    clearError,
    isLoading: actionState.isLoading,
    error: actionState.error,
  };
}
