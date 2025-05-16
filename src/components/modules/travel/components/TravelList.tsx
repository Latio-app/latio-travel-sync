import { useNavigate } from "react-router-dom";
import { TravelPlan } from "@/api/travel";
import TravelCard from "./TravelCard";
import EmptyTravelState from "./EmptyTravelState";

interface TravelListProps {
  travelPlans: TravelPlan[];
  isLoading: boolean;
  onCreateNew: () => void;
}

const TravelList = ({
  travelPlans,
  isLoading,
  onCreateNew,
}: TravelListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-6 rounded-lg animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!travelPlans.length) {
    return <EmptyTravelState onCreateNew={onCreateNew} />;
  }

  const handleViewDetails = (travelId: string) => {
    console.log("Navigating to travel details:", travelId);
    navigate(`/travel/${travelId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {travelPlans.map((plan) => (
        <TravelCard
          key={plan.id}
          travelPlan={plan}
          onViewDetails={() => handleViewDetails(plan.id)}
        />
      ))}
    </div>
  );
};

export default TravelList;
