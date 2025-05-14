
import { useEffect, useState } from "react";
import { useWallet } from "@/components/providers/wallet-provider";
import { useStore } from "@/store/useStore";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const WalletPage = () => {
  const { isConnected, publicKey, connect, disconnect, passkeyKit } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const walletBalance = useStore((state) => state.walletBalance);
  const setWalletBalance = useStore((state) => state.setWalletBalance);

  useEffect(() => {
    // Simulate getting wallet balance when connected
    const fetchBalance = async () => {
      if (isConnected && publicKey) {
        try {
          // In a real app, you would fetch the actual balance from the blockchain
          // For now, we'll use mock data
          setWalletBalance({
            xlm: 425.68,
            preferredCurrency: "USD",
            localAmount: 127.7,
          });
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          toast.error("Failed to fetch wallet balance");
        }
      }
    };

    fetchBalance();
  }, [isConnected, publicKey, setWalletBalance]);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      await connect();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    try {
      disconnect();
      toast.success("Wallet disconnected!");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would refresh the balance from the blockchain
      // For now, we'll just simulate a refresh with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
          {isConnected ? (
            <>
              <Card className="bg-white shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">Your Wallet</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Wallet Address</p>
                      <p className="font-mono text-sm truncate">
                        {publicKey}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Stellar Balance</p>
                      <p className="text-2xl font-bold">
                        {walletBalance?.xlm.toFixed(2)} XLM
                      </p>
                      <p className="text-sm text-gray-500">
                        ≈ {walletBalance?.localAmount.toFixed(2)} {walletBalance?.preferredCurrency}
                      </p>
                    </div>
                    
                    <div className="pt-4 flex space-x-3">
                      <Button className="flex-1" onClick={handleDisconnectWallet}>
                        Disconnect
                      </Button>
                      <Button className="flex-1 bg-latio-blue hover:bg-blue-600">
                        Send <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-4 text-center text-gray-500">
                    <p>No recent transactions</p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white shadow-md text-center py-8">
              <CardContent className="flex flex-col items-center gap-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <WalletIcon className="h-12 w-12 text-latio-blue" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Connect Your Wallet</h3>
                  <p className="text-gray-500">
                    Connect your Stellar wallet to view your balance and transactions
                  </p>
                </div>
                <Button 
                  className="bg-latio-blue hover:bg-blue-600" 
                  size="lg" 
                  onClick={handleConnectWallet}
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WalletPage;
