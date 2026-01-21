import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Custom hook that provides live query functionality for both Dexie and Supabase
 * Automatically polls Supabase when user is authenticated
 */
export function useSupabaseLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;

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

    // Check if user is authenticated to enable polling
    const checkAuthAndPoll = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // User is authenticated, poll every 2 seconds for updates
          const interval = setInterval(loadData, 2000);
          setPollInterval(interval);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuthAndPoll();

    return () => {
      cancelled = true;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}
