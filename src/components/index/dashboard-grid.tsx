import { useNavigate } from "react-router-dom";
import WalletCard from "@/components/wallet/wallet-card";
import TravelCard from "@/components/travel/travel-card";
import { useWalletStore } from "@/store/useStore";
import { TravelPlan } from "@/types/travel";

interface DashboardGridProps {
  walletBalance: {
    xlm: number;
    preferredCurrency: string;
    localAmount: number;
  } | null;
  travelPlan: TravelPlan | null;
}

export const DashboardGrid = ({
  walletBalance,
  travelPlan,
}: DashboardGridProps) => {
  const navigate = useNavigate();
  const { fetchBalance, fetchTransactions } = useWalletStore();

  const handleSync = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
      {walletBalance ? (
        <WalletCard
          balance={walletBalance}
          onSend={() => navigate("/wallet")}
          onSwap={() => navigate("/wallet")}
          onSync={handleSync}
        />
      ) : (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <p className="text-gray-500 mb-2">
            Connect your wallet to view balance
          </p>
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
