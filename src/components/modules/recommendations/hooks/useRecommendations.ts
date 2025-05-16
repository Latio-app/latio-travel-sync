import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateTravelRecommendations } from "@/api/googleAI";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

interface UseRecommendationsProps {
  userId: string;
  travelId?: string;
}

interface AIRecommendation {
  id: string;
  prompt: string;
  response: string;
  timestamp: Timestamp;
  travelId: string;
  location: string;
  type: "travel" | "price";
}

export const useRecommendations = ({
  userId,
  travelId,
}: UseRecommendationsProps) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Query to fetch recommendations
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["recommendations", userId, travelId],
    queryFn: async () => {
      if (!travelId) return [];

      const recommendationsRef = collection(db, "aiRecommendations");
      const q = query(
        recommendationsRef,
        where("userId", "==", userId),
        where("travelId", "==", travelId),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AIRecommendation[];
    },
    enabled: !!userId && !!travelId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });

  // Mutation to generate and save new recommendations
  const { mutate: generateRecommendation, isPending: isGenerating } =
    useMutation({
      mutationFn: async (params: {
        prompt: string;
        location: string;
        budget?: number;
        duration?: number;
      }) => {
        if (!travelId) {
          throw new Error(
            "Please select a travel plan before generating recommendations."
          );
        }

        const response = await generateTravelRecommendations(params);

        const recommendation: Omit<AIRecommendation, "id"> = {
          prompt: params.prompt,
          response,
          timestamp: Timestamp.now(),
          travelId,
          location: params.location,
          type: "travel" as const,
        };

        const docRef = await addDoc(collection(db, "aiRecommendations"), {
          ...recommendation,
          userId,
        });

        return { id: docRef.id, ...recommendation };
      },
      onSuccess: (newRecommendation) => {
        // Update the cache with the new recommendation
        queryClient.setQueryData(
          ["recommendations", userId, travelId],
          (old: AIRecommendation[] = []) => [newRecommendation, ...old]
        );

        // Prefetch the recommendations to ensure they're in the cache
        queryClient.prefetchQuery({
          queryKey: ["recommendations", userId, travelId],
          queryFn: async () => {
            const recommendationsRef = collection(db, "aiRecommendations");
            const q = query(
              recommendationsRef,
              where("userId", "==", userId),
              where("travelId", "==", travelId),
              orderBy("timestamp", "desc")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as AIRecommendation[];
          },
        });
      },
      onError: (err: Error) => {
        setError(err.message);
      },
    });

  const clearError = () => setError(null);

  return {
    recommendations,
    isLoading,
    error,
    generateRecommendation,
    isGenerating,
    clearError,
  };
};
