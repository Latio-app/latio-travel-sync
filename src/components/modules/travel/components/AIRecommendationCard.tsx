import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRecommendation } from "@/api/aiRecommendations";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
}

const AIRecommendationCard = ({
  recommendation,
}: AIRecommendationCardProps) => {
  const formatDate = (timestamp: Timestamp) => {
    return new Date(timestamp.toDate()).toLocaleString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {recommendation.location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">
              Your Request
            </h4>
            <p className="text-sm">{recommendation.prompt}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">
              AI Recommendation
            </h4>
            <p className="text-sm whitespace-pre-line">
              {recommendation.response}
            </p>
          </div>

          {recommendation.metadata && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {recommendation.metadata.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget: ${recommendation.metadata.budget}</span>
                </div>
              )}
              {recommendation.metadata.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recommendation.metadata.duration} days</span>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Generated on {formatDate(recommendation.timestamp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationCard;
