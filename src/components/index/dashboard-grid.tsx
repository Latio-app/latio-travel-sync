import WalletCard from "@/components/wallet/wallet-card";
import TravelCard from "@/components/travel/travel-card";
import { useNavigate } from "react-router-dom";

interface DashboardGridProps {
  walletBalance: {
    xlm: number;
    preferredCurrency: string;
    localAmount: number;
  };
  travelPlan: {
    id: string;
    title: string;
    destination: {
      city: string;
      country: string;
    };
    budget: {
      initial: number;
      spent: number;
      remaining: number;
    };
    stipend: {
      dailyLimit: number;
      currency: string;
    };
    startDate: string;
    endDate: string;
    _base: Record<string, any>;
  };
}

export const DashboardGrid = ({
  walletBalance,
  travelPlan,
}: DashboardGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
      <WalletCard
        balance={walletBalance}
        onSend={() => navigate("/wallet")}
        onSwap={() => navigate("/wallet")}
        onSync={() => alert("Syncing wallet...")}
      />

      <TravelCard
        travelPlan={travelPlan}
        onViewDetails={() => navigate("/travel")}
      />
    </div>
  );
};
