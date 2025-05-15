import { TravelPlan } from "@/api/travel";
import TravelCard from "./TravelCard";
import EmptyTravelState from "./EmptyTravelState";

interface TravelListProps {
  plans: TravelPlan[];
  isLoading: boolean;
  emptyMessage: string;
  onCreateNew?: () => void;
}

const TravelList = ({
  plans,
  isLoading,
  emptyMessage,
  onCreateNew,
}: TravelListProps) => {
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (plans.length === 0)
    return (
      <EmptyTravelState message={emptyMessage} onCreateNew={onCreateNew} />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <TravelCard
          key={plan.id}
          travelPlan={plan}
          onViewDetails={() => alert(`View details for ${plan.title}`)}
        />
      ))}
    </div>
  );
};

export default TravelList;
