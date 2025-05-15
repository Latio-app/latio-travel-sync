import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import AIRecommendation from "@/components/recommendations/ai-recommendation";
import { Recommendation } from "@/@types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import LatioCard from "@/components/ui/latio-card";

const mockRecommendations: Recommendation[] = [
  {
    id: "rec1",
    interactionId: "int1",
    prompt: "Local dining experiences in Mexico City",
    response:
      "Visit Mercado de San Juan for authentic local cuisine. Try the street tacos at El Huequito, a classic spot since 1959. For a high-end experience, Pujol offers innovative Mexican cuisine.",
    timestamp: new Date().toISOString(),
    contextId: "ctx1",
    intent: "food",
    _base: {},
  },
  {
    id: "rec2",
    interactionId: "int2",
    prompt: "Budget-friendly activities in Buenos Aires",
    response:
      "Take a free walking tour of the colorful La Boca neighborhood. Visit the MALBA museum on Wednesdays when admission is discounted. Enjoy the public parks and free outdoor tango performances in San Telmo on Sundays.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    contextId: "ctx2",
    intent: "activities",
    _base: {},
  },
  {
    id: "rec3",
    interactionId: "int3",
    prompt: "Safe transportation options in Lima",
    response:
      "Use authorized taxi services like Uber or Cabify for safety. The Metropolitano bus system is efficient for moving around the main areas. Avoid hailing taxis from the street, especially at night.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    contextId: "ctx3",
    intent: "transportation",
    _base: {},
  },
];

const Recommendations = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(mockRecommendations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newRecommendation: Recommendation = {
        id: `rec${recommendations.length + 1}`,
        interactionId: `int${recommendations.length + 1}`,
        prompt,
        response:
          "Based on your request, I recommend exploring local markets and street food vendors for authentic cuisine. Always carry small bills for easier transactions and be sure to check if the vendor accepts cards before ordering.",
        timestamp: new Date().toISOString(),
        contextId: `ctx${recommendations.length + 1}`,
        intent: "custom",
        _base: {},
      };

      setRecommendations([newRecommendation, ...recommendations]);
      setPrompt("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <PageContainer
        title="AI Recommendations"
        subtitle="Get AI-driven travel insights and tips"
      >
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
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-latio-blue hover:bg-blue-600"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
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

        {/* Recommendations list */}
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          {recommendations.map((recommendation, index) => (
            <AIRecommendation
              key={recommendation.id}
              recommendation={recommendation}
              onLike={() => alert(`Liked: ${recommendation.prompt}`)}
              onDislike={() => alert(`Disliked: ${recommendation.prompt}`)}
            />
          ))}

          {recommendations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No recommendations yet. Ask your first question!
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
