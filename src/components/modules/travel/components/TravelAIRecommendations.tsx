import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AIRecommendation {
  category: string;
  suggestions: string[];
}

interface TravelAIRecommendationsProps {
  recommendations?: AIRecommendation[];
  isLoading?: boolean;
}

const TravelAIRecommendations = ({
  recommendations,
  isLoading,
}: TravelAIRecommendationsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No recommendations available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold text-foreground">
                {recommendation.category}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {recommendation.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelAIRecommendations;
