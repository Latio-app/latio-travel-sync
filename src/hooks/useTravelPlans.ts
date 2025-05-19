import { useState, useEffect } from "react";
import { fetchTravelPlans, createTravelPlan } from "@/api/travel";
import { TravelPlan } from "@/types/travel";

export const useTravelPlans = (userId: string) => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const createNewTravelPlan = async (
    plan: Omit<TravelPlan, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!userId) {
      throw new Error("No userId provided");
    }

    try {
      setIsCreating(true);
      const newPlan = await createTravelPlan(userId, plan);
      setTravelPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create travel plan"
      );
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    travelPlans,
    isLoading,
    error,
    createTravelPlan: createNewTravelPlan,
    isCreating,
  };
};
