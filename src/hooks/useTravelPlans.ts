import { useState, useEffect } from "react";
import { fetchTravelPlans } from "@/api/travel";
import { TravelPlan } from "@/types/travel";

export const useTravelPlans = (userId: string) => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTravelPlans = async () => {
      if (!userId) {
        setTravelPlans([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const plans = await fetchTravelPlans(userId);
        setTravelPlans(plans);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load travel plans"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTravelPlans();
  }, [userId]);

  return { travelPlans, isLoading, error };
};
