import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  generateTravelRecommendations,
  generatePriceInsights,
} from "@/api/googleAI";
import { addAIRecommendation } from "@/api/aiRecommendations";
import { useToast } from "@/components/ui/use-toast";

interface AIChatBoxProps {
  userId: string;
  travelId: string;
  location: string;
  budget?: number;
  duration?: number;
}

const AIChatBox = ({
  userId,
  travelId,
  location,
  budget,
  duration,
}: AIChatBoxProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateRecommendation = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await generateTravelRecommendations({
        location,
        budget,
        duration,
        preferences: [prompt],
      });

      await addAIRecommendation(userId, travelId, {
        prompt,
        response,
        location,
        type: "travel",
        metadata: {
          budget,
          duration,
          preferences: [prompt],
        },
      });

      toast({
        title: "Success",
        description: "AI recommendation generated successfully!",
      });

      setPrompt("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask for specific recommendations (e.g., 'Best local restaurants', 'Hidden gems', 'Nightlife spots')..."
        className="min-h-[100px]"
      />
      <Button
        onClick={handleGenerateRecommendation}
        disabled={loading || !prompt.trim()}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate Recommendation"}
      </Button>
    </div>
  );
};

export default AIChatBox;
