import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TravelPlan } from "@/api/travel";
import { format } from "date-fns";

interface TravelCardProps {
  travelPlan: TravelPlan;
  onViewDetails: () => void;
}

const TravelCard = ({ travelPlan, onViewDetails }: TravelCardProps) => {
  const { title, destination, startDate, endDate, budget } = travelPlan;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Destination: {destination}</p>
          <p className="text-sm text-gray-500">
            Dates: {format(new Date(startDate), "MMM d")} -{" "}
            {format(new Date(endDate), "MMM d, yyyy")}
          </p>
          <p className="text-sm text-gray-500">
            Budget: ${budget.toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onViewDetails} variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TravelCard;
