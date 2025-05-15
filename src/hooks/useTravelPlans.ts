import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTravelPlans,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  type TravelPlan,
} from "@/api/travel";

export const useTravelPlans = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: travelPlans = [], isLoading } = useQuery({
    queryKey: ["travelPlans", userId],
    queryFn: () => fetchTravelPlans(userId),
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (plan: Omit<TravelPlan, "id" | "createdAt" | "updatedAt">) => {
      console.log("Mutation function called with:", { plan, userId });
      return createTravelPlan(userId, plan);
    },
    onSuccess: () => {
      console.log("Travel plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["travelPlans", userId] });
    },
    onError: (error) => {
      console.error("Error in create mutation:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      planId,
      updates,
    }: {
      planId: string;
      updates: Partial<TravelPlan>;
    }) => updateTravelPlan(userId, planId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelPlans", userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: string) => deleteTravelPlan(userId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelPlans", userId] });
    },
  });

  return {
    travelPlans,
    isLoading,
    createTravelPlan: createMutation.mutate,
    updateTravelPlan: updateMutation.mutate,
    deleteTravelPlan: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
