import TravelList from "./components/TravelList";
import { TravelPlan } from "@/api/travel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TravelTabsProps {
  travelPlans: TravelPlan[];
  isLoading: boolean;
  onCreateNew: () => void;
}

const TravelTabs = ({
  travelPlans,
  isLoading,
  onCreateNew,
}: TravelTabsProps) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

  const activePlans = travelPlans.filter((plan) => {
    const startDate = new Date(plan.startDate + "T00:00:00Z");
    const endDate = new Date(plan.endDate + "T00:00:00Z");
    return startDate <= currentDate && endDate >= currentDate;
  });

  const upcomingPlans = travelPlans.filter((plan) => {
    const startDate = new Date(plan.startDate + "T00:00:00Z");
    return startDate > currentDate;
  });

  const pastPlans = travelPlans.filter((plan) => {
    const endDate = new Date(plan.endDate + "T00:00:00Z");
    return endDate < currentDate;
  });

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <TravelList
          travelPlans={activePlans}
          isLoading={isLoading}
          onCreateNew={onCreateNew}
        />
      </TabsContent>
      <TabsContent value="upcoming">
        <TravelList
          travelPlans={upcomingPlans}
          isLoading={isLoading}
          onCreateNew={onCreateNew}
        />
      </TabsContent>
      <TabsContent value="past">
        <TravelList
          travelPlans={pastPlans}
          isLoading={isLoading}
          onCreateNew={onCreateNew}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TravelTabs;
