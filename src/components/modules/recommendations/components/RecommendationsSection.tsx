import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRecommendations } from "../hooks/useRecommendations";
import { RecommendationCard } from "./RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecommendationsSectionProps {
  userId: string;
  travelId: string;
  location: string;
  budget?: number;
  duration?: number;
}

export const RecommendationsSection = ({
  userId,
  travelId,
  location,
  budget,
  duration,
}: RecommendationsSectionProps) => {
  const [prompt, setPrompt] = useState("");
  const {
    recommendations,
    isLoading,
    error,
    generateRecommendation,
    isGenerating,
    clearError,
  } = useRecommendations({ userId, travelId });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      await generateRecommendation({
        prompt: prompt.trim(),
        location,
        budget,
        duration,
      });
      setPrompt("");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Travel Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-6 flex-1 flex flex-col">
          {error && (
            <Alert variant="destructive" className="mb-4">
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

          <div className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for specific recommendations (e.g., 'Best local restaurants', 'Hidden gems', 'Nightlife spots')..."
              className="min-h-[100px]"
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </div>
              ) : (
                "Generate Recommendation"
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                  <p>No recommendations yet. Ask the AI for travel tips!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
