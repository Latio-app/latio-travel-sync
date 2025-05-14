import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AIRecommendation from "@/components/recommendations/ai-recommendation";
import { useNavigate } from "react-router-dom";

interface Recommendation {
  id: string;
  interactionId: string;
  prompt: string;
  response: string;
  timestamp: string;
  contextId: string;
  intent: string;
  _base: Record<string, any>;
}

interface LocalTipsSectionProps {
  recommendation: Recommendation;
}

export const LocalTipsSection = ({ recommendation }: LocalTipsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Local Tips</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-latio-green border-latio-green hover:bg-latio-green hover:text-white"
          onClick={() => navigate("/recommendations")}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Request
        </Button>
      </div>
      <AIRecommendation
        recommendation={recommendation}
        onLike={() => alert("Thanks for your feedback!")}
        onDislike={() => alert("We'll improve our recommendations.")}
      />
    </div>
  );
};
