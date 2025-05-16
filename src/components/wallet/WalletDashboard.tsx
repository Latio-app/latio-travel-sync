import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/useStore";
import { useEffect } from "react";

interface WalletDashboardProps {
  onRefresh: () => Promise<void>;
}

export const WalletDashboard = ({ onRefresh }: WalletDashboardProps) => {
  const { walletAddress, balance, loading, fetchBalance, setError } =
    useWalletStore();
  console.log(walletAddress);

  useEffect(() => {
    const loadBalance = async () => {
      if (!walletAddress) return;
      try {
        await fetchBalance();
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError("Failed to fetch balance");
      }
    };

    loadBalance();
  }, [walletAddress, fetchBalance, setError]);

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Not Connected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Please connect your wallet to view your balance and transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </h3>
            <p className="text-sm font-mono break-all">{walletAddress}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Stellar Balance
            </h3>
            <p className="text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${balance} XLM`
              )}
            </p>
          </div>
          <Button onClick={onRefresh} disabled={loading} className="w-full">
            {loading ? "Refreshing..." : "Refresh Balance"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
