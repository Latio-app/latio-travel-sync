import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { useRecommendations } from "../hooks/useRecommendations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, AlertCircle } from "lucide-react";
import LatioCard from "@/components/ui/latio-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecommendationCard } from "../components/RecommendationCard";
import TravelSelector from "../components/TravelSelector";
import { useTravelStore } from "@/store/useTravelStore";
import { useTravelPlans } from "@/hooks/useTravelPlans";
import { useWalletStore } from "@/store/useStore";

const Recommendations = () => {
  const [prompt, setPrompt] = useState("");
  const { walletAddress } = useWalletStore();
  const { selectedTravelId } = useTravelStore();
  const { travelPlans } = useTravelPlans(walletAddress);
  const {
    recommendations,
    isLoading,
    error,
    generateRecommendation,
    isGenerating,
    clearError,
  } = useRecommendations({
    userId: walletAddress,
    travelId: selectedTravelId || undefined,
  });

  const selectedTravel = travelPlans.find(
    (plan) => plan.id === selectedTravelId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!selectedTravelId || !selectedTravel) {
      alert("Please select a travel plan before generating recommendations.");
      return;
    }

    try {
      await generateRecommendation({
        prompt: prompt.trim(),
        location: selectedTravel.destination,
        budget: selectedTravel.budget.initial,
        duration: Math.ceil(
          (new Date(selectedTravel.endDate).getTime() -
            new Date(selectedTravel.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      });
      setPrompt("");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <PageContainer
        title="AI Recommendations"
        subtitle="Get AI-driven travel insights and tips"
      >
        {/* Travel Plan Selector */}
        <div className="mb-6">
          <TravelSelector />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-6 animate-fade-in">
          <LatioCard className="bg-white dark:bg-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              Ask for Recommendations
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="E.g. Where can I find affordable local food in Mexico City?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                disabled={isGenerating || !selectedTravelId}
              />
              <Button
                type="submit"
                className="bg-latio-blue hover:bg-blue-600"
                disabled={isGenerating || !prompt.trim() || !selectedTravelId}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <>
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </LatioCard>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-6 px-2"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations list */}
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {selectedTravelId
                  ? "No recommendations yet. Ask your first question!"
                  : "Please select a travel plan to get started."}
              </p>
            </div>
          )}
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Recommendations;
