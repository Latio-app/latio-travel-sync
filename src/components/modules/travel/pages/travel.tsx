import { useWalletStore } from "@/store/useStore";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import TravelTabs from "../TravelTabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTravelPlans } from "@/hooks/useTravelPlans";
import { useState } from "react";
import NewTravelPlanModal from "../components/NewTravelPlanModal";
import { useToast } from "@/components/ui/use-toast";
import { TravelPlan } from "@/api/travel";

const TravelPage = () => {
  const { walletAddress } = useWalletStore();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  console.log("Current wallet address:", walletAddress); // Debug log

  const {
    travelPlans = [],
    isLoading,
    createTravelPlan,
    isCreating,
  } = useTravelPlans(walletAddress);

  const handleCreateNew = () => {
    console.log("Create new clicked, wallet address:", walletAddress); // Debug log
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (
    plan: Omit<TravelPlan, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("Submit clicked, wallet address:", walletAddress); // Debug log

    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating travel plan:", { plan, walletAddress });
      await createTravelPlan(plan);
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Travel plan created successfully",
      });
    } catch (error) {
      console.error("Error creating travel plan:", error);
      toast({
        title: "Error",
        description: "Failed to create travel plan",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageContainer
        title="Travel Planner"
        subtitle="Manage your travel plans and budgets"
        action={
          <Button
            onClick={handleCreateNew}
            className="bg-latio-blue hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Travel Plan
          </Button>
        }
      >
        <TravelTabs
          travelPlans={travelPlans}
          isLoading={isLoading}
          onCreateNew={handleCreateNew}
        />
      </PageContainer>
      <Navbar />
      <NewTravelPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />
    </>
  );
};

export default TravelPage;
