import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import WalletCard from "@/components/wallet/wallet-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transactions/transaction-list";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  {
    id: "tx3",
    amount: 30,
    asset: "XLM",
    type: "swap" as const,
    description: "XLM to USD",
    recipient: "Exchange",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    txHash: "hashswap123456789",
    _base: {},
  },
  {
    id: "tx4",
    amount: 20,
    asset: "XLM",
    type: "send" as const,
    description: "Souvenir shopping",
    recipient: "Local Shop",
    status: "pending" as const,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    txHash: "hashpending987654321",
    _base: {},
  },
];

// Filter transactions by type
const sentTransactions = mockTransactions.filter((tx) => tx.type === "send");
const receivedTransactions = mockTransactions.filter(
  (tx) => tx.type === "receive"
);
const swappedTransactions = mockTransactions.filter((tx) => tx.type === "swap");

const Wallet = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <>
      <PageContainer
        title="Wallet"
        subtitle="Manage your XLM and local currency"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-latio-blue border-latio-blue"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      >
        <div className="mb-6">
          <WalletCard
            balance={mockWalletBalance}
            onSend={() => alert("Send modal would open here")}
            onSwap={() => alert("Swap modal would open here")}
            onSync={() => alert("Syncing wallet...")}
            className="max-w-xl mx-auto"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-fade-in">
          <h3 className="font-medium text-gray-800 mb-4">
            Transaction History
          </h3>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="swapped">Swapped</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TransactionList transactions={mockTransactions} />
            </TabsContent>

            <TabsContent value="sent">
              <TransactionList transactions={sentTransactions} />
            </TabsContent>

            <TabsContent value="received">
              <TransactionList transactions={receivedTransactions} />
            </TabsContent>

            <TabsContent value="swapped">
              <TransactionList transactions={swappedTransactions} />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Wallet;
