import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/useStore";

export const TestPasskey = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { connectWallet } = useWalletStore();

  const handleTestSignIn = async () => {
    setIsLoading(true);
    try {
      await connectWallet("test-app", "test-user@example.com");
      console.log("Test sign-in completed");
    } catch (error) {
      console.error("Test sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleTestSignIn} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Test Passkey Connection"}
      </Button>
    </div>
  );
};
