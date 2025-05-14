import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { LoadingState } from "@/components/index/loading-state";
import { DashboardGrid } from "@/components/index/dashboard-grid";
import { RecentTransactionsSection } from "@/components/index/recent-transactions-section";
import { LocalTipsSection } from "@/components/index/local-tips-section";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <PageContainer
        title="Welcome to Latio"
        subtitle="Your cross-border payment & travel companion"
      >
        <DashboardGrid
          walletBalance={mockWalletBalance}
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
