import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Custom hook that provides live query functionality for both Dexie and Supabase
 * Automatically polls Supabase when user is authenticated
 * Re-runs query when auth state changes (login/logout)
 */
export function useSupabaseLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    let interval: NodeJS.Timeout | undefined;

    const loadData = async () => {
      try {
        const result = await queryFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    // Initial load
    loadData();

    // Poll if user is authenticated
    if (user) {
      interval = setInterval(loadData, 2000);
    }

    return () => {
      cancelled = true;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [...deps, user]); // Re-run when deps change or user logs in/out

  return data;
}
