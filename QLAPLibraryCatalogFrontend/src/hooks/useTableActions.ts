import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export function useTableActions() {
  const [isLoading, setIsLoading] = useState(false);

  const executeAction = useCallback(
    async (
      action: () => Promise<unknown>,
      config: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
        successMessage?: string;
        errorMessage?: string;
      } = {}
    ) => {
      const { onSuccess, onError, successMessage, errorMessage } = config;

      setIsLoading(true);

      try {
        await action();
        if (successMessage) toast.success(successMessage); // show success toast
        onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unexpected error occurred");
        toast.error(errorMessage ?? error.message); // show error toast
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { executeAction, isLoading };
}
