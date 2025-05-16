import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTravelPlan,
  updateTravelPlan,
  updateAIRecommendations,
  updateBudget,
  updateStipend,
  subscribeToTravelPlan,
  TravelPlan,
} from "@/api/travel";
import { useEffect, useState, useMemo } from "react";

export const useTravelPlan = (userId: string, travelId: string) => {
  console.log("userId:", userId);
  console.log("travelId:", travelId);
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["travelPlan", userId, travelId],
    [userId, travelId]
  );
  const [isBlocked, setIsBlocked] = useState(false);

  const {
    data: travelPlan,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => fetchTravelPlan(userId, travelId),
    enabled: !!userId && !!travelId,
  });

  console.log(travelPlan);
  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId || !travelId) return;

    try {
      const unsubscribe = subscribeToTravelPlan(
        userId,
        travelId,
        (updatedPlan) => {
          queryClient.setQueryData(queryKey, updatedPlan);
          setIsBlocked(false);
        }
      );

      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing from travel plan:", error);
        }
      };
    } catch (error) {
      console.warn("Error setting up travel plan subscription:", error);
      setIsBlocked(true);
      // Fallback to polling if real-time updates are blocked
      const interval = setInterval(() => {
        refetch();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userId, travelId, queryClient, queryKey, refetch]);

  const updatePlanMutation = useMutation({
    mutationFn: (data: Partial<TravelPlan>) =>
      updateTravelPlan(userId, travelId, data),
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(queryKey, updatedPlan);
    },
  });

  const updateRecommendationsMutation = useMutation({
    mutationFn: (recommendations: TravelPlan["aiRecommendations"]) =>
      updateAIRecommendations(userId, travelId, recommendations),
    onSuccess: (_, recommendations) => {
      queryClient.setQueryData(queryKey, (old: TravelPlan | undefined) => {
        if (!old) return old;
        return { ...old, aiRecommendations: recommendations };
      });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: (budget: TravelPlan["budget"]) =>
      updateBudget(userId, travelId, budget),
    onSuccess: (_, budget) => {
      queryClient.setQueryData(queryKey, (old: TravelPlan | undefined) => {
        if (!old) return old;
        return { ...old, budget };
      });
    },
  });

  const updateStipendMutation = useMutation({
    mutationFn: (stipend: TravelPlan["stipend"]) =>
      updateStipend(userId, travelId, stipend),
    onSuccess: (_, stipend) => {
      queryClient.setQueryData(queryKey, (old: TravelPlan | undefined) => {
        if (!old) return old;
        return { ...old, stipend };
      });
    },
  });

  return {
    travelPlan,
    isLoading,
    error,
    isBlocked,
    updatePlan: updatePlanMutation.mutate,
    updateRecommendations: updateRecommendationsMutation.mutate,
    updateBudget: updateBudgetMutation.mutate,
    updateStipend: updateStipendMutation.mutate,
  };
};
