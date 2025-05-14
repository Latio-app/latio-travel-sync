
import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import TravelCard from "@/components/travel/travel-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LatioCard from "@/components/ui/latio-card";
import { TravelPlan } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTravelPlans: TravelPlan[] = [
  {
    id: "trip1",
    title: "Mexico City Trip",
    destination: {
      city: "Mexico City",
      country: "Mexico"
    },
    budget: {
      initial: 1000,
      spent: 480,
      remaining: 520
    },
    stipend: {
      dailyLimit: 100,
      currency: "USD"
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    _base: {}
  },
  {
    id: "trip2",
    title: "Buenos Aires Conference",
    destination: {
      city: "Buenos Aires",
      country: "Argentina"
    },
    budget: {
      initial: 1500,
      spent: 1350,
      remaining: 150
    },
    stipend: {
      dailyLimit: 150,
      currency: "USD"
    },
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    _base: {}
  },
  {
    id: "trip3",
    title: "Lima Business Trip",
    destination: {
      city: "Lima",
      country: "Peru"
    },
    budget: {
      initial: 800,
      spent: 320,
      remaining: 480
    },
    stipend: {
      dailyLimit: 80,
      currency: "USD"
    },
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    _base: {}
  }
];

// Filter travel plans by status
const currentDate = new Date();
const activePlans = mockTravelPlans.filter(
  plan => new Date(plan.startDate) <= currentDate && new Date(plan.endDate) >= currentDate
);
const upcomingPlans = mockTravelPlans.filter(
  plan => new Date(plan.startDate) > currentDate
);
const pastPlans = mockTravelPlans.filter(
  plan => new Date(plan.endDate) < currentDate
);

const Travel = () => {
  return (
    <>
      <PageContainer
        title="Travel Planner"
        subtitle="Manage your travel plans and budgets"
        action={
          <Button className="bg-latio-blue hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            New Travel Plan
          </Button>
        }
      >
        <Tabs defaultValue="active" className="animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activePlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePlans.map(plan => (
                  <TravelCard 
                    key={plan.id}
                    travelPlan={plan}
                    onViewDetails={() => alert(`View details for ${plan.title}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyTravelState message="No active travel plans" />
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            {upcomingPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingPlans.map(plan => (
                  <TravelCard 
                    key={plan.id}
                    travelPlan={plan}
                    onViewDetails={() => alert(`View details for ${plan.title}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyTravelState message="No upcoming travel plans" />
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastPlans.map(plan => (
                  <TravelCard 
                    key={plan.id}
                    travelPlan={plan}
                    onViewDetails={() => alert(`View details for ${plan.title}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyTravelState message="No past travel plans" />
            )}
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTravelPlans.map(plan => (
                <TravelCard 
                  key={plan.id}
                  travelPlan={plan}
                  onViewDetails={() => alert(`View details for ${plan.title}`)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
      <Navbar />
    </>
  );
};

// Helper component for empty states
const EmptyTravelState = ({ message }: { message: string }) => (
  <LatioCard className="text-center py-12 max-w-md mx-auto">
    <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="h-8 w-8 text-latio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    </div>
    <p className="text-gray-500 mb-4">{message}</p>
    <Button className="bg-latio-blue hover:bg-blue-600">
      <Plus className="h-4 w-4 mr-2" />
      Create Travel Plan
    </Button>
  </LatioCard>
);

export default Travel;
