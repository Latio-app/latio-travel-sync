import { AIRecommendation } from "@/api/aiRecommendations";
import LatioCard from "@/components/ui/latio-card";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  return (
    <LatioCard className="bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            {recommendation.prompt}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(recommendation.timestamp.toDate(), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{recommendation.response}</ReactMarkdown>
        </div>
      </div>
    </LatioCard>
  );
};
