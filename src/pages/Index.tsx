
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import WalletCard from "@/components/wallet/wallet-card";
import TravelCard from "@/components/travel/travel-card";
import TransactionList from "@/components/transactions/transaction-list";
import AIRecommendation from "@/components/recommendations/ai-recommendation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockWalletBalance = {
  xlm: 425.68,
  preferredCurrency: "USD",
  localAmount: 127.70
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
    _base: {}
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
    _base: {}
  }
];

const mockTravelPlan = {
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
};

const mockRecommendation = {
  id: "rec1",
  interactionId: "int1",
  prompt: "Local dining experiences in Mexico City",
  response: "Visit Mercado de San Juan for authentic local cuisine. Try the street tacos at El Huequito, a classic spot since 1959. For a high-end experience, Pujol offers innovative Mexican cuisine.",
  timestamp: new Date().toISOString(),
  contextId: "ctx1",
  intent: "food",
  _base: {}
};

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, we would fetch this data from our API
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full latio-gradient animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500">Loading Latio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageContainer 
        title="Welcome to Latio" 
        subtitle="Your cross-border payment & travel companion"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {/* Wallet Card Section */}
          <WalletCard 
            balance={mockWalletBalance}
            onSend={() => navigate("/wallet")}
            onSwap={() => navigate("/wallet")}
            onSync={() => alert("Syncing wallet...")}
          />
          
          {/* Current Travel Section */}
          <TravelCard 
            travelPlan={mockTravelPlan}
            onViewDetails={() => navigate("/travel")}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Latest Transactions Section */}
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-latio-blue hover:text-latio-blue hover:bg-blue-50"
                onClick={() => navigate("/transactions")}
              >
                View All
              </Button>
            </div>
            <TransactionList transactions={mockTransactions} />
          </div>
          
          {/* AI Recommendation Section */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Local Tips</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="text-latio-green border-latio-green hover:bg-latio-green hover:text-white"
                onClick={() => navigate("/recommendations")}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </Button>
            </div>
            <AIRecommendation 
              recommendation={mockRecommendation}
              onLike={() => alert("Thanks for your feedback!")}
              onDislike={() => alert("We'll improve our recommendations.")}
            />
          </div>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Index;
