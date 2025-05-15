import { Recommendation } from "@/@types";
import LatioCard from "../ui/latio-card";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIRecommendationProps {
  recommendation: Recommendation;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

const AIRecommendation = ({
  recommendation,
  onLike,
  onDislike,
  className,
}: AIRecommendationProps) => {
  return (
    <LatioCard
      className={cn(
        "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-blue-100 dark:border-gray-700",
        className
      )}
      interactive={false}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-latio-blue flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Latio AI recommends
          </p>
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            {recommendation.prompt}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {recommendation.response}
          </p>

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              onClick={onLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={onDislike}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not helpful
            </Button>
          </div>
        </div>
      </div>
    </LatioCard>
  );
};

export default AIRecommendation;
