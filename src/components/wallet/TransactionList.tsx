import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore } from "@/store/useStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export const TransactionList = () => {
  const { walletAddress, transactions, loading, fetchTransactions, setError } =
    useWalletStore();

  useEffect(() => {
    const loadTransactions = async () => {
      if (!walletAddress) return;
      try {
        await fetchTransactions();
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions");
      }
    };

    loadTransactions();
  }, [walletAddress, fetchTransactions, setError]);

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to view your transactions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-muted-foreground">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {tx.type === "send" ? "Sent" : "Received"}
                  </p>
                  {tx.destination && (
                    <p className="text-sm text-muted-foreground">
                      {tx.type === "send" ? "To" : "From"}: {tx.destination}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      tx.type === "send" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.type === "send" ? "-" : "+"}
                    {tx.amount} XLM
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
