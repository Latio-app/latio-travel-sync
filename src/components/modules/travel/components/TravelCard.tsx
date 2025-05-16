import { TravelPlan } from "@/api/travel";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface TravelCardProps {
  travelPlan: TravelPlan;
  onViewDetails: () => void;
}

const TravelCard = ({ travelPlan, onViewDetails }: TravelCardProps) => {
  const formatDate = (dateString: string) => {
    // Create date in UTC to avoid timezone issues
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC", // Ensure consistent date display
    });
  };

  return (
    <div className="bg-card text-card-foreground shadow-md p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-2">{travelPlan.title}</h3>
      <div className="space-y-2 mb-4">
        <p className="text-muted-foreground flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {travelPlan.destination}
        </p>
        <p className="text-muted-foreground flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(travelPlan.startDate)} - {formatDate(travelPlan.endDate)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
          {travelPlan.status}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="text-primary hover:text-primary/80"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default TravelCard;
