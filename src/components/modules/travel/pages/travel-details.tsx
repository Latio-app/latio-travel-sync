import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import TravelDetailsCard from "@/components/modules/travel/components/TravelDetailsCard";
import TravelBudgetOverview from "@/components/modules/travel/components/TravelBudgetOverview";
import TravelStipendOverview from "@/components/modules/travel/components/TravelStipendOverview";
import TravelDates from "@/components/modules/travel/components/TravelDates";
import { RecommendationsSection } from "@/components/modules/recommendations/components/RecommendationsSection";
import { useWalletStore } from "@/store/useStore";
import { useTravelPlan } from "@/hooks/useTravelPlan";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const TravelDetailsPage = () => {
  const { walletAddress } = useWalletStore();
  console.log("Wallet Address:", walletAddress);
  const { travelId } = useParams();
  console.log("Travel ID:", travelId);
  const {
    travelPlan,
    isLoading,
    error,
    isBlocked,
    updatePlan,
    updateRecommendations,
    updateBudget,
    updateStipend,
  } = useTravelPlan(walletAddress, travelId);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (error) {
    return (
      <PageContainer title="Error" subtitle="Failed to load travel plan">
        <div className="text-destructive">
          <p>Error loading travel plan: {error.message}</p>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer title="Loading..." subtitle="Please wait">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!travelPlan) {
    return (
      <PageContainer title="Not Found" subtitle="Travel plan not found">
        <div className="text-muted-foreground">
          <p>The requested travel plan could not be found.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer title="Travel Plan Details" subtitle={travelPlan.title}>
        {isBlocked && (
          <Alert
            variant="default"
            className="mb-6 bg-yellow-50 border-yellow-200"
          >
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Real-time updates are currently disabled. Please disable your ad
              blocker or privacy extension to enable real-time updates.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-6">
          <TravelDetailsCard travelPlan={travelPlan} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TravelBudgetOverview
              budget={travelPlan.budget}
              isLoading={isLoading}
            />
            <TravelStipendOverview
              stipend={travelPlan.stipend}
              isLoading={isLoading}
            />
          </div>
          <TravelDates
            startDate={travelPlan.startDate}
            endDate={travelPlan.endDate}
          />
          <RecommendationsSection
            userId={walletAddress}
            travelId={travelId}
            location={travelPlan.destination}
            budget={travelPlan.budget.initial}
            duration={calculateDuration(
              travelPlan.startDate,
              travelPlan.endDate
            )}
          />
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default TravelDetailsPage;
