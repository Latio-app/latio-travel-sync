
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useWallet } from "@/components/providers/wallet-provider";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { LoadingState } from "@/components/index/loading-state";
import { DashboardGrid } from "@/components/index/dashboard-grid";
import { RecentTransactionsSection } from "@/components/index/recent-transactions-section";
import { LocalTipsSection } from "@/components/index/local-tips-section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

const mockWalletBalance = {
  xlm: 425.68,
  preferredCurrency: "USD",
  localAmount: 127.7,
};

const mockTransactions = [
  {
    id: "tx1",
    amount: 50,
    asset: "XLM",
    type: "send" as const,
    description: "Payment for dinner",
    recipient: "Alex",
    status: "completed" as const,
    timestamp: new Date().toISOString(),
    txHash: "hash123456789abcdef",
    _base: {},
  },
  {
    id: "tx2",
    amount: 100,
    asset: "XLM",
    type: "receive" as const,
    description: "Refund from hotel",
    recipient: "Hotel Booking",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    txHash: "hash987654321fedcba",
    _base: {},
  },
];

const mockTravelPlan = {
  id: "trip1",
  title: "Mexico City Trip",
  destination: {
    city: "Mexico City",
    country: "Mexico",
  },
  budget: {
    initial: 1000,
    spent: 480,
    remaining: 520,
  },
  stipend: {
    dailyLimit: 100,
    currency: "USD",
  },
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  _base: {},
};

const mockRecommendation = {
  id: "rec1",
  interactionId: "int1",
  prompt: "Local dining experiences in Mexico City",
  response:
    "Visit Mercado de San Juan for authentic local cuisine. Try the street tacos at El Huequito, a classic spot since 1959. For a high-end experience, Pujol offers innovative Mexican cuisine.",
  timestamp: new Date().toISOString(),
  contextId: "ctx1",
  intent: "food",
  _base: {},
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, publicKey, connect } = useWallet();
  const setWalletBalance = useStore((state) => state.setWalletBalance);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set mock wallet balance when connected
    if (isConnected && publicKey) {
      setWalletBalance(mockWalletBalance);
    }
  }, [isConnected, publicKey, setWalletBalance]);

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <PageContainer
        title="Welcome to Latio"
        subtitle="Your cross-border payment & travel companion"
      >
        {!isConnected && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Connect Your Wallet</h3>
              <p className="text-sm text-blue-600">
                Connect your PasskeyKit wallet to access all features
              </p>
            </div>
            <Button 
              onClick={handleConnectWallet}
              className="bg-latio-blue hover:bg-blue-600"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        )}

        <DashboardGrid
          walletBalance={isConnected ? mockWalletBalance : null}
          travelPlan={mockTravelPlan}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecentTransactionsSection transactions={mockTransactions} />
          <LocalTipsSection recommendation={mockRecommendation} />
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Index;
