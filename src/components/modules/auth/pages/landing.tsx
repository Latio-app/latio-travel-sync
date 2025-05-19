import React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/useStore";
import Navbar from "@/components/layout/navbar";

const LandingPage = () => {
  const { connectWallet, loading } = useWalletStore();
  const app = "stellar-dapp";
  const user = "user@example.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Latio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Your cross-border payment & travel companion. Connect your wallet to
            get started.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button
              onClick={() => connectWallet(app, user)}
              disabled={loading}
              size="lg"
              className="bg-latio-blue hover:bg-blue-600 text-white px-8 py-6 text-lg"
            >
              <Wallet className="h-6 w-6 mr-3" />
              {loading ? "Connecting..." : "Connect Wallet to Continue"}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Secure, fast, and easy cross-border payments powered by Stellar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
