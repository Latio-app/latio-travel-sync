import { TravelPlan } from "@/api/travel";

interface TravelDetailsCardProps {
  travelPlan: TravelPlan;
}

const TravelDetailsCard = ({ travelPlan }: TravelDetailsCardProps) => {
  return (
    <div className="bg-card text-card-foreground shadow-md p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">{travelPlan.title}</h2>
      <div className="space-y-2">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Destination:</span>{" "}
          {travelPlan.destination}
        </p>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Status:</span>{" "}
          <span className="capitalize">{travelPlan.status}</span>
        </p>
      </div>
    </div>
  );
};

export default TravelDetailsCard;
