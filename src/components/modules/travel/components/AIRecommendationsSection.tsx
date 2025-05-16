import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import AIRecommendationCard from "./AIRecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface AIRecommendationsSectionProps {
  userId: string;
  travelId: string;
  location: string;
  budget?: number;
  duration?: number;
}

const AIRecommendationsSection = ({
  userId,
  travelId,
  location,
  budget,
  duration,
}: AIRecommendationsSectionProps) => {
  const [prompt, setPrompt] = useState("");
  const { recommendations, isLoading, generateRecommendation, isGenerating } =
    useAIRecommendations(userId, travelId);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateRecommendation({
      prompt: prompt.trim(),
      location,
      budget,
      duration,
    });
    setPrompt("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Travel Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for specific recommendations (e.g., 'Best local restaurants', 'Hidden gems', 'Nightlife spots')..."
              className="min-h-[100px]"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Recommendation"}
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((recommendation) => (
                <AIRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No recommendations yet. Ask the AI for travel tips!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsSection;
