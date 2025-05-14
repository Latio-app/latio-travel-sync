
import WalletCard from "@/components/wallet/wallet-card";
import TravelCard from "@/components/travel/travel-card";
import { useNavigate } from "react-router-dom";

interface DashboardGridProps {
  walletBalance: {
    xlm: number;
    preferredCurrency: string;
    localAmount: number;
  } | null;
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
      {walletBalance ? (
        <WalletCard
          balance={walletBalance}
          onSend={() => navigate("/wallet")}
          onSwap={() => navigate("/wallet")}
          onSync={() => alert("Syncing wallet...")}
        />
      ) : (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <p className="text-gray-500 mb-2">Connect your wallet to view balance</p>
          <button 
            onClick={() => navigate("/wallet")}
            className="text-sm text-blue-600 hover:underline"
          >
            Go to wallet
          </button>
        </div>
      )}

      <TravelCard
        travelPlan={travelPlan}
        onViewDetails={() => navigate("/travel")}
      />
    </div>
  );
};
