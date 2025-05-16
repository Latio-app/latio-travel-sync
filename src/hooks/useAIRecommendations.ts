import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAIRecommendations,
  addAIRecommendation,
  AIRecommendation,
} from "@/api/aiRecommendations";
import { generateTravelRecommendations } from "@/api/googleAI";

export const useAIRecommendations = (userId: string, travelId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["aiRecommendations", userId, travelId];

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => getAIRecommendations(userId, travelId),
    enabled: !!userId && !!travelId,
  });

  const generateRecommendation = useMutation({
    mutationFn: async (params: {
      prompt: string;
      location: string;
      budget?: number;
      duration?: number;
    }) => {
      const response = await generateTravelRecommendations({
        location: params.location,
        budget: params.budget,
        duration: params.duration,
        preferences: [params.prompt],
      });

      return addAIRecommendation(userId, travelId, {
        prompt: params.prompt,
        response,
        location: params.location,
        type: "travel",
        metadata: {
          budget: params.budget,
          duration: params.duration,
          preferences: [params.prompt],
        },
      });
    },
    onSuccess: (newRecommendation) => {
      queryClient.setQueryData(queryKey, (old: AIRecommendation[] = []) => [
        newRecommendation,
        ...old,
      ]);
    },
  });

  return {
    recommendations,
    isLoading,
    generateRecommendation: generateRecommendation.mutate,
    isGenerating: generateRecommendation.isPending,
  };
};
