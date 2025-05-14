import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const mockWalletBalance = {
  xlm: 425.68,
  preferredCurrency: "USD",
  localAmount: 127.7,
};

const mockPublicKey = "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

const WalletPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(mockWalletBalance);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate a refresh with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update with slightly different numbers to simulate a refresh
      setWalletBalance({
        xlm: 425.68 + Math.random() * 2 - 1, // random change +/- 1 XLM
        preferredCurrency: "USD",
        localAmount: 127.7 + Math.random() * 0.5 - 0.25, // random change +/- 0.25 USD
      });

      toast.success("Wallet balance refreshed!");
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      toast.error("Failed to refresh wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageContainer
        title="Wallet"
        subtitle="Manage your Stellar wallet and transactions"
      >
        <div className="space-y-6">
          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Your Wallet</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="font-mono text-sm truncate">{mockPublicKey}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Stellar Balance</p>
                  <p className="text-2xl font-bold">
                    {walletBalance.xlm.toFixed(2)} XLM
                  </p>
                  <p className="text-sm text-gray-500">
                    ≈ {walletBalance.localAmount.toFixed(2)}{" "}
                    {walletBalance.preferredCurrency}
                  </p>
                </div>

                <div className="pt-4 flex space-x-3">
                  <Button className="flex-1 bg-latio-blue hover:bg-blue-600">
                    Send <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4 text-center text-gray-500">
                <p>No recent transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WalletPage;
