
import { TravelPlan } from "@/@types";
import LatioCard from "../ui/latio-card";
import { Calendar, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TravelCardProps {
  travelPlan: TravelPlan;
  onViewDetails?: () => void;
  className?: string;
}

const TravelCard = ({
  travelPlan,
  onViewDetails,
  className,
}: TravelCardProps) => {
  const spentPercentage =
    (travelPlan.budget.spent / travelPlan.budget.initial) * 100;

  return (
    <LatioCard className={cn("bg-white", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="card-heading">{travelPlan.title}</h3>
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {travelPlan.destination.city}, {travelPlan.destination.country}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Calendar className="h-4 w-4" />
        <span>
          {new Date(travelPlan.startDate).toLocaleDateString()} -{" "}
          {new Date(travelPlan.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-1">
          <span>Budget Used</span>
          <span
            className={cn(
              spentPercentage > 90
                ? "text-red-500"
                : spentPercentage > 70
                  ? "text-amber-500"
                  : "text-green-500"
            )}
          >
            {travelPlan.budget.spent} / {travelPlan.budget.initial}{" "}
            {travelPlan.stipend.currency}
          </span>
        </div>
        <Progress
          value={spentPercentage}
          className={cn(
            "h-2",
            spentPercentage > 90
              ? "bg-red-100"
              : spentPercentage > 70
                ? "bg-amber-100"
                : "bg-green-100"
          )}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <p className="text-gray-500">Daily Limit</p>
          <p className="font-medium">
            {travelPlan.stipend.dailyLimit} {travelPlan.stipend.currency}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-latio-blue border-latio-blue hover:bg-latio-blue hover:text-white"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
    </LatioCard>
  );
};

export default TravelCard;
