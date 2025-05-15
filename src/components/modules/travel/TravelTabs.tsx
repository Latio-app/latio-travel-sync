import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelList from "./TravelList";
import { TravelPlan } from "@/api/travel";

interface TravelTabsProps {
  travelPlans: TravelPlan[];
  isLoading: boolean;
  onCreateNew?: () => void;
}

const TravelTabs = ({
  travelPlans,
  isLoading,
  onCreateNew,
}: TravelTabsProps) => {
  const currentDate = new Date();

  const activePlans = travelPlans.filter(
    (plan) =>
      new Date(plan.startDate) <= currentDate &&
      new Date(plan.endDate) >= currentDate
  );
  const upcomingPlans = travelPlans.filter(
    (plan) => new Date(plan.startDate) > currentDate
  );
  const pastPlans = travelPlans.filter(
    (plan) => new Date(plan.endDate) < currentDate
  );

  return (
    <Tabs defaultValue="active" className="animate-fade-in">
      <TabsList className="mb-6">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <TravelList
          plans={activePlans}
          isLoading={isLoading}
          emptyMessage="No active travel plans"
          onCreateNew={onCreateNew}
        />
      </TabsContent>

      <TabsContent value="upcoming">
        <TravelList
          plans={upcomingPlans}
          isLoading={isLoading}
          emptyMessage="No upcoming travel plans"
          onCreateNew={onCreateNew}
        />
      </TabsContent>

      <TabsContent value="past">
        <TravelList
          plans={pastPlans}
          isLoading={isLoading}
          emptyMessage="No past travel plans"
          onCreateNew={onCreateNew}
        />
      </TabsContent>

      <TabsContent value="all">
        <TravelList
          plans={travelPlans}
          isLoading={isLoading}
          emptyMessage="No travel plans found"
          onCreateNew={onCreateNew}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TravelTabs;
