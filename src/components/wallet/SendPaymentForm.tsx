import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore } from "@/store/useStore";
import { useState } from "react";
import { sendStellarPayment } from "@/api/stellarContract";

export const SendPaymentForm = () => {
  const { walletAddress, loading, setError } = useWalletStore();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;

    setIsSending(true);
    try {
      await sendStellarPayment(
        {
          destination,
          amount,
          memo: memo || undefined,
        },
        walletAddress,
        undefined // No travel plan association for now
      );
      setDestination("");
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error("Error sending payment:", error);
      setError("Failed to send payment");
    } finally {
      setIsSending(false);
    }
  };

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to send payments.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter Stellar address"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount (XLM)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Enter memo"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || isSending}
            className="w-full"
          >
            {isSending ? "Sending..." : "Send Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
