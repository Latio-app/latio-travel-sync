import { account, getContractId, rpc } from "@/lib/passkey";
import { useWalletStore } from "@/store/useStore";
import { useState } from "react";

const WalletConnectButton = () => {
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("🔗 Creating Wallet with Passkey...");

      // 🔐 **Create a Wallet with app name and user ID**
      const wallet = await account.createWallet("LatioApp", "user@example.com");
      console.log("✅ Wallet Created:", wallet);

      // 🔄 **Get Contract ID from the response**
      const contractId = wallet.contractId;
      console.log("🔗 Contract ID:", contractId);

      // 💡 **New Approach to get balance**
      const accountData = await rpc.getAccount(contractId);

      console.log("✅ Account Data:", accountData);

      const balanceXLM = (accountData as any).balances
        ? ((accountData as any).balances.find(
            (b: any) => b.asset_type === "native"
          )?.balance ?? "0")
        : "0";

      console.log("💰 Balance:", balanceXLM);

      // 🌐 **Update Global State**
      setWalletData(contractId, contractId, balanceXLM);
    } catch (error) {
      console.error("❌ Connection Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className={`bg-ocean-blue text-white p-3 rounded-lg ${loading ? "opacity-50" : ""}`}
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
